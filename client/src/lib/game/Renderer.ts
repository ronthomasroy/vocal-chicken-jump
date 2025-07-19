import { Chicken } from "./Chicken";
import { Level } from "./Level";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public clear(width: number, height: number) {
    // Draw enhanced sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.3, '#B0E0E6'); // Powder blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#90EE90'); // Light green

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw enhanced background elements
    this.drawBackground(width, height);
  }

  private drawBackground(width: number, height: number) {
    // Draw mountains in the distance
    this.drawMountains(width, height);
    
    // Draw clouds
    this.drawClouds(width, height);
    
    // Draw distant trees
    this.drawDistantTrees(width, height);
    
    // Draw sun
    this.drawSun(width, height);
  }

  private drawMountains(width: number, height: number) {
    this.ctx.fillStyle = 'rgba(139, 69, 19, 0.3)'; // Semi-transparent brown
    
    // Draw mountain silhouettes
    this.ctx.beginPath();
    this.ctx.moveTo(0, height * 0.6);
    this.ctx.lineTo(width * 0.2, height * 0.4);
    this.ctx.lineTo(width * 0.4, height * 0.5);
    this.ctx.lineTo(width * 0.6, height * 0.3);
    this.ctx.lineTo(width * 0.8, height * 0.45);
    this.ctx.lineTo(width, height * 0.55);
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawClouds(width: number, height: number) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Static clouds that move with camera
    const cloudPositions = [
      { x: 150, y: 60, size: 25 },
      { x: 400, y: 90, size: 35 },
      { x: 700, y: 45, size: 30 },
      { x: 1000, y: 80, size: 40 },
      { x: 1300, y: 110, size: 28 },
      { x: 1600, y: 70, size: 32 },
    ];

    cloudPositions.forEach(cloud => {
      this.drawCloud(cloud.x, cloud.y, cloud.size);
    });
  }

  private drawDistantTrees(width: number, height: number) {
    this.ctx.fillStyle = 'rgba(34, 139, 34, 0.4)'; // Semi-transparent green
    
    // Draw simplified tree shapes in the background
    const treePositions = [
      { x: 100, y: height * 0.62, height: 60 },
      { x: 250, y: height * 0.65, height: 50 },
      { x: 380, y: height * 0.61, height: 65 },
      { x: 520, y: height * 0.63, height: 55 },
      { x: 680, y: height * 0.64, height: 45 },
      { x: 820, y: height * 0.62, height: 70 },
    ];

    treePositions.forEach(tree => {
      // Tree trunk
      this.ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
      this.ctx.fillRect(tree.x - 3, tree.y, 6, tree.height * 0.4);
      
      // Tree crown
      this.ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
      this.ctx.beginPath();
      this.ctx.arc(tree.x, tree.y - tree.height * 0.3, tree.height * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private drawSun(width: number, height: number) {
    // Draw sun in upper right
    const sunX = width * 0.85;
    const sunY = height * 0.15;
    
    // Sun rays
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      this.ctx.beginPath();
      this.ctx.moveTo(
        sunX + Math.cos(angle) * 35,
        sunY + Math.sin(angle) * 35
      );
      this.ctx.lineTo(
        sunX + Math.cos(angle) * 50,
        sunY + Math.sin(angle) * 50
      );
      this.ctx.stroke();
    }
    
    // Sun body
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Sun inner glow
    this.ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawCloud(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.5, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.5, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  public renderLevel(level: Level, cameraX: number) {
    // Draw lava ground (deadly)
    this.drawLavaGround(-cameraX, level.groundY, this.ctx.canvas.width + 200, 200);

    // Draw platforms
    level.platforms.forEach(platform => {
      this.drawPlatform(platform.x - cameraX, platform.y, platform.width, platform.height);
    });

    // Draw finish line
    this.drawFinishLine(level.endX - cameraX, level.groundY);
  }

  private drawLavaGround(x: number, y: number, width: number, height: number) {
    // Lava base
    const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, '#FF4500'); // Orange red
    gradient.addColorStop(0.3, '#FF6347'); // Tomato
    gradient.addColorStop(0.7, '#DC143C'); // Crimson
    gradient.addColorStop(1, '#8B0000'); // Dark red

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);

    // Lava bubbles animation
    const time = Date.now() * 0.001;
    this.ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
    
    for (let i = 0; i < 20; i++) {
      const bubbleX = x + (i * width / 20) + Math.sin(time * 2 + i) * 10;
      const bubbleY = y + 10 + Math.sin(time * 3 + i * 0.5) * 5;
      const bubbleSize = 3 + Math.sin(time * 4 + i * 0.8) * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Lava glow effect
    this.ctx.strokeStyle = '#FFD700'; // Gold glow
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, 20);
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

  public renderRespawnOverlay(respawnTimer: number) {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Respawn message
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'Respawning...', 
      this.ctx.canvas.width / 2, 
      this.ctx.canvas.height / 2 - 40
    );

    // Countdown timer
    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = '#FF6B6B';
    this.ctx.fillText(
      Math.ceil(respawnTimer).toString(), 
      this.ctx.canvas.width / 2, 
      this.ctx.canvas.height / 2 + 20
    );

    // Warning message
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillText(
      'Avoid the lava! Jump between platforms!', 
      this.ctx.canvas.width / 2, 
      this.ctx.canvas.height / 2 + 80
    );
  }
}
