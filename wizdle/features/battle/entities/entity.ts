import { Position } from "@/types/position";
import { moveOptions, entityOptions } from "@/types/options";
import Vector from "@/types/vector";

const FRICTION = 0.002

export default abstract class Entity {
    position: Position;
    velocity: Vector = new Vector({dx: 0, dy: 0});
    image: HTMLImageElement;
    width: number;
    dead = false;
    frictionless = false;

    forces: Vector = new Vector({dx: 0, dy: 0});

    constructor({startingPosition, image, width, startingVelocity, frictionless}: entityOptions){
        this.position = startingPosition;
        if(startingVelocity) this.velocity = startingVelocity;
        this.image = image;
        this.width = width;
        if(frictionless) this.frictionless = frictionless
    }

    get x(): number { return this.position.x }

    set x(value: number) { this.position.x = value }

    get y(): number { return this.position.y }

    set y(value: number) { this.position.y = value }

    applyForce(newForce: Vector): void{
        this.forces = new Vector({
            dx: this.forces.dx + newForce.dx,
            dy: this.forces.dy + newForce.dy
        })
    }

    update(dt: number): void{
        this.move({dt: dt})

        if(Math.abs(this.position.x) > 1.5 || Math.abs(this.position.y) > 1.5){
            this.dead = true;
        }

        if(!this.dead){
            this.position = {
                x: this.position.x + (this.velocity.dx + this.forces.dx) * dt, 
                y: this.position.y + (this.velocity.dy + this.forces.dy) * dt
            }
        }
        
        if (!this.frictionless){
            const fMod = Math.pow(dt, FRICTION)
        

            this.forces.magnitude *= fMod
        }
        
    }

    move(args: moveOptions): void{}

    abstract collideWith(e: Entity): void;
}

