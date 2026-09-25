import { Rectangle, rectangleOptions } from "@/types/rectangle";
import { collisions } from "@/features/battle/collisions/collisionManager";

export class CollisionBox extends Rectangle{
    fatBox: Rectangle;

    constructor(args: rectangleOptions){
        super(args)
        this.fatBox = new Rectangle(args)
        this.fatBox.scale(1.1);

        this.collisions.
    }

    update()
}