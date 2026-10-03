export type Position = {
    x: number;
    y: number;
}

export class positionObject{
    protected _position: Position;

    constructor(args:{x: number, y: number}){
        this._position = args;
    }

    get x(): number {
        return this._position.x
    }
    set x(value: number) {
        this._position.x = value
    }

    get y(): number {
        return this._position.y
    }

    set y(value: number) {
        this._position.y = value
    }

    get position(): Position {
        return this._position
    }

    set position(value: Position) {
        this._position = value;
    }

    getScreenPosition(canvas: HTMLCanvasElement){
        return {
            x: (this.position.x + 1) / 2 * canvas.width,
            y: (1 - (this.position.y + 1) / 2) * canvas.height
        };
    }
}

export default Position;