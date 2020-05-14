// I followed the instructions here to setup the project to transpile and run within VSCode:
// https://code.visualstudio.com/docs/typescript/typescript-compiling


// google Kuler to get info about matching colour schemes (pastels that go with one another etc)

  // this youtube course is useful:
  //https://www.youtube.com/watch?v=yq2au9EfeRQ

interface CollisionHandler {
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
   * Not the most accurate way to calculate axis position of a moving object - Velocity Verlet would
   * give better accuracy. But for our purposes, it's probably fine.
   * @param stepTimeInMS the time step in milliseconds
   */
  public calcEulerStep(stepTimeInMS: number, minLimit: number = 0, maxLimit: number = window.innerWidth, collisionHandler: CollisionHandler): void {
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

class Particle {

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
    this.y.calcEulerStep(deltaMS, this.r, window.innerHeight - this.r, (maxHit, velAtHit) => maxHit ? -velAtHit * 0.8 : -velAtHit);
  }
}

class Ball extends Particle {

  public update(deltaMS: number) {
    
    
      super.update(deltaMS);
     // otherwise flag somehow the game is over (or a life is lost)
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

  private ball: Ball;
  
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
      this.ball = new Ball(
        new PhysicsAxis(Math.random() * window.innerWidth, 200, 0),
        new PhysicsAxis(Math.random() * window.innerHeight, -130, 1200),
        20);
  }

  public draw(frameTime: number) {
    
    // determine whether to update the model. aiming for 30fps.
    if (this.lastModelUpdateTime !== undefined)
    {
      let elapsedTime = frameTime - this.lastModelUpdateTime;

      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.ball.draw(this.context);
      this.ball.update(elapsedTime);
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

