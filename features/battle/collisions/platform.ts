import { Circle } from "@/types/shapes/circle";
import Entity, { entityOptions } from "../entities/entity";
import { CollisionBody } from "./collisionBody";

export class Platform extends Entity{
    constructor(args: entityOptions){
        super(args)

        this.physics = false;

        this.collisionBody = new CollisionBody({
            owner: this,
            tight: new Circle({
                startingPosition: this.position,
                radius: 0.88
            })
        })
        
    }
}