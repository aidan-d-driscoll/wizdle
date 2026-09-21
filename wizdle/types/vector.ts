import { getDistance } from "@/utilities/mathUtils";
import Position from "./position";

export default class Vector{
    private _xDir: number;
    private _yDir: number;
    private _originalMagnitude: number;

    private _dx:number;
    private _dy:number;
    private _magnitude: number;

    constructor(args:{dx: number, dy: number, magnitude?: number} | {startPos: Position, endPos: Position, magnitude?: number}){
        //console.log("mag " + args.magnitude)

        console.log("-----------------------------------------------")
        console.log("new vector in mag:" + args.magnitude)

        if ("dx" in args){
            console.log("> dx: " + args.dx + ", dy: " + args.dy)
            this._yDir = args.dx
            this._xDir = args.dy
        } else {
            this._yDir = args.startPos.x - args.endPos.x;
            this._xDir = args.startPos.y - args.endPos.y;
            console.log("> [positions] dx: " + this._xDir + ", dy: " + this._yDir)
        }

        this._originalMagnitude = getDistance({x:0,y:0}, {x:this._xDir, y: this._yDir})

        if (args.magnitude) {
            console.log("mag mag")
            this._magnitude = args.magnitude
            this._dx = args.magnitude/this._originalMagnitude * this._xDir
            this._dy = args.magnitude/this._originalMagnitude * this._yDir
        }
        else {
            this._magnitude = this._originalMagnitude
            this._dx = this._xDir
            this._dy = this._yDir
        }
        
        console.log("new vector out mag: " + this._magnitude)
    }

    set magnitude(value: number){
        this._magnitude = value
        this._dx = value/this._originalMagnitude * this._xDir
        this._dy = value/this._originalMagnitude * this._yDir
    }

    get magnitude(): number { return this._magnitude }

    get dx(): number { return this._dx }

    get dy(): number { return this._dy }
    
    toString(): string {
        return `Vector(dx:${this._dx}, dy:${this._dy}, magnitude: ${this._magnitude})`;
    }
}
