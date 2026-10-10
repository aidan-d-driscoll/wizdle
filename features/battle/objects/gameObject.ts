import Position, { Positionable } from "@/types/position";
import { Sprite } from "../rendering/sprite";
import Vector from "@/types/vector";
import { Engine, updateOptions } from "../engine";
import { CollisionBody } from "../collisions/collisionBody";
import { Collidable } from "../collisions/collidable";

const FRICTION = 0.00015

export type objectOptions = {
    engine: Engine,

    position: Position;

    static?: boolean;
    
    sprites?: Sprite | Sprite[];
    visible?: boolean;

    collisionBody?: CollisionBody;
    physics?: boolean;

    velocity?: Vector;
}

export class GameObject implements Positionable, Collidable{
    private static nextId = 0;
    readonly id: number;

    protected _position: Position;

    static = false;

    readonly sprites = new Map<number, Sprite>

    readonly cb: CollisionBody | null = null;
    physics = false;

    protected velocity: Vector = new Vector({dx: 0, dy: 0});

    dead = false;

    get x(): number { return this._position.x }
    set x(value: number) { this._position.x = value }

    get y(): number { return this._position.y }
    set y(value: number) { this._position.y = value }

    get position(): Position { return this._position }
    set position(value: Position) { this._position = value }

    get vx(): number { return this.velocity.dx }

    get vy(): number { return this.velocity.dy }

    constructor(args:objectOptions){
        this.id = GameObject.nextId;
        GameObject.nextId++;

        this._position = args.position;

        if(args.static) this.static = args.static;

        if(args.velocity) this.velocity = args.velocity;
        
        if(args.sprites) this.addSprites(args.sprites);
            

        if(args.collisionBody) {
            this.cb = args.collisionBody
            if(args.physics) this.physics = args.physics
        }
        else this.physics = false
    }

    update(args: updateOptions){
        if (!this.static){
            for (const sp of this.sprites){
                sp[1].position = this.position
            }

            this._position.x += this.velocity.dx * args.dt
            this._position.y += this.velocity.dy * args.dt
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


    /**
     * Gets the true in-game space between this and othert. Always positive. Does not indicate 
     * direction.
     * @param other Any GameObject in the scene
     * @returns The total length of the space between this and other
     */
    distanceTo(other: GameObject): number{
        return Math.sqrt(this.compDistanceTo(other))
    }

    /**
     * Get a distance that can be used to compare non-directional distance between this GameObject 
     * and other Objects. Faster than getDistance or distanceTo, but information is useless for 
     * anything other than comparisons.
     * @param other Any GameObject in the scene
     * @returns The non-square-rooted pythagorean distance to other
     */
    compDistanceTo(other: GameObject): number{
        const dx = this.x - other.x
        const dy = this.y - other.y
        
        return dx * dx + dy * dy
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
    
}