import Position, { Positionable } from "@/types/position";
import { Sprite } from "../rendering/sprite";
import Vector from "@/types/vector";
import { Engine } from "../engine";
import { CollisionBody } from "../collisions/collisionBody";
import { Collidable } from "../collisions/collidable";

export type objectOptions = {
    position: Position;
    
    sprites?: Sprite[];
    visible?: boolean;

    collisionBody?: CollisionBody
    physics?: boolean

    velocity?: Vector;
}

export class BattleObject implements Positionable, Collidable{
    private static nextId = 0;
    readonly id: number;

    protected _position: Position;

    readonly sprites: Sprite[] = [];

    readonly cb: CollisionBody | null = null;
    physics = false;

    protected _velocity: Vector = new Vector({dx: 0, dy: 0});

    dead = false;

    constructor(args:objectOptions){
        this.id = BattleObject.nextId;
        BattleObject.nextId++;

        this._position = args.position;

        if(args.velocity) this._velocity = args.velocity

        // Sprite and visibility logic, if no sprite is given the object is automatically not visible
        if(args.sprites) {
            this.sprites = args.sprites
            for(const sprite of this.sprites){
                sprite.owner = this
            }
        }

        if(args.collisionBody) {
            this.cb = args.collisionBody
            if(args.physics) this.physics = args.physics
        }
        else this.physics = false
    }

    update({dt, scene}: {dt: number, scene: Engine}){
        this._position.x += this._velocity.dx * dt
        this._position.y += this._velocity.dy * dt
    }

    get x(): number { return this._position.x }
    set x(value: number) { this._position.x = value }

    get y(): number { return this._position.y }
    set y(value: number) { this._position.y = value }

    get position(): Position { return this._position }
    set position(value: Position) { this._position = value }

    get vx(): number { return this._velocity.dx }

    get vy(): number { return this._velocity.dy }

    
}