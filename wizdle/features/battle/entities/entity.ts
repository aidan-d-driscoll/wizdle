import { Position } from "@/types/position";
import { getDistance } from "@/utilities/mathUtils";
import { moveOptions, entityOptions } from "@/types/options";
import Vector from "@/types/vector";

const KNOCKBACK = 0.00001

export default abstract class Entity {
    position: Position;
    velocity: Vector
    image: HTMLImageElement;
    target: Entity | null;
    width: number;
    dead = false;

    kx = 0;
    ky = 0;

    constructor({startingPosition, image, xVel = 0, yVel = 0, target = null, width}: entityOptions){
        this.position = startingPosition;
        this.velocity = new Vector({dx: xVel, dy: yVel})
        this.image = image;
        this.target = target;
        this.width = width;
    }

    move({dt, targetPosition = this.target?.position, speed = 1}: moveOptions): void{
        if (targetPosition) {
            this.velocity = new Vector({startPos: this.position, endPos: targetPosition})
            this.velocity.magnitude *= speed
        } else { 
            this.velocity.magnitude = 0
        }
    }

    applyKnockback(xDir: number, yDir: number): void{
        this.kx += xDir;
        this.ky += yDir;
    }

    update(dt: number): void{
        if(Math.abs(this.position.x) > 1.5 || Math.abs(this.position.y) > 1.5){
            this.dead = true;
        }

        if(!this.dead){
            this.velocity.dx += this.kx
            this.velocity.dy += this.ky

            this.position = {
                x: this.position.x + this.velocity.dx * dt, 
                y: this.position.y + this.velocity.dy * dt
            }

            const kMod = Math.pow(KNOCKBACK, dt); 

            this.kx *= kMod;
            this.ky *= kMod;
        }        
    }

    abstract collideWith(e: Entity): void;
}

