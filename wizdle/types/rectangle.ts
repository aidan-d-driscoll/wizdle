import { positionObject } from "@/types/position";

export type rectangleOptions = {xMin: number, xMax: number, yMin: number, yMax: number}

export class Rectangle extends positionObject{
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    private _width: number;
    private _height: number;

    constructor({xMin, xMax, yMin, yMax}:rectangleOptions) {
        const width = xMax - xMin
        const height = yMax - yMin

        super({x: width/2, y: height/2})
        this.xMin = xMin
        this.xMax = xMax
        this.yMin = yMin
        this.yMax = yMax

        this._width = width
        this._height = height
    }

    overlaps(target: Rectangle): boolean {
        return (this.xMin <= target.xMax) && 
           (this.xMax >= target.xMin) && 
           (this.yMin <= target.yMax) && 
           (this.yMax >= target.yMin);
    }

    scale(mulitplier: number, scaleX: boolean = true, scaleY: boolean = true): void {
        if (scaleX){
            const widthGrowth = Math.abs((this._width * mulitplier) - this._width)
            this._width = widthGrowth
            this.xMax += 0.5 * widthGrowth
            this.xMin += 0.5 * widthGrowth
        }
        
        if (scaleY){
            const heightGrowth = Math.abs((this._height * mulitplier) - this._height)
            this._height = heightGrowth
            this.xMax += 0.5 * heightGrowth
            this.xMin += 0.5 * heightGrowth
        }
    }

    breaches(outer: Rectangle): boolean {
        return (this.xMax > outer.xMax) || 
           (this.xMin > outer.xMin) || 
           (this.yMin > outer.yMin) || 
           (this.yMax > outer.yMax);
    }
}