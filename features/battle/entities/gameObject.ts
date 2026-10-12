import { Entity, EntityOptions } from "../entities/entity";
import Vector from "@/types/vector";
import { Scene, UpdateOptions } from "../scene";
import { CollisionBody } from "../collisions/collisionBody";

export type ObjectOptions = EntityOptions & {
    scene: Scene,

    static?: boolean;
    
    visible?: boolean;

    cb?: CollisionBody;
    physics?: boolean;

    velocity?: Vector;

    children?: Entity[];
}

const FRICTION = 0.0005

export class GameObject extends Entity{
    static = false;

    protected _cb: CollisionBody | null = null;
    get cb(): CollisionBody | null { return this._cb }
    set cb(value: CollisionBody) {
        this._cb = value;
        this._cb.owner = this;
    }

    private _velocity: Vector = new Vector({dx: 0, dy: 0});
    get velocity(): Vector { return this._velocity };
    set velocity(value: Vector) { this._velocity = new Vector({dx: value.dx, dy: value.dy}) };
    get vx(): number { return this._velocity.dx };
    get vy(): number { return this._velocity.dy };

    physics = false;
    totalForces = new Vector({dx: 0.0, dy: 0})
    get frictionForce(): Vector {
        return new Vector({dx: -1 * this.vx, dy: -1 * this.vy, magnitude: FRICTION})
    }

    constructor(args:ObjectOptions){
        super(args)

        if(args.static) this.static = args.static;

        if(args.velocity) this.velocity = args.velocity;
            
        if(args.cb) {
            this.cb = args.cb;
            if(args.physics) this.physics = args.physics;
            args.scene.cm.add(this.cb)
        } else this.physics = false
    }

    update(args: UpdateOptions){
        super.update(args)

        if (!this.dead){
            if (this.physics) {
                if(this.totalForces.magnitude > FRICTION) {
                    this.velocity = this.velocity.add(this.totalForces)
                    this.totalForces.magnitude -= FRICTION
                }
                else this.totalForces = new Vector({dx: 0, dy: 0})
            }
            
            this.position = {
                x: this.position.x + this.velocity.dx * args.dt,
                y: this.position.y + this.velocity.dy * args.dt
            }

            if (this._cb) {
                this._cb.dirty = false;
                this._cb.tight.position = this.position
                this._cb.update(args)
            }
        }
        
    }

    render(scene: Scene) {
        for (const child of this.children){
            child.render(scene)
        }
    }

    applyForce(newForce: Vector){
        this.totalForces = this.totalForces.add(newForce)
    }

    onCollisionEnter?(other: GameObject): void;
    onCollisionStay?(other: GameObject): void;
    onCollisionExit?(other: GameObject): void;
}