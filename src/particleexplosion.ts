import { Particle } from './circle'
import { PhysicsAxis } from './physics'

export class ParticleExplosion {
  private particles: [Particle, string][];

  public constructor(private x: number, private y: number) {
    this.particles = new Array<[Particle, string]>();
    for (let i = 0; i < 200 + (Math.random() * 800); i++) {
      let p: [Particle, string] = [new Particle(new PhysicsAxis(this.x, (Math.random() - 0.5) * 1500, 0), 
                          new PhysicsAxis(this.y, (Math.random() - 0.5) * 1500, 1900),
                          1 + Math.random() * 2, 300 + Math.random() * 1200),
              this.getRandomColor()];
      this.particles.push(p);
    }
  }

  private getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public get isAlive(): boolean {
    return this.particles.some(p => p[0].isAlive);
  }

  public update(deltaMS: number) {  
    this.particles = this.particles.filter(p => p[0].isAlive);
    for (let p of this.particles) {
      p[0].update(deltaMS);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.particles.length > 0) {
      for (let p of this.particles) {
        ctx.save();
        ctx.fillStyle = p[1];
        p[0].draw(ctx);
        ctx.restore();
      }
    }
  }
}