import { Position } from "@/types/position";
import { getDistance } from "@/utilities/mathUtils";
import { moveOptions, entityOptions } from "@/types/options";

const KNOCKBACK = 0.00001

export default abstract class Entity {
    position: Position;
    xVel: number;
    yVel: number;
    image: HTMLImageElement;
    target: Entity | null;
    width: number;
    dead = false;

    kx = 0;
    ky = 0;

    constructor({startingPosition, image, xVel = 0, yVel = 0, target = null, width}: entityOptions){
        this.position = startingPosition;
        this.xVel = xVel;
        this.yVel = yVel;
        this.image = image;
        this.target = target;
        this.width = width;
    }

    move({dt, targetPosition = this.target?.position, speed = 1}: moveOptions): void{
        if (targetPosition) {
            const dx = targetPosition.x - this.position.x;
            const dy = targetPosition.y - this.position.y;

            const distance = getDistance(targetPosition, this.position);

            if (distance > 0) { // normalize direction
                this.xVel = dx * speed / distance;
                this.yVel = dy * speed / distance;
            }
        } else { 
            this.xVel = 0
            this.yVel = 0
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
            this.xVel += this.kx
            this.yVel += this.ky

            this.position = {
                x: this.position.x + this.xVel * dt, 
                y: this.position.y + this.yVel * dt
            }

            const kMod = Math.pow(KNOCKBACK, dt); 

            this.kx *= kMod;
            this.ky *= kMod;
        }        
    }

    abstract collideWith(e: Entity): void;
}

