import { Particle } from './circle'
import { PhysicsAxis } from './physics'

class ParticleShower {
  private particles: Particle[];

  public constructor(private x: number, private y: number) {
    this.particles = new Array<Particle>();
  }

  public update(deltaMS: number) {
    if (Math.random() < 0.5) {
      let p = new Particle(new PhysicsAxis(this.x, (Math.random() - 0.5) * 200, 0), 
                          new PhysicsAxis(this.y, -(Math.random() * 800), 1900),
                          2 + (Math.random() * 8), 200 + Math.random() * 1800);
      this.particles.push(p);
      this.particles = this.particles.filter(p => p.isAlive);
      
    }
    for (let p of this.particles) {
      p.update(deltaMS);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.particles.length > 0) {
      for (let p of this.particles) {
        p.draw(ctx);
      }
    }
  }
}