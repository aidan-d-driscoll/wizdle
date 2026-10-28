import { Body, ForceMode } from "./body";
import { Module } from "./module";
import { Updatable } from "./interfaces";
import Vector from "../types/vector";

const BRAKE_MULITPLIER = 1.5;

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
        const room = this.maxSpeed - along;

        if (room > 0) {
            const speed = v.magnitude;
            let opposition = 0;
            if (speed > 0) {
                const alignment = along / speed;
                opposition = Math.max(0, -alignment);
            }

            const brake = 1 + (BRAKE_MULITPLIER - 1) * opposition;
            const traction = this.body.groundFriction * brake;

            const accel = this.speed * traction;
            const dv = Math.min(accel * dt, room);
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