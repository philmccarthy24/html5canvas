/**
 * Interprets basic mouse/touch events into semantic click and
 * stateful drag events, and provides unified eventing for both mouse and touch
 */

 class EventInterpreter {

  private mouseOrTouchDown: boolean;

  private startMoveX: number;
  private startMoveY: number;


  public constructor(private domElementToListenFor: HTMLElement) {

  }

  /*
  private registerEventHandlers() {
    this.domElementToListenFor.addEventListener("mousedown", this.pressEventHandler);
    this.domElementToListenFor.addEventListener("mousemove", this.dragEventHandler);
    this.domElementToListenFor.addEventListener("mouseup", this.releaseEventHandler);
    this.domElementToListenFor.addEventListener("mouseout", this.cancelEventHandler);

    this.domElementToListenFor.addEventListener("touchstart", this.pressEventHandler);
    this.domElementToListenFor.addEventListener("touchmove", this.dragEventHandler);
    this.domElementToListenFor.addEventListener("touchend", this.releaseEventHandler);
    this.domElementToListenFor.addEventListener("touchcancel", this.cancelEventHandler);
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageX :
                 (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageY :
                 (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    this.paint = true;
    this.addClick(mouseX, mouseY, false);
    this.redraw();
}

private dragEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageX :
                 (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageY :
                 (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    if (this.paint) {
        this.addClick(mouseX, mouseY, true);
        this.redraw();
    }

    e.preventDefault();
} */
 }