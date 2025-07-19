import { Chicken } from "./Chicken";
import { Level, Platform } from "./Level";

interface Collision {
  type: 'none' | 'platform' | 'ground' | 'death';
  x?: number;
  y?: number;
}

export class Physics {
  private gravity = 800; // pixels per second squared
  private terminalVelocity = 600; // maximum fall speed

  public updateChicken(chicken: Chicken, deltaTime: number) {
    // Apply gravity if not on ground
    if (!chicken.isOnGround) {
      chicken.velocityY += this.gravity * deltaTime;
      
      // Limit falling speed
      if (chicken.velocityY > this.terminalVelocity) {
        chicken.velocityY = this.terminalVelocity;
      }
    }

    // Update position based on velocity
    chicken.x += chicken.velocityX * deltaTime;
    chicken.y += chicken.velocityY * deltaTime;

    // Update chicken state
    chicken.update(deltaTime);
  }

  public checkCollisions(chicken: Chicken, level: Level): Collision {
    const chickenBounds = chicken.getBounds();
    
    // Check platform collisions
    for (const platform of level.platforms) {
      if (this.isCollidingWithPlatform(chickenBounds, platform)) {
        // Only land on platform if chicken is falling and above the platform
        if (chicken.velocityY >= 0 && chickenBounds.y < platform.y) {
          return {
            type: 'platform',
            y: platform.y - chickenBounds.height
          };
        }
      }
    }

    // Check ground collision
    const groundY = level.groundY;
    if (chickenBounds.y + chickenBounds.height >= groundY) {
      return {
        type: 'ground',
        y: groundY - chickenBounds.height
      };
    }

    // Check death zones (gaps in platforms)
    if (chicken.y > groundY + 200) {
      return { type: 'death' };
    }

    return { type: 'none' };
  }

  private isCollidingWithPlatform(
    chickenBounds: { x: number; y: number; width: number; height: number },
    platform: Platform
  ): boolean {
    return (
      chickenBounds.x < platform.x + platform.width &&
      chickenBounds.x + chickenBounds.width > platform.x &&
      chickenBounds.y < platform.y + platform.height &&
      chickenBounds.y + chickenBounds.height > platform.y
    );
  }
}
