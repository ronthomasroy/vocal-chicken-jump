import { Chicken } from "./Chicken";
import { Level } from "./Level";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public clear(width: number, height: number) {
    // Draw sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.6, '#98D8E8'); // Lighter blue
    gradient.addColorStop(1, '#90EE90'); // Light green

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw simple clouds
    this.drawClouds(width, height);
  }

  private drawClouds(width: number, height: number) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Static clouds that move with camera
    const cloudPositions = [
      { x: 200, y: 80, size: 30 },
      { x: 600, y: 120, size: 40 },
      { x: 1000, y: 60, size: 35 },
      { x: 1400, y: 100, size: 25 },
    ];

    cloudPositions.forEach(cloud => {
      this.drawCloud(cloud.x, cloud.y, cloud.size);
    });
  }

  private drawCloud(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.5, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.5, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  public renderLevel(level: Level, cameraX: number) {
    // Draw ground
    this.ctx.fillStyle = '#228B22'; // Forest green
    this.ctx.fillRect(-cameraX, level.groundY, 3000, 200);

    // Draw grass texture on ground
    this.ctx.fillStyle = '#32CD32'; // Lime green
    for (let x = -cameraX; x < -cameraX + this.ctx.canvas.width + 100; x += 20) {
      if (x % 40 === 0) {
        this.ctx.fillRect(x, level.groundY, 3, 8);
      }
    }

    // Draw platforms
    level.platforms.forEach(platform => {
      this.drawPlatform(platform.x - cameraX, platform.y, platform.width, platform.height);
    });

    // Draw finish line
    this.drawFinishLine(level.endX - cameraX, level.groundY);
  }

  private drawPlatform(x: number, y: number, width: number, height: number) {
    // Platform base
    this.ctx.fillStyle = '#8B4513'; // Brown
    this.ctx.fillRect(x, y, width, height);

    // Platform border
    this.ctx.strokeStyle = '#654321'; // Darker brown
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Grass on top of platform
    this.ctx.fillStyle = '#32CD32'; // Lime green
    for (let grassX = x; grassX < x + width; grassX += 15) {
      this.ctx.fillRect(grassX, y - 3, 2, 3);
    }
  }

  private drawFinishLine(x: number, groundY: number) {
    if (x < -100 || x > this.ctx.canvas.width + 100) return;

    // Flag pole
    this.ctx.fillStyle = '#8B4513'; // Brown
    this.ctx.fillRect(x, groundY - 150, 8, 150);

    // Flag
    this.ctx.fillStyle = '#FF6B6B'; // Red
    this.ctx.fillRect(x + 8, groundY - 140, 60, 40);

    // Flag pattern
    this.ctx.fillStyle = '#FFF'; // White
    this.ctx.fillRect(x + 8, groundY - 140, 60, 8);
    this.ctx.fillRect(x + 8, groundY - 124, 60, 8);
    this.ctx.fillRect(x + 8, groundY - 108, 60, 8);

    // Finish text
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('FINISH!', x + 38, groundY - 160);
  }

  public renderChicken(chicken: Chicken, cameraX: number) {
    const x = chicken.x - cameraX;
    const y = chicken.y;

    // Don't render if off screen
    if (x < -100 || x > this.ctx.canvas.width + 100) return;

    this.drawChicken(x, y, chicken.getAnimationFrame(), chicken.getWalkCycle());
  }

  private drawChicken(x: number, y: number, animation: 'walk' | 'jump', walkCycle: number) {
    this.ctx.save();
    this.ctx.translate(x + 20, y + 20); // Center of chicken

    // Body (oval)
    this.ctx.fillStyle = '#FFFACD'; // Light yellow
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 18, 15, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Body outline
    this.ctx.strokeStyle = '#FFD700'; // Gold
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Head
    this.ctx.fillStyle = '#FFFACD';
    this.ctx.beginPath();
    this.ctx.arc(-8, -10, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Beak
    this.ctx.fillStyle = '#FF8C00'; // Orange
    this.ctx.beginPath();
    this.ctx.moveTo(-18, -10);
    this.ctx.lineTo(-25, -8);
    this.ctx.lineTo(-18, -6);
    this.ctx.closePath();
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(-12, -13, 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Eye highlight
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.arc(-11, -14, 1, 0, Math.PI * 2);
    this.ctx.fill();

    // Wings (animation based)
    if (animation === 'jump') {
      // Flapping wings
      this.ctx.fillStyle = '#FFFACD';
      this.ctx.beginPath();
      this.ctx.ellipse(-5, -5, 8, 4, -0.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.ellipse(5, -5, 8, 4, 0.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      // Folded wings
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.ellipse(-2, -2, 6, 8, 0.3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }

    // Legs (animation based)
    const legOffset = animation === 'walk' ? Math.sin(walkCycle * Math.PI * 2) * 2 : 0;
    
    this.ctx.strokeStyle = '#FF8C00'; // Orange
    this.ctx.lineWidth = 3;
    
    // Left leg
    this.ctx.beginPath();
    this.ctx.moveTo(-8, 12);
    this.ctx.lineTo(-8 + legOffset, 22);
    this.ctx.stroke();
    
    // Right leg
    this.ctx.beginPath();
    this.ctx.moveTo(8, 12);
    this.ctx.lineTo(8 - legOffset, 22);
    this.ctx.stroke();

    // Feet
    this.ctx.fillStyle = '#FF8C00';
    this.ctx.fillRect(-12 + legOffset, 22, 8, 3);
    this.ctx.fillRect(4 - legOffset, 22, 8, 3);

    this.ctx.restore();
  }
}
