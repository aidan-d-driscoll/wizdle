import { Position } from "@/features/battle/types/position"
import { HexColor } from "../rendering/renderingUtils";
import { Scene } from "../scene";

export type ShapeOptions = {
    position?: Position

    color?: HexColor
}

export abstract class Shape{
    protected _position: Position;

    abstract xMax: number;
    abstract xMin: number;
    abstract yMax: number;
    abstract yMin: number;

    protected abstract _width: number;
    protected abstract _height: number;

    color: HexColor;

    get position(): Position { return this._position }
    set position(value: Position) {
        this.xMin += value.x - this._position.x
        this.xMax += value.x - this._position.x
        this.yMin += value.y - this._position.y
        this.yMax += value.y - this._position.y

        this._position = {x: value.x, y: value.y};
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    constructor(args: ShapeOptions){
        this.color = args.color ? args.color : "#00000050"

        this._position = args.position ?? {x: 0, y:0}
    }

    abstract overlaps(target: Shape): boolean;

    abstract contains(target: Position): boolean;

    abstract render(scene: Scene): void;

    breaches(outer: Shape): boolean {
        return (this.xMin < outer.xMin) ||
                (this.xMax > outer.xMax) ||
                (this.yMin < outer.yMin) ||
                (this.yMax > outer.yMax);
    }
}
    