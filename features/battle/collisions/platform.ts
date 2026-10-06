import { Circle } from "@/types/shapes/circle";
import Combatant, { entityOptions } from "../entities/combatant";
import { CollisionBody } from "./collisionBody";

export class Platform extends Combatant{
    constructor(args: entityOptions){
        super(args)

        this.physics = false;

        this.collisionBody = new CollisionBody({
            owner: this,
            tight: new Circle({
                startingPosition: this.position,
                radius: 0.90
            })
        })
        
    }
}