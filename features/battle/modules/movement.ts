import { Body, ForceMode } from "./body";
import { Module } from "./module";
import { Updatable } from "./interfaces";
import Vector from "../types/vector";

export class Movement extends Module implements Updatable{
    static max: number = 1;
    static requires = [Body];
    
    body!: Body;

    speed: number;
    maxSpeed: number;

    private force = new Vector({dx: 0, dy: 0})

    constructor(speed: number){
        super()

        this.speed = speed
        this.maxSpeed = speed
    }

    onAttach(): void {
        super.onAttach()

        this.body = this.owner.getRequired(Body)

        this.registerUpdateable()
    }

    onDetach(): void {
        super.onDetach()

        this.unregisterUpdateable()
    }

    update(dt: number): void {
        const v = this.body.velocity;
        const along = v.dx * this.force.dx + v.dy * this.force.dy; 
        // const room = this.maxSpeed - along;
        const room = Infinity;

        if (room > 0) {
            const dv = Math.min(this.speed * dt, room);
            this.body.applyForce(
                new Vector({ dx: this.force.dx * dv, dy: this.force.dy * dv }),
                ForceMode.IMPULSE
                
            );
        }

        this.force.magnitude = 0
    }

    moveInDirection(dir: Vector){
        this.force.dx = dir.dx
        this.force.dy = dir.dy

        console.log(`Pre adjustment: ${this.force}`)

        this.force.magnitude = this.speed

        console.log(this.speed)
        console.log(`movement force applied ${this.force}`)
    }
}