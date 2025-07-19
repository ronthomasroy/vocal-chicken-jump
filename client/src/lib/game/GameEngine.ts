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

interface SpawnPoint {
  x: number;
  y: number;
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
  private currentLives = 3;
  private spawnPoint: SpawnPoint = { x: 100, y: 400 };
  private isRespawning = false;
  private respawnTimer = 0;

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
    this.chicken = new Chicken(this.spawnPoint.x, this.spawnPoint.y);
    this.level = new Level();
    this.physics = new Physics();
    this.renderer = new Renderer(this.ctx);
    this.currentLives = 3; // Initialize lives

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
          this.chicken.setSpeed(0); // Stop when keys released
          break;
      }
    });
  }

  public setVoiceInput(level: number) {
    if (!this.isRunning || this.isPaused || this.isRespawning) return;

    // Pass voice level to chicken for variable jump power
    this.chicken.setVoiceLevel(level);

    // Convert voice level to chicken actions - balanced sensitivity
    if (level < 0.08) {
      // Silent - completely stop
      this.chicken.setSpeed(0);
    } else if (level < 0.25) {
      // Whisper - slow walk
      this.chicken.setSpeed(1);
    } else if (level < 0.45) {
      // Normal talk - fast walk
      this.chicken.setSpeed(3);
    } else {
      // Shout - jump with intensity-based power!
      this.chicken.jump(level);
      this.chicken.setSpeed(3); // Keep moving forward when jumping
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
    this.currentLives = 3;
    this.isRespawning = false;
    this.respawnTimer = 0;
    this.chicken = new Chicken(this.spawnPoint.x, this.spawnPoint.y);
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
    // Handle respawning
    if (this.isRespawning) {
      this.respawnTimer -= deltaTime;
      if (this.respawnTimer <= 0) {
        this.respawnChicken();
      }
      return; // Don't update game during respawn
    }

    // Update chicken physics
    this.physics.updateChicken(this.chicken, deltaTime);
    
    // Check collisions with level
    const collision = this.physics.checkCollisions(this.chicken, this.level);
    
    if (collision.type === 'platform') {
      this.chicken.land(collision.y);
      // Update spawn point when landing on a platform
      this.updateSpawnPoint(this.chicken.x, collision.y);
    } else if (collision.type === 'ground') {
      this.chicken.land(collision.y);
    } else if (collision.type === 'death') {
      this.handleDeath();
      return;
    }

    // Check win condition first (before updating score)
    if (this.chicken.x >= this.level.endX) {
      this.handleWin();
      return; // Stop processing updates after win
    }

    // Update score based on distance traveled (only if game hasn't ended)
    const newScore = Math.max(0, this.chicken.x - 50); // Start scoring after initial position
    this.onGameStateChange?.({ score: newScore });

    // Check for lava death (fell into ground level or below)
    if (this.chicken.y >= this.level.groundY - 10) {
      this.handleDeath();
      return;
    }

    // Check if chicken fell way off the screen
    if (this.chicken.y > this.canvas.height + 200) {
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
    
    // Render chicken (unless respawning)
    if (!this.isRespawning) {
      this.renderer.renderChicken(this.chicken, cameraX);
    }

    // Render respawn overlay if needed
    if (this.isRespawning) {
      this.renderer.renderRespawnOverlay(this.respawnTimer);
    }
  }

  private handleDeath() {
    this.currentLives--;
    this.onGameStateChange?.({ lives: this.currentLives });
    
    if (this.currentLives <= 0) {
      // Game over
      this.onGameEnd?.(false);
    } else {
      // Start respawn process
      this.isRespawning = true;
      this.respawnTimer = 2.0; // 2 second respawn delay
    }
  }

  private respawnChicken() {
    this.chicken = new Chicken(this.spawnPoint.x, this.spawnPoint.y);
    this.isRespawning = false;
    this.respawnTimer = 0;
  }

  private updateSpawnPoint(x: number, y: number) {
    // Only update spawn point if we've progressed forward
    if (x > this.spawnPoint.x + 100) {
      this.spawnPoint.x = x;
      this.spawnPoint.y = y - 50; // Spawn slightly above the platform
    }
  }

  private handleWin() {
    this.onGameEnd?.(true);
  }
}
