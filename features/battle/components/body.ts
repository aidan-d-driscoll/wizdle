import { Component } from "./component";
import Vector from "../types/vector";
import { Updatable } from "./interfaces";

export enum BodyType {
    STATiC,
    KINEMATIC,
    DYNAMIC
}

type BodyOptions = {
    velocity?: Vector,
    acceleration?: Vector

    bodyType: BodyType
}

export class Body extends Component implements Updatable{
    velocity: Vector;

    acceleration: Vector;

    bodyType: BodyType;

    constructor(args: BodyOptions){
        super()

        this.velocity = args.velocity ? args.velocity : new Vector({dx: 0, dy: 0})
        
        this.acceleration = args.acceleration ? args.acceleration : new Vector({dx: 0, dy: 0})

        this.bodyType = args.bodyType
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
        if(this.bodyType = BodyType.KINEMATIC) {
            this.velocity.dx += this.acceleration.dx * dt
            this.velocity.dy += this.acceleration.dy * dt
            
            this.owner.position.x += this.velocity.dx * dt
            this.owner.position.y += this.velocity.dy * dt
        }
    }
}