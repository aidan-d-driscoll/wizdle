import { Module } from "./module";
import Vector from "../types/vector";
import { Updatable } from "./interfaces";
import { Collider } from "./collider";

export enum BodyType {
    STATIC,
    KINEMATIC,
    DYNAMIC
}

export enum ForceMode {
    FORCE,
    IMPULSE
}

type BodyOptions = {
    physicsCollider: Collider;

    velocity?: Vector,
    acceleration?: Vector
    mass?:number

    bodyType: BodyType

    bounce?: number

    maxInternalvelocity?: number
}

export class Body extends Module implements Updatable{
    static max = 1;

    physicsCollider: Collider;

    bodyType: BodyType;

    velocity: Vector;
    acceleration: Vector;
    mass: number;

    totalForces = new Vector({dx: 0, dy: 0});
    impulseForce = new Vector({dx: 0, dy: 0});

    bounce: number;

    groundFriction = 1;

    constructor(args: BodyOptions){
        super()

        this.physicsCollider = args.physicsCollider;
        this.physicsCollider.physicsBody = this;

        this.bodyType = args.bodyType;

        this.velocity = args.velocity ? args.velocity : new Vector({dx: 0, dy: 0});
        
        this.acceleration = args.acceleration ? args.acceleration : new Vector({dx: 0, dy: 0});

        if(this.bodyType !== BodyType.DYNAMIC){
            this.mass = Infinity;
        } else {
            this.mass = args.mass ? args.mass : 1
        }

        this.bounce = args.bounce ? args.bounce : 0;
    }

    onAttach(): void {
        super.onAttach();
        
        this.owner.add(this.physicsCollider);

        this.registerUpdateable();
    }

    onDetach(): void {
        super.onAttach();

        this.unregisterUpdateable();
    }

    update(dt: number): void {
        if(this.bodyType !== BodyType.STATIC) {

            if (this.bodyType === BodyType.DYNAMIC){
                this.acceleration.dx = this.totalForces.dx
                this.acceleration.dy = this.totalForces.dy
            }

            this.velocity.dx += this.acceleration.dx * dt
            this.velocity.dy += this.acceleration.dy * dt

            if (this.bodyType === BodyType.DYNAMIC){
                const k = Math.exp(-this.groundFriction * dt);

                this.velocity.dx += this.impulseForce.dx
                this.velocity.dy += this.impulseForce.dy 

                this.velocity.dx *= k;
                this.velocity.dy *= k;
            }
            
            this.owner.position.x += this.velocity.dx * dt
            this.owner.position.y += this.velocity.dy * dt

            this.totalForces.dx = 0;
            this.totalForces.dy = 0;

            this.impulseForce.dx = 0;
            this.impulseForce.dy = 0;
        }
    }

    applyForce(force: Vector, forceMode: ForceMode = ForceMode.FORCE){
        if (this.bodyType !== BodyType.DYNAMIC){
            console.warn(`Warning: Attempt to add force to ${BodyType[this.bodyType]} body. Will have no effect.`)
        }
        if (forceMode = ForceMode.IMPULSE) this.impulseForce.add(force)
        else if (forceMode = ForceMode.FORCE) this.totalForces.add(force)
        else throw new Error(`Error: Attempted to add force with unknown ForceMode: ${ForceMode[forceMode]}`)
    }
}