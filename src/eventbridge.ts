export interface IClickHandler {
  (x: number, y: number): void;
}
export interface IDragHandler {
  (dragStartX: number, dragStartY: number, x: number, y: number): void;
}

/**
 * Interprets basic mouse/touch events into semantic click and
 * stateful drag events, to provide unified eventing for both mouse and touch
 */
 export class EventBridge {

  private mouseOrTouchDown: boolean;

  private startMoveX: number;
  private startMoveY: number;

  private clickHandler: IClickHandler;
  private dragHandler: IDragHandler;

  public constructor(private domElementToListenFor: HTMLElement) {
    this.registerEventHandlers();
  }

  public addClickHandler(clickHandler: IClickHandler) {
    this.clickHandler = clickHandler;
  }

  public addDragHandler(dragHandler: IDragHandler) {
    this.dragHandler = dragHandler;
  }

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
    this.startMoveX = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageX :
                 (e as MouseEvent).pageX;
    this.startMoveY = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageY :
                 (e as MouseEvent).pageY;
    this.startMoveX -= this.domElementToListenFor.offsetLeft;
    this.startMoveY -= this.domElementToListenFor.offsetTop;

    this.mouseOrTouchDown = true;

    this.clickHandler(this.startMoveX, this.startMoveY);
}

private dragEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageX :
                 (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageY :
                 (e as MouseEvent).pageY;
    mouseX -= this.domElementToListenFor.offsetLeft;
    mouseY -= this.domElementToListenFor.offsetTop;

    if (this.mouseOrTouchDown) {
      this.dragHandler(this.startMoveX, this.startMoveY, mouseX, mouseY);
    }

    e.preventDefault();
  }

  private releaseEventHandler = (e: MouseEvent | TouchEvent) => {
    this.mouseOrTouchDown = false;
  }

  private cancelEventHandler = (e: MouseEvent | TouchEvent) => {
    this.mouseOrTouchDown = false;
  }
}