import { Entity, EntityOptions } from "../entities/entity";
import Vector from "@/features/battle/types/vector";
import { Scene, UpdateOptions } from "../scene";
import { CollisionBody } from "../collisions/collisionBody";
import { GroundTexture } from "../physics/ground";

export type ObjectOptions = EntityOptions & {
    scene: Scene,

    static?: boolean;
    
    visible?: boolean;

    cb?: CollisionBody;
    physics?: boolean;

    velocity?: Vector;
}

export class GameObject extends Entity{
    static = false;

    protected _cb: CollisionBody | null = null;
    get cb(): CollisionBody | null { return this._cb }
    set cb(value: CollisionBody) {
        this._cb = value;
        this._cb.owner = this;
        this._cb.tight.position = this.position;
    }

    private _velocity: Vector = new Vector({dx: 0, dy: 0});
    get velocity(): Vector { return this._velocity };
    set velocity(value: Vector) { this._velocity = new Vector({dx: value.dx, dy: value.dy}) };
    get vx(): number { return this._velocity.dx };
    get vy(): number { return this._velocity.dy };

    maxVelocity: number | null = null;

    movementForce = new Vector({dx: 0, dy: 0})
    movementVelocity = new Vector({dx: 0, dy: 0})

    knockbackForce = new Vector({dx: 0, dy: 0})
    knockbackVelocity = new Vector({dx: 0, dy: 0})

    physics = false;
    flying = false;
    ground: GroundTexture | null = null;

    constructor(args:ObjectOptions){
        super(args)

        if(args.static) this.static = args.static;

        if(args.velocity) this.velocity = args.velocity;
            
        if(args.cb) {
            this.cb = args.cb;
            if(args.physics) this.physics = args.physics;
            args.scene.cm.add(this.cb)
        } else this.physics = false

        this.ground = args.scene.gm.highestGroundAt(this.position)
    }

    update(args: UpdateOptions){
        if (!this.dead){
            if (this.physics) {
                if(!this.flying){
                    if(this.ground){

                        this.movementVelocity = new Vector({
                            dx: this.movementVelocity.dx + this.movementForce.dx * args.dt * this.ground.friction,
                            dy: this.movementVelocity.dy + this.movementForce.dy * args.dt * this.ground.friction,
                        })

                        const frictionFactor = Math.max(0, 1 - (this.ground.friction * args.dt));
                        const highFrictionMod = 0.999

                        this.knockbackVelocity = new Vector({
                            dx: this.knockbackVelocity.dx * frictionFactor,
                            dy: this.knockbackVelocity.dy * frictionFactor
                        })

                        let dxFrictionFactor = frictionFactor;
                        if ((this.movementForce.dx > 0) !== (this.movementVelocity.dx > 0)) {
                            dxFrictionFactor *= highFrictionMod;
                        }

                        let dyFrictionFactor = frictionFactor;
                        if ((this.movementForce.dy > 0) !== (this.movementVelocity.dy > 0)) {
                            dyFrictionFactor *= highFrictionMod;
                        }

                        this.movementVelocity = new Vector({
                            dx: this.movementVelocity.dx * dxFrictionFactor,
                            dy: this.movementVelocity.dy * dyFrictionFactor
                        })
                        
                        if(this.maxVelocity && this.movementVelocity.magnitude > this.maxVelocity) this.movementVelocity.magnitude = this.maxVelocity

                        this.velocity = this.movementVelocity.add(this.knockbackVelocity)
                    } else {
                        this.destroy()
                    }
                }
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

        super.update(args)
    }

    render(scene: Scene) {
        if(this.cb?.tight.isVisible) this.cb.tight.render(scene)
        for (const child of this.children){
            child.render(scene)
        }
    }

    applyKnockback(newForce: Vector){
        this.movementForce = new Vector({dx: 0, dy: 0});
        this.knockbackVelocity = new Vector({
            dx: this.knockbackVelocity.dx + newForce.dx,
            dy: this.knockbackVelocity.dy + newForce.dy,
        })
    }

    onCollisionEnter?(other: GameObject): void;
    onCollisionStay?(other: GameObject): void;
    onCollisionExit?(other: GameObject): void;
}