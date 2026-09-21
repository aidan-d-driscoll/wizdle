import { Position } from "@/types/position";
import { moveOptions, entityOptions } from "@/types/options";
import Vector from "@/types/vector";

const KNOCKBACK = 0.00001

export default abstract class Entity {
    position: Position;
    velocity: Vector = new Vector({dx: 0, dy: 0});
    image: HTMLImageElement;
    width: number;
    dead = false;

    activeKnockback: Vector = new Vector({dx: 0, dy: 0, magnitude: 0});

    constructor({startingPosition, image, width, startingVelocity}: entityOptions){
        this.position = startingPosition;
        if(startingVelocity) this.velocity = startingVelocity;
        this.image = image;
        this.width = width;
    }

    get x(): number { return this.position.x }

    set x(value: number) { this.position.x = value }

    get y(): number { return this.position.y }

    set y(value: number) { this.position.y = value }

    applyKnockback(knockbackVector: Vector): void{
        this.activeKnockback = knockbackVector;
    }

    update(dt: number): void{
        this.move({dt: dt})

        if(Math.abs(this.position.x) > 1.5 || Math.abs(this.position.y) > 1.5){
            this.dead = true;
        }

        if(!this.dead){
            this.position = {
                x: this.position.x + this.velocity.dx * dt, 
                y: this.position.y + this.velocity.dy * dt
            }
        }
    }

    move(args: moveOptions): void{}

    abstract collideWith(e: Entity): void;
}

