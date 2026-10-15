import { Position } from "@/features/battle/types/position";
import { Scene, UpdateOptions } from "../scene";
import { getDistance, getRawDistance } from "@/features/battle/utilities/mathUtils";

export type EntityOptions = {children?: Entity[], renderHeight?: number} & (
    | { position: Position, parent?: never, offset?: never }
    | { position?: never, parent?: Entity, offset?: Position}
)

/**
 * Handles basic logic available to everything in a scene: Positioning, Update, Destroy
 * 
 * Most classes extend this
 */
export abstract class Entity{
    private static nextId: number = 0;
    readonly id: number;

    public parent: Entity | null = null;

    public children = new Set<Entity>;

    private _position: Position = {x: 0, y: 0}
    private _offset: Position = {x: 0, y: 0}

    get x(): number { return this._position.x } 
    get y(): number { return this._position.y }

    renderHeight = 0

    // private _velocity: Vector = new Vector({dx: 0, dy: 0})
    // get velocity(): Vector { return this._velocity }

    // private _acceleration: Vector = new Vector({dx: 0, dy: 0})
    // get acceleration(): Vector { return this._acceleration }

    private _dead = false;
    get dead(): boolean { return this._dead }

    get position(): Position {
        return {x: this._position.x, y: this._position.y}
    }
    set position(value: Position) {
        this._position = {x: value.x + this._offset.x, y: value.y + this._offset.y}
    }
    set offset(value: Position) {
        this._offset = {x: value.x, y: value.y}
    }

    constructor(args:EntityOptions){
        this.id = Entity.nextId;
        Entity.nextId++;

        if(args.renderHeight) this.renderHeight =  args.renderHeight
        
        if(args.position){
            this._position = args.position;
        } else {
            if(args.parent) this.parent = args.parent;
            if(args.offset) this._offset = args.offset;
        }

        if(args.children) {
            for (const child of args.children){
                this.children.add(child)
                child.parent = this
                child.renderHeight += this.renderHeight
            }
        }
    }

    update(args: UpdateOptions){
        if(this.dead) args.scene.markForDestruction(this)
        else {
            if(this.parent) this.position = this.parent.position
            
            for (const child of this.children) child.update(args)
        }
    }

    destroy(){
        this._dead = true;
    }

    /**
     * Gets the true in-game space between this and other. Always positive. Does not indicate 
     * direction.
     * @param other Any Entity in the scene
     * @returns The total length of the space between this and other
     */
    distanceTo(other: Entity | Position): number{
        if (other instanceof Entity){ other = other.position }

        return getDistance({from: this.position, to: other})
    }

    /**
     * Get a distance that can be used to compare non-directional distance between this Entity 
     * and other Objects. Faster than getDistance or distanceTo, but information is useless for 
     * anything other than comparisons.
     * @param other Any Entity in the scene
     * @returns The non-square-rooted pythagorean distance to other
     */
    rawDistanceTo(other: Entity | Position): number{
        if (other instanceof Entity){ other = other.position }

        return getRawDistance({from: this.position, to: other})
    }

    closest(otherA: Set<Entity>): Entity;
    closest(otherA: Entity, otherB: Entity): Entity;

    closest(otherA: Entity | Set<Entity>, otherB?: Entity): Entity | null{
        let minDistance = Infinity
        let out: Entity | null = null

        if(otherA instanceof Entity){
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

    abstract render(scene: Scene): void;
}