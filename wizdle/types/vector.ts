import { getDistance } from "@/utilities/mathUtils";
import Position from "./position";

export default class Vector{
    private _dx:number;
    private _dy:number;
    private _magnitude: number;

    constructor(args:{dx: number, dy: number});
    constructor(args:{startPos: Position, endPos: Position});

    constructor(args:{dx: number, dy: number} | {startPos: Position, endPos: Position}){
        if ("dx" in args && "dy" in args){
            this._dx = args.dx
            this._dy = args.dy
        } else {
            this._dx = args.endPos.x - args.startPos.x;
            this._dy = args.endPos.y - args.startPos.y;
        }
        this._magnitude = this.calculateMagnitude()
    }

    calculateMagnitude(): number {
        return getDistance({x:0,y:0}, {x:this._dx, y: this._dy})
    }

    set magnitude(value: number){
        this._dx = value/this.magnitude * this._dx
        this._dy = value/this.magnitude * this._dy
        this._magnitude = value
    }

    get magnitude(): number { return this._magnitude }

    set dx(value: number){
        this._dx = value
        this._magnitude = this.calculateMagnitude()
    }

    get dx(): number { return this._dx }

    set dy(value: number){
        this._dy = value
        this._magnitude = this.calculateMagnitude()
    }

    get dy(): number { return this._dy }
    
    
}