export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Level {
  public platforms: Platform[] = [];
  public groundY: number = 500;
  public endX: number = 2000; // Level end position

  constructor() {
    this.generateLevel();
  }

  private generateLevel() {
    // Starting platform
    this.platforms.push({
      x: 0,
      y: this.groundY,
      width: 200,
      height: 20
    });

    // Create a series of platforms with gaps
    let currentX = 300;
    const platformConfigs = [
      { gap: 100, width: 120, height: 20 },
      { gap: 150, width: 100, height: 20 },
      { gap: 80, width: 140, height: 20 },
      { gap: 200, width: 80, height: 20 },
      { gap: 120, width: 160, height: 20 },
      { gap: 180, width: 100, height: 20 },
      { gap: 90, width: 200, height: 20 },
    ];

    platformConfigs.forEach((config, index) => {
      currentX += config.gap;
      
      // Vary platform heights
      const heightVariation = Math.sin(index * 0.8) * 100;
      const platformY = this.groundY - 50 + heightVariation;

      this.platforms.push({
        x: currentX,
        y: platformY,
        width: config.width,
        height: config.height
      });

      currentX += config.width;
    });

    // Final platform
    this.platforms.push({
      x: currentX + 100,
      y: this.groundY - 20,
      width: 200,
      height: 20
    });

    // Set end position
    this.endX = currentX + 300;
  }
}
