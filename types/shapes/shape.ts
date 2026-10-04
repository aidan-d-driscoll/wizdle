import Position, { positionObject } from "@/types/position"

export type shapeOptions = {
    startingPosition: Position
}

export abstract class Shape extends positionObject{
    abstract xMax: number;
    abstract xMin: number;
    abstract yMax: number;
    abstract yMin: number;

    protected abstract _width: number;
    protected abstract _height: number;

    abstract overlaps(target: Shape): boolean

    abstract renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string): void

    breaches(outer: Shape): boolean {
        return (this.xMin < outer.xMin) ||
                (this.xMax > outer.xMax) ||
                (this.yMin < outer.yMin) ||
                (this.yMax > outer.yMax);
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
}
    