export class Chicken {
  public x: number;
  public y: number;
  public velocityX: number = 0;
  public velocityY: number = 0;
  public isOnGround: boolean = false;
  public width: number = 40;
  public height: number = 40;
  
  private speed: number = 1;
  private jumpPower: number = 400;
  private animationTime: number = 0;
  private isJumping: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocityX = 0; // Start completely stationary
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    this.velocityX = speed * 60; // Convert to pixels per second
  }

  public jump() {
    if (this.isOnGround && !this.isJumping) {
      this.velocityY = -this.jumpPower;
      this.isOnGround = false;
      this.isJumping = true;
    }
  }

  public land(y: number) {
    this.y = y;
    this.velocityY = 0;
    this.isOnGround = true;
    this.isJumping = false;
  }

  public update(deltaTime: number) {
    this.animationTime += deltaTime;
    
    // Reset jumping flag when falling
    if (this.velocityY > 0) {
      this.isJumping = false;
    }
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public getAnimationFrame(): 'walk' | 'jump' {
    return this.isJumping || !this.isOnGround ? 'jump' : 'walk';
  }

  public getWalkCycle(): number {
    // Return a value between 0 and 1 for walk animation
    return (Math.sin(this.animationTime * 8) + 1) / 2;
  }
}
