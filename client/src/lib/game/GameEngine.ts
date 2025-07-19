import { Chicken } from "./Chicken";
import { Level } from "./Level";
import { Physics } from "./Physics";
import { Renderer } from "./Renderer";

interface GameState {
  score: number;
  lives: number;
  isPaused: boolean;
  hasWon: boolean;
  level: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private chicken: Chicken;
  private level: Level;
  private physics: Physics;
  private renderer: Renderer;
  private isRunning = false;
  private isPaused = false;
  private animationFrameId: number | null = null;
  private lastTime = 0;

  // Callbacks
  public onGameStateChange: ((updates: Partial<GameState>) => void) | null = null;
  public onGameEnd: ((hasWon: boolean) => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = ctx;

    // Initialize game components
    this.chicken = new Chicken(100, 400);
    this.level = new Level();
    this.physics = new Physics();
    this.renderer = new Renderer(this.ctx);

    // Set up event listeners
    this.setupKeyboardFallback();
  }

  private setupKeyboardFallback() {
    // Keyboard fallback controls
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning || this.isPaused) return;

      switch (e.code) {
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          this.chicken.jump();
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.chicken.setSpeed(-2);
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.chicken.setSpeed(2);
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isRunning || this.isPaused) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
          this.chicken.setSpeed(1); // Default forward speed
          break;
      }
    });
  }

  public setVoiceInput(level: number) {
    if (!this.isRunning || this.isPaused) return;

    // Convert voice level to chicken actions
    if (level < 0.1) {
      // Silent - stop or very slow movement
      this.chicken.setSpeed(0.5);
    } else if (level < 0.3) {
      // Whisper - slow walk
      this.chicken.setSpeed(1);
    } else if (level < 0.7) {
      // Normal talk - fast walk
      this.chicken.setSpeed(3);
    } else {
      // Shout - jump!
      this.chicken.jump();
    }
  }

  public start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (!this.isRunning) return;
    
    this.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public restart() {
    this.stop();
    
    // Reset game state
    this.chicken = new Chicken(100, 400);
    this.level = new Level();
    
    // Restart the game
    this.start();
  }

  private gameLoop = (currentTime: number = performance.now()) => {
    if (!this.isRunning || this.isPaused) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update game logic
    this.update(deltaTime);
    
    // Render
    this.render();

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    // Update chicken physics
    this.physics.updateChicken(this.chicken, deltaTime);
    
    // Check collisions with level
    const collision = this.physics.checkCollisions(this.chicken, this.level);
    
    if (collision.type === 'platform') {
      this.chicken.land(collision.y);
    } else if (collision.type === 'ground') {
      this.chicken.land(collision.y);
    } else if (collision.type === 'death') {
      this.handleDeath();
      return;
    }

    // Update score based on distance traveled
    const newScore = Math.max(0, this.chicken.x - 50); // Start scoring after initial position
    this.onGameStateChange?.({ score: newScore });

    // Check win condition (reached end of level)
    if (this.chicken.x >= this.level.endX) {
      this.handleWin();
    }

    // Check if chicken fell off the bottom of the screen
    if (this.chicken.y > this.canvas.height + 100) {
      this.handleDeath();
    }
  }

  private render() {
    // Clear canvas
    this.renderer.clear(this.canvas.width, this.canvas.height);
    
    // Calculate camera position (follow chicken)
    const cameraX = Math.max(0, this.chicken.x - this.canvas.width / 3);
    
    // Render level
    this.renderer.renderLevel(this.level, cameraX);
    
    // Render chicken
    this.renderer.renderChicken(this.chicken, cameraX);
  }

  private handleDeath() {
    // Decrease lives
    this.onGameStateChange?.({ lives: Math.max(0, 3 - 1) }); // Simplified for now
    
    // End game for now (could implement respawn logic)
    this.onGameEnd?.(false);
  }

  private handleWin() {
    this.onGameEnd?.(true);
  }
}
