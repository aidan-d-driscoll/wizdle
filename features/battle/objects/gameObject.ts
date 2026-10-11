import { Position, Positionable, PositionableOptions } from "@/types/position";
import { Sprite } from "../rendering/sprite";
import Vector from "@/types/vector";
import { Engine, updateOptions } from "../engine";
import { CollisionBody } from "../collisions/collisionBody";
import { Collidable } from "../collisions/collidable";
import { getRawDistance, getDistance } from "@/utilities/mathUtils";
import { Physics } from "../physics/physics";
import { Ground } from "../collisions/ground";

export type objectOptions = PositionableOptions & {
    engine: Engine,

    static?: boolean;
    
    sprites?: Sprite | Sprite[];
    visible?: boolean;

    collisionBody?: CollisionBody;
    physics?: boolean;

    velocity?: Vector;

    children?: Positionable[];
}

export class GameObject extends Positionable implements Collidable, Physics{
    private static nextId = 0;
    readonly id: number;

    children: Positionable[] = [];

    static = false;

    readonly sprites = new Map<number, Sprite>

    private _cb: CollisionBody | null = null;
    get cb(): CollisionBody | null { return this._cb }
    set cb(value: CollisionBody) {
        this._cb = value;
        this._cb.owner = this;
        this.addChildren(this._cb.tight);
    }

    private _velocity: Vector = new Vector({dx: 0, dy: 0});
    get velocity(): Vector { return this._velocity };
    set velocity(value: Vector) { this._velocity = new Vector({dx: value.dx, dy: value.dy}) };
    get vx(): number { return this._velocity.dx };
    get vy(): number { return this._velocity.dy };

    physics = false;

    flying = false;
    forces = new Vector({dx: 0, dy: 0})
    grounds: Ground[] = [];

    dead = false;

    constructor(args:objectOptions){
        super(args)

        this.id = GameObject.nextId;
        GameObject.nextId++;

        if(args.static) this.static = args.static;

        if(args.velocity) this.velocity = args.velocity;
        
        if(args.sprites) this.addSprites(args.sprites);

        if(args.children) this.addChildren(args.children);
            
        if(args.collisionBody) {
            this.cb = args.collisionBody;
            if(args.physics) this.physics = args.physics;
        } else this.physics = false
    }

    update(args: updateOptions){
        console.log(this._cb?.toString())
        if (!this.static){
            for (const child of this.children){
                child.position = this.position;
            }

            for (const sp of this.sprites){
                sp[1].position = this.position;
            }

            if (this._cb) {
                this._cb.tight.position = this.position
            }

            this.position.x += this.velocity.dx * args.dt
            this.position.y += this.velocity.dy * args.dt
        }
        
    }

    render(engine: Engine) {
        for (const sp of this.sprites){
            sp[1].render(engine)
        }
    }


    addSprites(sprites: Sprite | Sprite[]){
        if (sprites instanceof Sprite) this.sprites.set(sprites.id, sprites)
        else {
            for (const sp of sprites){
                this.addSprites(sp)
            }
        }
    }

    addChildren(children: Positionable | Positionable[]){
        if (children instanceof Positionable) {
            children.parent = this
            this.children.push(children)
        }
        else {
            for (const child of children){
                this.addChildren(child)
            }
        }
    }

    /**
     * Gets the true in-game space between this and other. Always positive. Does not indicate 
     * direction.
     * @param other Any GameObject in the scene
     * @returns The total length of the space between this and other
     */
    distanceTo(other: GameObject | Position): number{
        if (other instanceof GameObject){ other = other.position }

        return getDistance({from: this.position, to: other})
    }

    /**
     * Get a distance that can be used to compare non-directional distance between this GameObject 
     * and other Objects. Faster than getDistance or distanceTo, but information is useless for 
     * anything other than comparisons.
     * @param other Any GameObject in the scene
     * @returns The non-square-rooted pythagorean distance to other
     */
    rawDistanceTo(other: GameObject | Position): number{
        if (other instanceof GameObject){ other = other.position }

        return getRawDistance({from: this.position, to: other})
    }

    closest(otherA: GameObject[]): GameObject;
    closest(otherA: GameObject, otherB: GameObject): GameObject;

    closest(otherA: GameObject | GameObject[], otherB?: GameObject): GameObject | null{
        let minDistance = Infinity
        let out: GameObject | null = null

        if(otherA instanceof GameObject){
            if (otherB){
                const dxA = this.x - otherA.x
                const dyA = this.y - otherA.y
                
                const distanceA  = dxA * dxA + dyA * dyA

                const dxB = this.x - otherB.x
                const dyB = this.y - otherB.y
                
                const distanceB  = dxB * dxB + dyB * dyB

                out = (distanceA > distanceB) ? otherB : otherA
            }
        } else {
            for (const obj of otherA){
                if(obj === this) continue;
    
                const dx = this.x - obj.x
                const dy = this.y - obj.y
                
                const distance  = dx * dx + dy * dy
                if (distance < minDistance){ 
                    minDistance = distance;
                    out = obj;
                }
            }
        }

        return out;
    }
    
    applyForce(newForce: Vector): void {
        this.forces = this.forces.add(newForce)
    }
}