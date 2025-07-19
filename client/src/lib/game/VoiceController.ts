export class VoiceController {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isInitialized = false;
  private isRunning = false;
  private animationFrame: number | null = null;

  // Calibration values - more sensitive settings
  private minLevel = 0;
  private maxLevel = 120; // Lower max for better sensitivity
  private smoothedLevel = 0;
  private smoothingFactor = 0.7; // Faster response

  public onVoiceLevelChange: ((level: number) => void) | null = null;

  public async initialize(): Promise<void> {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyser - optimized for voice detection
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512; // Higher resolution
      this.analyser.smoothingTimeConstant = 0.3; // Less smoothing for responsiveness

      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      // Create data array for frequency data
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.isInitialized = true;
      console.log('Voice controller initialized successfully');

      // Start calibration
      this.startCalibration();
    } catch (error) {
      console.error('Failed to initialize voice controller:', error);
      throw error;
    }
  }

  private startCalibration() {
    console.log('Starting voice calibration... Please remain quiet for 2 seconds');
    
    // Calibrate minimum level (background noise)
    setTimeout(() => {
      this.calibrateMinLevel();
    }, 1000);
  }

  private calibrateMinLevel() {
    const samples: number[] = [];
    let sampleCount = 0;
    const maxSamples = 30; // Sample for about 1 second

    const calibrateLoop = () => {
      if (!this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);
      const average = this.dataArray.reduce((sum, value) => sum + value, 0) / this.dataArray.length;
      samples.push(average);
      sampleCount++;

      if (sampleCount < maxSamples) {
        setTimeout(calibrateLoop, 33); // ~30 FPS
      } else {
        this.minLevel = Math.max(0, samples.reduce((sum, val) => sum + val, 0) / samples.length);
        console.log(`Calibrated minimum level: ${this.minLevel}`);
        console.log('Calibration complete! You can now use voice controls.');
      }
    };

    calibrateLoop();
  }

  public start() {
    if (!this.isInitialized || this.isRunning) return;

    this.isRunning = true;
    this.processAudio();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private processAudio = () => {
    if (!this.isRunning || !this.analyser || !this.dataArray) return;

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);

    // Focus on voice frequency range (85-255 Hz human voice fundamental)
    const voiceRange = this.dataArray.slice(10, 80); // Focus on voice frequencies
    const average = voiceRange.reduce((sum, value) => sum + value, 0) / voiceRange.length;

    // Normalize the level (0 to 1) with improved sensitivity
    const normalizedLevel = Math.max(0, (average - this.minLevel) / (this.maxLevel - this.minLevel));

    // Apply smoothing
    this.smoothedLevel += (normalizedLevel - this.smoothedLevel) * this.smoothingFactor;

    // Clamp between 0 and 1 with slight boost for low levels
    const boostedLevel = Math.pow(this.smoothedLevel, 0.7); // Gamma correction for sensitivity
    const finalLevel = Math.max(0, Math.min(1, boostedLevel));

    // Call the callback
    if (this.onVoiceLevelChange) {
      this.onVoiceLevelChange(finalLevel);
    }

    // Continue processing
    this.animationFrame = requestAnimationFrame(this.processAudio);
  };

  public destroy() {
    this.stop();
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.dataArray = null;
    this.isInitialized = false;
  }
}
