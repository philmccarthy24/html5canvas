interface ICollidable {
  name: string;
  hasCollided: boolean;
  collidedWith: string[];
//  testForCollision: (collidableToTest: ICollidable) => boolean;
  X: number;
  Y: number;
}

interface CollisionEventHandler {
  (collided: ICollidable[]): void;
}

interface I2DPhysicsEngine {

  //addCollidable()
  testForCollision: (collidableToTest: ICollidable) => boolean;
}
