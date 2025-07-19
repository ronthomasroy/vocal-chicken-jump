export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Level {
  public platforms: Platform[] = [];
  public groundY: number = 500;
  public endX: number = 4000; // Much longer level

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

    // Create a much longer series of platforms with more variety
    let currentX = 300;
    const platformConfigs = [
      // Easy section
      { gap: 80, width: 140, height: 20 },
      { gap: 100, width: 120, height: 20 },
      { gap: 90, width: 130, height: 20 },
      { gap: 110, width: 100, height: 20 },
      
      // Medium section - larger gaps
      { gap: 150, width: 100, height: 20 },
      { gap: 180, width: 80, height: 20 },
      { gap: 160, width: 120, height: 20 },
      { gap: 200, width: 90, height: 20 },
      { gap: 170, width: 110, height: 20 },
      
      // Challenge section - varied heights and gaps
      { gap: 120, width: 80, height: 20 },
      { gap: 220, width: 70, height: 20 },
      { gap: 130, width: 100, height: 20 },
      { gap: 250, width: 60, height: 20 },
      { gap: 140, width: 90, height: 20 },
      
      // Expert section - high platforms and large gaps
      { gap: 180, width: 80, height: 20 },
      { gap: 280, width: 70, height: 20 },
      { gap: 200, width: 90, height: 20 },
      { gap: 300, width: 60, height: 20 },
      { gap: 160, width: 100, height: 20 },
      
      // Final challenging section
      { gap: 220, width: 80, height: 20 },
      { gap: 240, width: 70, height: 20 },
      { gap: 260, width: 90, height: 20 },
      { gap: 320, width: 60, height: 20 },
      { gap: 180, width: 120, height: 20 },
    ];

    platformConfigs.forEach((config, index) => {
      currentX += config.gap;
      
      // More complex height variations for increased difficulty
      let heightVariation = 0;
      if (index < 4) {
        // Easy section - minimal height variation
        heightVariation = Math.sin(index * 0.5) * 30;
      } else if (index < 9) {
        // Medium section - moderate height variation
        heightVariation = Math.sin(index * 0.7) * 60;
      } else if (index < 14) {
        // Challenge section - larger height variation
        heightVariation = Math.sin(index * 0.9) * 90;
      } else if (index < 19) {
        // Expert section - high platforms
        heightVariation = Math.sin(index * 1.1) * 120 - 60; // Higher platforms
      } else {
        // Final section - mixed heights
        heightVariation = Math.sin(index * 1.3) * 100 + Math.cos(index * 0.8) * 40;
      }
      
      const platformY = this.groundY - 50 + heightVariation;

      this.platforms.push({
        x: currentX,
        y: platformY,
        width: config.width,
        height: config.height
      });

      currentX += config.width;
    });

    // Final victory platform
    this.platforms.push({
      x: currentX + 150,
      y: this.groundY - 20,
      width: 300,
      height: 20
    });

    // Set end position - much longer level
    this.endX = currentX + 450;
  }
}
