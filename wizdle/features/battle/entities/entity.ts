import { Position, positionObject } from "@/types/position";
import { moveOptions } from "@/types/options";
import Vector from "@/types/vector";
import { Sprite, spriteOptions } from "@/features/battle/rendering/sprite";
import { CollisionBody } from "../collisions/collisionBody";
import { rectangleOptions } from "@/types/shapes/rectangle";

const FRICTION = 0.00015

export type entityOptions = rectangleOptions & {
    startingPosition: Position,
    sprite?: Sprite,
    startingVelocity?: Vector,
    physics?: boolean,
    CollisionBody?: CollisionBody
}

export default abstract class Entity extends positionObject {
    velocity: Vector = new Vector({dx: 0, dy: 0});
    forces: Vector = new Vector({dx: 0, dy: 0});
    physics = true;
    dead = false;

    sprite: Sprite | null = null;

    CollisionBody: CollisionBody | null = null;

    constructor(args: entityOptions){
        super(args.startingPosition)

        if(args.startingVelocity) this.velocity = args.startingVelocity;
        this.sprite = args.sprite ? args.sprite : null
        if(args.physics) this.physics = args.physics
        if(args.CollisionBody) this.CollisionBody = args.CollisionBody
    }

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
        
        if (!this.physics){
            const fMod = Math.pow(dt, FRICTION)
        

            this.forces.magnitude *= fMod
        }
        
        if (this.sprite) this.sprite.position = this.position
        if (this.CollisionBody){
            this.CollisionBody.tight.position = this.position
            this.CollisionBody.update()
        }

        
    }

    move(args: moveOptions): void{}

    abstract collideWith(e: Entity): void;
}

