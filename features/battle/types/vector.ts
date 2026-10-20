import { getDistance } from "@/features/battle/utilities/mathUtils";
import { Position } from "./position";

export default class Vector{
    // private _originalMagnitude: number;

    private _dx: number;
    private _dy: number;
    private _magnitude: number;

    constructor(args:{dx: number, dy: number, magnitude?: number} | {startPos: Position, endPos: Position, magnitude?: number}){
        if ("dx" in args){
            this._dx = args.dx
            this._dy = args.dy
        } else {
            this._dx = args.endPos.x - args.startPos.x;
            this._dy = args.endPos.y - args.startPos.y;
        }

        this._magnitude = getDistance({from:{x:0,y:0}, to:{x:this._dx, y: this._dy}})
        
        if (args.magnitude) {
            this.magnitude = args.magnitude
        }
    }

    set magnitude(value: number){
        const currMagnitude = this._magnitude;

        if (currMagnitude === 0 || value === 0){
            this._dx = 0;
            this._dy = 0;
        } else {
            this._dx = value/this._magnitude * this._dx;
            this._dy = value/this._magnitude * this._dy;
        }
    }

    get magnitude(): number { return this._magnitude }

    get dx(): number { return this._dx }

    set dx(value: number) { 
        this._dx = value;
        
        this._magnitude = getDistance({from:{x:0,y:0}, to:{x:this._dx, y: this._dy}})
    }

    get dy(): number { return this._dy }

    set dy(value: number) {
        this._dy = value;
        
        this._magnitude = getDistance({from:{x:0,y:0}, to:{x:this._dx, y: this._dy}})
    }

    add(other: Vector): Vector {
        return new Vector({dx: this.dx + other.dx, dy: this.dy + other.dy})
    }
    
    toString(): string {
        return `Vector(dx:${this._dx}, dy:${this._dy}, magnitude: ${this._magnitude})`;
    }
}
