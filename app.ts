// I followed the instructions here to setup the project to transpile and run within VSCode:
// https://code.visualstudio.com/docs/typescript/typescript-compiling


// google Kuler to get info about matching colour schemes (pastels that go with one another etc)

  // this youtube course is useful:
  //https://www.youtube.com/watch?v=yq2au9EfeRQ


  // this is a really good resource for circle/rectangle collision detection:
  // http://www.jeffreythompson.org/collision-detection/circle-rect.php

  //

interface LimitsHitVelocityHandler {
  (maxHit: boolean, velAtHit: number) : number;
}

class PhysicsAxis {

  /**
   * 
   * @param pos 
   * @param vel in pixels / sec
   * @param acc in pixels / sec^-2
   */
  public constructor(public pos:number, public vel: number, public acc:number) {
  }

  /**
   * Not an accurate way to calculate axis position of a moving object - Velocity Verlet would
   * give better accuracy. But for our purposes, it's fine.
   * @param stepTimeInMS the time step in milliseconds
   */
  public calcEulerStep(stepTimeInMS: number, minLimit: number = 0, maxLimit: number = window.innerWidth, collisionHandler: LimitsHitVelocityHandler): void {
    let dX = stepTimeInMS / 1000;
    let newVel = this.vel + (this.acc * dX);
    let newPos = this.pos + (this.vel * dX);

    let overTravel = newPos - maxLimit;
    let underTravel = minLimit - newPos;
    if (overTravel > 0) {
      // hit max limit. split into two calcs, 1st to max, 2nd from max
      let firstDx = (maxLimit - this.pos) / this.vel;
      newVel = this.vel + (this.acc * firstDx);
      newPos = maxLimit;

      // at this point, we need to know what to do with the object.
      newVel = collisionHandler(true, newVel);

      let residualDx = dX - firstDx;
      newVel += this.acc * residualDx;
      newPos += newVel * residualDx;
    }
    else if (underTravel > 0) {
      // hit min limit. split into two calcs, 1st to min, 2nd from min
      let firstDx = (minLimit - this.pos) / this.vel;
      newVel = this.vel + (this.acc * firstDx);
      newPos = minLimit;

      // at this point, we need to know what to do with the object. collision strategy?
      // for now, hard code perfect reflection
      newVel = collisionHandler(false, newVel);

      let residualDx = dX - firstDx;
      newVel += this.acc * residualDx;
      newPos += newVel * residualDx;
    }

    this.vel = newVel;
    this.pos = newPos;
  }
}

class Circle {

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

class Particle extends Circle {
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

class ParticleExplosion {
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

class BallGame {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  /*
  private paint: boolean;
  
  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];
*/

  private lastModelUpdateTime: number;

  private ball: Circle;

  private explosions: Array<ParticleExplosion>;

  private clickHandlerEventHandler: any;
  
  constructor() {
      this.canvas = document.getElementById('gamecanvas') as
                   HTMLCanvasElement;
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
      this.context = this.canvas.getContext("2d");

      // TODO: work out how best to resize the canvas and resize the game
      // components.
      /*
      window.addEventListener('resize', ev => {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
      })
      */
  
      // TODO: place ball on surface of bat
      /*this.ball = new Circle(
        new PhysicsAxis(Math.random() * window.innerWidth, 200, 0),
        new PhysicsAxis(Math.random() * window.innerHeight, -130, 1900),
        20);
        */
       
       
       // this.particleShower = new ParticleShower(window.innerWidth / 2, window.innerHeight / 2);
       this.explosions = new Array<ParticleExplosion>();
       this.clickHandlerEventHandler = this.clickEventHandler.bind(this);
       this.canvas.addEventListener("mousedown", this.clickHandlerEventHandler)
  }

  private clickEventHandler(e: MouseEvent) {
    let audio = new Audio();
    audio.src = "firework_explosion_fizz_001.mp3";
    audio.load();
    audio.play();

    setTimeout( () => { 
      this.explosions.push(
        new ParticleExplosion(e.pageX - this.canvas.offsetLeft, 
                              e.pageY - this.canvas.offsetTop)); 
      }, 400);

    
  }

  public draw(frameTime: number) {
    
    // determine whether to update the model. aiming for 30fps.
    if (this.lastModelUpdateTime !== undefined)
    {
      let elapsedTime = frameTime - this.lastModelUpdateTime;

      this.context.fillStyle = "#000";
      this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      this.context.fillStyle = "#fff";

      //this.ball.draw(this.context);
      //this.ball.update(elapsedTime);
      this.explosions = this.explosions.filter(e => e.isAlive);

      for (let e of this.explosions) {
        e.draw(this.context);
        e.update(elapsedTime);
      }
      //this.particleShower.draw(this.context);
      //this.particleShower.update(elapsedTime);
    }

    this.lastModelUpdateTime = frameTime;
  }

  
}

let app = new BallGame();

function drawLoop(frameTime: number) {
  requestAnimationFrame(drawLoop);
  app.draw(frameTime);
}
requestAnimationFrame(drawLoop);

