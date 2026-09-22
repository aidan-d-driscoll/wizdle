import { Position } from "@/types/position";
import { moveOptions, entityOptions } from "@/types/options";
import Vector from "@/types/vector";

const FRICTION = 0.005

export default abstract class Entity {
    position: Position;
    velocity: Vector = new Vector({dx: 0, dy: 0});
    image: HTMLImageElement;
    width: number;
    dead = false;
    frictionless = false;

    force: Vector = new Vector({dx: 0, dy: 0});

    constructor({startingPosition, image, width, startingVelocity, frictionless}: entityOptions){
        this.position = startingPosition;
        if(startingVelocity) this.velocity = startingVelocity;
        this.image = image;
        this.width = width;
        if(frictionless) this.frictionless = frictionless

        console.log(this.force)
    }

    get x(): number { return this.position.x }

    set x(value: number) { this.position.x = value }

    get y(): number { return this.position.y }

    set y(value: number) { this.position.y = value }

    applyForce(forceVector: Vector): void{
        console.log("Knocking back")
        this.velocity = new Vector({
            dx: this.velocity.dx + forceVector.dx,
            dy: this.velocity.dy + forceVector.dy
        })
    }

    update(dt: number): void{
        this.move({dt: dt})
        console.log("-----------------------------")

        console.log(this.force)

        if(Math.abs(this.position.x) > 1.5 || Math.abs(this.position.y) > 1.5){
            this.dead = true;
        }

        if(!this.dead){
            this.position = {
                x: this.position.x + this.velocity.dx * dt, 
                y: this.position.y + this.velocity.dy * dt
            }
        }
        
        if (!this.frictionless){
            const fMod = Math.pow(dt, FRICTION)
        

            this.velocity.magnitude *= fMod
        }
        
    }

    move(args: moveOptions): void{}

    abstract collideWith(e: Entity): void;
}

