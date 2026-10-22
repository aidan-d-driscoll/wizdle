import { Component } from "./component";
import Vector from "../types/vector";
import { Updatable } from "./interfaces";
import { error } from "console";

const FRICTION = 0.9

export enum BodyType {
    STATIC,
    KINEMATIC,
    DYNAMIC
}

type BodyOptions = {
    velocity?: Vector,
    acceleration?: Vector

    bodyType: BodyType
}

export class Body extends Component implements Updatable{
    static max = 1;

    bodyType: BodyType;

    velocity: Vector;
    acceleration: Vector;

    totalForces = new Vector({dx: 0, dy: 0});

    constructor(args: BodyOptions){
        super()

        this.velocity = args.velocity ? args.velocity : new Vector({dx: 0, dy: 0});
        
        this.acceleration = args.acceleration ? args.acceleration : new Vector({dx: 0, dy: 0});

        this.bodyType = args.bodyType;
    }

    onAttach(): void {
        super.onAttach();

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
                this.velocity.dx *= Math.exp(-FRICTION * dt);
                this.velocity.dy *= Math.exp(-FRICTION * dt);
            }
            
            this.owner.position.x += this.velocity.dx * dt
            this.owner.position.y += this.velocity.dy * dt

            this.totalForces.dx = 0;
            this.totalForces.dy = 0;
        }
    }

    applyForce(force: Vector){
        if (this.bodyType !== BodyType.DYNAMIC){
            throw new Error("Warning: Attempt to add force to non-dynamic body")
        }
        this.totalForces.add(force)
    }
}