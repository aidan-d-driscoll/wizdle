import Vector from "@/types/vector";
import Combatant from "../entities/combatant";
import { GameObject, objectOptions } from "../objects/gameObject";
import { Physics } from "../physics/physics";
import { Collidable } from "./collidable";
import { CollisionBody } from "./collisionBody";

export type GroundOptions = objectOptions & {
    friction?: number;

    enterEffect?: (cmb: Collidable) => void
    stayEffect?: (cmb: Collidable) => void
    leaveEffect?: (cmb: Collidable) => void
}

export class Ground extends GameObject implements Collidable{
    friction: number | null = null;

    enterEffect: ((cmb: Collidable) => void) | null = null;
    stayEffect: ((cmb: Collidable) => void) | null = null;
    leaveEffect: ((cmb: Collidable) => void) | null = null;

    constructor(args: GroundOptions){
        super(args)

        if(args.friction) this.friction = args.friction;

        if (args.enterEffect) this.enterEffect = args.enterEffect
        if (args.stayEffect) this.stayEffect = args.stayEffect
        if (args.leaveEffect) this.leaveEffect = args.leaveEffect
    }

    onCollisionEnter(other: Collidable){
        if(this.enterEffect) this.enterEffect(other)
    }

    onCollisionStay(other: Collidable): void {
        if(other instanceof GameObject && !other.flying){
            other.grounds.push(this)
            if(this.friction){
                other.applyForce(new Vector({
                    dx: other.forces.dx * -1,
                    dy: other.forces.dy * -1,
                    magnitude: other.forces.magnitude * this.friction
                }))
            }
            if(this.stayEffect) this.stayEffect(other)
        }
    }

    onCollisionLeave(other: Collidable){
        if(this.leaveEffect) this.leaveEffect(other)
    }
}