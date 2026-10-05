import { Position, positionObject } from "@/types/position";
import { moveOptions } from "@/types/options";
import Vector from "@/types/vector";
import { Sprite } from "@/features/battle/rendering/sprite";
import { CollisionBody } from "../collisions/collisionBody";
import { Collidable } from "@/features/battle/collisions/collidable";
import { Engine } from "../engine";

const FRICTION = 0.00015

export type entityOptions =  {
    engine: Engine,
    startingPosition: Position,
    sprite?: Sprite,
    startingVelocity?: Vector,
    physics?: boolean,
    collisionBody?: CollisionBody
}

export default abstract class Entity extends positionObject implements Collidable {
    static nextId = 0;
    readonly id: number;

    engine: Engine;

    velocity: Vector = new Vector({dx: 0, dy: 0});
    forces: Vector = new Vector({dx: 0, dy: 0});
    physics = true;
    dead = false;

    sprite: Sprite | null = null;

    collisionBody: CollisionBody | null = null;

    constructor(args: entityOptions){
        super(args.startingPosition)

        this.engine = args.engine;

        this.id = Entity.nextId;
        Entity.nextId++;

        if(args.startingVelocity) this.velocity = args.startingVelocity;
        this.sprite = args.sprite ? args.sprite : null
        if(args.physics) this.physics = args.physics
        if (args.collisionBody) { this.collisionBody = args.collisionBody }
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
            this.engine.markForDestruction(this)
        }

        if(!this.dead){
            this.position = {
                x: this.position.x + (this.velocity.dx + this.forces.dx) * dt, 
                y: this.position.y + (this.velocity.dy + this.forces.dy) * dt
            }
        }
        
        if (this.physics){
            const fMod = Math.pow(dt, FRICTION)

            this.forces.magnitude *= fMod
        }
        
        if (this.sprite) this.sprite.position = this.position
        
    }

    move(args: moveOptions): void{}

    set position(value: Position) {
        super.position = value;
        if (this.collisionBody) this.collisionBody.tight.position = value;
    }

    get position(): Position {
        return super.position;
    }

    set x(value: number) {
        super.position.x = value;
        if (this.collisionBody) this.collisionBody.tight.position.x = value;
    }

    get x(): number {
        return super.x
    }

    set y(value: number) {
        super.position.y = value;
        if (this.collisionBody) this.collisionBody.tight.position.y = value;
    }

    get y(): number {
        return super.y
    }
}

