import { EventBridge } from './eventbridge'
import { ParticleExplosion } from './particleexplosion'
import { PhysicsAxis } from './physics'
// I followed the instructions here to setup the project to transpile and run within VSCode:
// https://code.visualstudio.com/docs/typescript/typescript-compiling


// google Kuler to get info about matching colour schemes (pastels that go with one another etc)

  // this youtube course is useful:
  //https://www.youtube.com/watch?v=yq2au9EfeRQ


  // this is a really good resource for circle/rectangle collision detection:
  // http://www.jeffreythompson.org/collision-detection/circle-rect.php

  //

class BallGame {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private unifiedEventSource: EventBridge;

  private lastModelUpdateTime: number;

  //private ball: Circle;

  private explosions: Array<ParticleExplosion>;

  private clickHandlerEventHandler: any;
  
  constructor() {
      this.canvas = document.getElementById('gamecanvas') as
                   HTMLCanvasElement;
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
      this.context = this.canvas.getContext("2d");

      this.unifiedEventSource = new EventBridge(this.canvas);
      this.unifiedEventSource.addClickHandler((x:number, y:number) => this.clickEventHandler(x, y));

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
  }

  private clickEventHandler(x: number, y: number) {
    let audio = new Audio();
    audio.src = "assets/firework_explosion_fizz_001.mp3";
    audio.load();
    audio.play();

    setTimeout( () => { 
      this.explosions.push(
        new ParticleExplosion(x, y)); 
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

