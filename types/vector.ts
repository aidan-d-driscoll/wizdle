import { getDistance } from "@/utilities/mathUtils";
import Position from "./position";

export default class Vector{
    private _originalMagnitude: number;

    private _dx:number;
    private _dy:number;
    private _magnitude: number;

    constructor(args:{dx: number, dy: number, magnitude?: number} | {startPos: Position, endPos: Position, magnitude?: number}){
        if ("dx" in args){
            this._dx = args.dx
            this._dy = args.dy
        } else {
            this._dx = args.endPos.x - args.startPos.x;
            this._dy = args.endPos.y - args.startPos.y;
        }

        this._originalMagnitude = getDistance({from:{x:0,y:0}, to:{x:this._dx, y: this._dy}})
        

        if (args.magnitude) {
            this._magnitude = this._originalMagnitude * args.magnitude
            this._dx = args.magnitude/this._originalMagnitude * this._dx
            this._dy = args.magnitude/this._originalMagnitude * this._dy
        }
        else {
            this._magnitude = this._originalMagnitude
        }
    }

    set magnitude(value: number){
        this._magnitude = value
        if (this._originalMagnitude === 0){
            this._dx = 0
            this._dy = 0
        } else {
            this._dx = value/this._originalMagnitude * this._dx
            this._dy = value/this._originalMagnitude * this._dy
        }
    }

    get magnitude(): number { return this._magnitude }

    get dx(): number { return this._dx }

    get dy(): number { return this._dy }
    
    toString(): string {
        return `Vector(dx:${this._dx}, dy:${this._dy}, magnitude: ${this._magnitude})`;
    }
}
