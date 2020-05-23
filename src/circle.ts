import { PhysicsAxis } from './physics'

abstract class Circle {

  /**
   * 
   * @param x X axis properties
   * @param y Y axis properties
   * @param r radius of circle
   */
  public constructor(protected x: PhysicsAxis, 
    protected y: PhysicsAxis,
    protected r: number) { 
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x.pos, this.y.pos, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  // basic update - move x and y based on aX, aY, and vX, vY.
  // bounce off the sides of the canvas area
  public update(deltaMS: number) {
    this.x.calcEulerStep(deltaMS, this.r, window.innerWidth - this.r, (maxHit, velAtHit) => -velAtHit);
    this.y.calcEulerStep(deltaMS, this.r, window.innerHeight - this.r, (maxHit, velAtHit) => maxHit ? -velAtHit * 0.4 : -velAtHit);
  }
}

export class Particle extends Circle {
  public constructor(x: PhysicsAxis, 
    y: PhysicsAxis,
    r: number,
    protected lifespan: number) {
      super(x, y, r);
      this.liveTime = 0;
  }

  private liveTime: number;

  public get isAlive(): boolean {
    return this.liveTime < this.lifespan;
  }

  public update(deltaMS: number) {
    super.update(deltaMS);
    this.liveTime += deltaMS;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = 0.5 + ((1 - this.liveTime / this.lifespan) / 2);
    super.draw(ctx);
    ctx.restore();
  }
}