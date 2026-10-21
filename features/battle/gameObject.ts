import { Entity, EntityOptions } from "./entity";
import { Component, ComponentType } from "./components/component";
import { Scene } from "./scene";

export type ObjectOptions = EntityOptions & {
    // static?: boolean;
    
    // visible?: boolean;

    // physics?: boolean;

    // velocity?: Vector;
}

export class GameObject extends Entity{
    private _components = new Map<ComponentType, Component[]>;

    add<T extends Component>(c: T): T {
        const type = c.constructor as ComponentType<T>;

        for (const req of type.requires){
            if (!this.has(req)) throw new Error(`${this.constructor.name} requires a previously added ${req.name} component`)
        }

        const typeList = this._components.get(type);
        if(typeList) {
            if(typeList.length < type.max){
                typeList.push(c)
            } else {
                throw new Error(`${this.constructor.name} can have at most ${type.max} ${type.name}(s)`);
            }
        } else {
            this._components.set(type, [c])
        }
        
        c.owner = this;
        c.onAttach();
        return c;
    }

    get<T extends Component>(type: ComponentType<T>): T | undefined {
        const typeList = this._components.get(type)
        if (! typeList) return undefined
            
        return typeList[0] as T | undefined
    }

    getAll<T extends Component>(type: ComponentType<T>): T[] {
        const typeList = this._components.get(type)
        if(!typeList) return []

        return typeList as T[];
    }

    has<T extends Component>(type: ComponentType<T>): boolean { return this._components.has(type) }

    remove<T extends Component>(c: T) {
        const type = c.constructor as ComponentType<T>
        const typeList = this._components.get(type);
        const idx = typeList?.indexOf(c) ?? -1

        if(!typeList || idx < 0) return;

        typeList.splice(idx, 1);
        c.onDetach();
        if (typeList.length === 0) this._components.delete(type);
    }

    removeAll<T extends Component>(type: ComponentType<T>) {
        const typeList = this._components.get(type);
        if (!typeList) return;

        for (const c of typeList)
            c.onDetach();
        this._components.delete(type);
    }
}


    // static = false;

    // protected _cb: Collider | null = null;
    // get cb(): Collider | null { return this._cb }
    // set cb(value: Collider) {
    //     this._cb = value;
    //     this._cb.owner = this;
    //     this._cb.tight.position = this.position;
    // }

    // private _velocity: Vector = new Vector({dx: 0, dy: 0});
    // get velocity(): Vector { return this._velocity };
    // set velocity(value: Vector) { this._velocity = new Vector({dx: value.dx, dy: value.dy}) };
    // get vx(): number { return this._velocity.dx };
    // get vy(): number { return this._velocity.dy };

    // maxVelocity: number | null = null;

    // movementForce = new Vector({dx: 0, dy: 0})
    // movementVelocity = new Vector({dx: 0, dy: 0})

    // knockbackForce = new Vector({dx: 0, dy: 0})
    // knockbackVelocity = new Vector({dx: 0, dy: 0})

    // physics = false;
    // flying = false;
    // ground: GroundTexture | null = null;

    // fat: Rectangle;

    // constructor(args:ObjectOptions){
    //     super(args)

    //     if(args.static) this.static = args.static;

    //     if(args.velocity) this.velocity = args.velocity;
            
    //     // if(args.cb) {
    //     //     this.cb = args.cb;
    //     //     this.children.add(this.cb)
    //     //     if(args.physics) this.physics = args.physics;
    //     //     args.scene.cm.add(this.cb)
    //     // } else this.physics = false

    //     this.ground = args.scene.gm.highestGroundAt(this.position)

    //     this.fat = new Rectangle({
    //         position: this.position,
    //         height: 0.1,
    //         width: 0.1,
    //         color: "#00000069"
    //     })
    // }

    // update(args: UpdateOptions){
    //     if (!this.dead){
    //         if (this.physics) {
    //             if(!this.flying){
    //                 if(this.ground){

    //                     this.movementVelocity = new Vector({
    //                         dx: this.movementVelocity.dx + this.movementForce.dx * args.dt * this.ground.friction,
    //                         dy: this.movementVelocity.dy + this.movementForce.dy * args.dt * this.ground.friction,
    //                     })

    //                     const frictionFactor = Math.max(0, 1 - (this.ground.friction * args.dt));
    //                     const highFrictionMod = 0.999

    //                     this.knockbackVelocity = new Vector({
    //                         dx: this.knockbackVelocity.dx * frictionFactor,
    //                         dy: this.knockbackVelocity.dy * frictionFactor
    //                     })

    //                     let dxFrictionFactor = frictionFactor;
    //                     if ((this.movementForce.dx > 0) !== (this.movementVelocity.dx > 0)) {
    //                         dxFrictionFactor *= highFrictionMod;
    //                     }

    //                     let dyFrictionFactor = frictionFactor;
    //                     if ((this.movementForce.dy > 0) !== (this.movementVelocity.dy > 0)) {
    //                         dyFrictionFactor *= highFrictionMod;
    //                     }

    //                     this.movementVelocity = new Vector({
    //                         dx: this.movementVelocity.dx * dxFrictionFactor,
    //                         dy: this.movementVelocity.dy * dyFrictionFactor
    //                     })
                        
    //                     if(this.maxVelocity && this.movementVelocity.magnitude > this.maxVelocity) this.movementVelocity.magnitude = this.maxVelocity

    //                     this.velocity = this.movementVelocity.add(this.knockbackVelocity)
    //                 } else {
    //                     this.destroy()
    //                 }
    //             }
    //         }
            
    //         this.position = {
    //             x: this.position.x + this.velocity.dx * args.dt,
    //             y: this.position.y + this.velocity.dy * args.dt
    //         }

    //         if (!this.fat.contains(this.position)){ 
    //             this.fat.position = this.position
    //         }
    //     }

    //     super.update(args)
    // }

    // applyKnockback(newForce: Vector){
    //     this.movementForce = new Vector({dx: 0, dy: 0});
    //     this.knockbackVelocity = new Vector({
    //         dx: this.knockbackVelocity.dx + newForce.dx,
    //         dy: this.knockbackVelocity.dy + newForce.dy,
    //     })
    // }

    // onCollisionEnter?(other: GameObject): void;
    // onCollisionStay?(other: GameObject): void;
    // onCollisionExit?(other: GameObject): void;