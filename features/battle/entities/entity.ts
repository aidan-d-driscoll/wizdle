import { Position } from "@/features/battle/types/position";
import { Scene } from "../scene";
import { getDistance, getRawDistance } from "@/features/battle/utilities/mathUtils";
import { Integer, integer } from "../types/integer";
import { RenderLayer } from "../globals";

export type EntityOptions = {
    scene: Scene,
    parent?: Entity,
    children?: Entity[], 
    layer?: RenderLayer, 
    position?: Position,
}

type ClosestOptions = 
    | { otherA: Entity[] | Set<Entity>, otherB: never, } 
    | { otherA: Entity, otherB: Entity}

/**
 * Handles basic logic available to everything in a scene: Positioning, Update, Destroy
 * 
 * Most classes extend this
 */
export abstract class Entity{
    private static nextId: number = 0;
    readonly id: number;

    scene: Scene;

    public parent: Entity | null = null;

    public children = new Set<Entity>;

    layer: RenderLayer = RenderLayer.GAME;

    private _active = false;
    get active(): boolean { return this._active }
    set active(value: boolean){
        this._active = value;
        for (const child of this.children){ child._active = value }
    }

    dead = false;

    private _position: Position = {x:0, y:0}
    get x(): number { return this._position.x }
    get y(): number { return this._position.y }

    get position(): Position{
        return this._position
    }
    set position(value: Position) {
        this._position = {x: value.x, y: value.y}
    }

    constructor(args:EntityOptions){
        this.id = Entity.nextId;
        Entity.nextId++;

        this.scene = args.scene;

        if(args.layer) this.layer =  args.layer;
        
        if(args.position){
            this._position = args.position;
            this.active = true;
        }

        if(args.children) {
            for (const child of args.children){
                this.addChild(child)
            }
        }
    }

    addChild(child: Entity){
        this.children.add(child);
        child.active = true;
        child.parent = this;
        child.layer = this.layer;
        child.position = this.position;
    }

    removeChild(child: Entity){
        this.children.delete(child)
    }

    destroy(){
        this.scene.markForDestruction(this)
        for (const child of this.children) { child.destroy() }
    }

    /**
     * Gets the true in-game space between this and other. Always positive. Does not indicate 
     * direction.
     * @param other Any Entity in the scene
     * @returns The total length of the space between this and other
     */
    distanceTo(other: Entity | Position): number{
        if (other instanceof Entity && other.position){ other = other.position }
        
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
    
    closest(args: ClosestOptions): Entity | null{
        let minDistance = Infinity
        let out: Entity | null = null

        if(args.otherA instanceof Entity){
            const dxA = this.x - args.otherA.x
            const dyA = this.y - args.otherA.y
            
            const distanceA  = dxA * dxA + dyA * dyA

            const dxB = this.x - args.otherB.x
            const dyB = this.y - args.otherB.y
            
            const distanceB  = dxB * dxB + dyB * dyB

            out = (distanceA > distanceB) ? args.otherB : args.otherA
        } else {
            for (const obj of args.otherA){
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

    deactivate(): void { this.active = false }

    render(scene: Scene){
        for (const e of this.children){
            e.render(scene)
        }
    }
}