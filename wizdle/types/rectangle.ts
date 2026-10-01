import Position, { positionObject } from "@/types/position";

export type rectangleOptions = {startingPosition: Position, width: number, height: number}

export class Rectangle extends positionObject{
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    private _width: number;
    private _height: number;

    constructor(args:rectangleOptions) {
        super(args.startingPosition)

        this._width = args.width
        this._height = args.height

        this.xMin = this.x - 0.5 * this._width
        this.xMax = this.x + 0.5 * this._width
        this.yMin = this.y - 0.5 * this._height
        this.yMax = this.y + 0.5 * this._height
    }

    set position(value: Position) {
        this.xMin += value.x - this.x
        this.xMax += value.x - this.x
        this.yMin += value.y - this.y
        this.yMax += value.y - this.y
        // console.log("val - " + this.xMin + "," + this.xMax)

        super.position = value
    }

    get position(): Position {
        return super.position;
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    overlaps(target: Rectangle): boolean {
        return (this.xMin <= target.xMax) && 
           (this.xMax >= target.xMin) && 
           (this.yMin <= target.yMax) && 
           (this.yMax >= target.yMin);
    }

    scale(multiplier: number, scaleX: boolean = true, scaleY: boolean = true): void {
        if (scaleX){
            const widthGrowth = Math.abs((this._width * multiplier) - this._width)
            this._width = this._width * multiplier
            this.xMax += 0.5 * widthGrowth
            this.xMin -= 0.5 * widthGrowth
        }
        
        if (scaleY){
            const heightGrowth = Math.abs((this._height * multiplier) - this._height)
            this._height = this._height * multiplier
            this.yMax += 0.5 * heightGrowth
            this.yMin -= 0.5 * heightGrowth
        }
    }

    breaches(outer: Rectangle): boolean {
        return (this.xMin < outer.xMin) ||
               (this.xMax > outer.xMax) ||
               (this.yMin < outer.yMin) ||
               (this.yMax > outer.yMax);
    }
}