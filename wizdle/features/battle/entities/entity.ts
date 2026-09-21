import { Position } from "@/types/position";
import { moveOptions, entityOptions } from "@/types/options";
import Vector from "@/types/vector";

const KNOCKBACK = 0.0005

export default abstract class Entity {
    position: Position;
    velocity: Vector = new Vector({dx: 0, dy: 0});
    image: HTMLImageElement;
    width: number;
    dead = false;

    activeKnockback: Vector = new Vector({dx: 0, dy: 0});

    constructor({startingPosition, image, width, startingVelocity}: entityOptions){
        this.position = startingPosition;
        if(startingVelocity) this.velocity = startingVelocity;
        this.image = image;
        this.width = width;

        console.log(this.activeKnockback)
    }

    get x(): number { return this.position.x }

    set x(value: number) { this.position.x = value }

    get y(): number { return this.position.y }

    set y(value: number) { this.position.y = value }

    applyKnockback(knockbackVector: Vector): void{
        console.log("Knocking back")
        this.activeKnockback = new Vector({
            dx: this.activeKnockback.dx + knockbackVector.dx,
            dy: this.activeKnockback.dy + knockbackVector.dy
        })
    }

    update(dt: number): void{
        this.move({dt: dt})
        console.log("-----------------------------")

        console.log(this.activeKnockback)

        if(Math.abs(this.position.x) > 1.5 || Math.abs(this.position.y) > 1.5){
            this.dead = true;
        }

        if(!this.dead){
            this.position = {
                x: this.position.x + this.velocity.dx * dt + this.activeKnockback.dx, 
                y: this.position.y + this.velocity.dy * dt + this.activeKnockback.dy
            }
        }
        
        const kMod = Math.pow(dt, KNOCKBACK)
        

        this.activeKnockback.magnitude *= kMod
        console.log(this.activeKnockback.magnitude)
    }

    move(args: moveOptions): void{}

    abstract collideWith(e: Entity): void;
}

