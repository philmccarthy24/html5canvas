interface LimitsHitVelocityHandler {
  (maxHit: boolean, velAtHit: number) : number;
}

export class PhysicsAxis {

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