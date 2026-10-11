import { Engine } from "@/features/battle/engine";
import { Position, Positionable, PositionableOptions } from "@/types/position"

export type ShapeOptions = PositionableOptions;

export abstract class Shape extends Positionable{
    abstract xMax: number;
    abstract xMin: number;
    abstract yMax: number;
    abstract yMin: number;

    protected abstract _width: number;
    protected abstract _height: number;

    get position(): Position { return super.position }
    set position(value: Position) {
        this.xMin += value.x - this.x
        this.xMax += value.x - this.x
        this.yMin += value.y - this.y
        this.yMax += value.y - this.y

        super.position = {x: value.x, y: value.y};
        
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    abstract overlaps(target: Shape): boolean;

    abstract render(engine: Engine, color: string): void;

    breaches(outer: Shape): boolean {
        return (this.xMin < outer.xMin) ||
                (this.xMax > outer.xMax) ||
                (this.yMin < outer.yMin) ||
                (this.yMax > outer.yMax);
    }


}
    