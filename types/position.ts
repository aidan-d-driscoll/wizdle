export type Position = {
    x: number;
    y: number;
}

export type PositionableOptions = {children?: Positionable[]} & (
    | { position: Position, parent?: never, offset?: never }
    | { position?: never, parent?: Positionable, offset?: Position}
)

export abstract class Positionable{
    public parent: Positionable | null = null;

    private _position: Position = {x: 0, y: 0}
    private _offset: Position = {x: 0, y: 0}

    get x(): number { return this.position.x } 
    get y(): number { return this.position.y }

    get position(): Position {
        return this._position
    }
    set position(value: Position) {
        this._position = {x: value.x + this._offset.x, y: value.y + this._offset.y}
    }
    set offset(value: Position) {
        this._offset = {x: value.x, y: value.y}
    }

    constructor(args:PositionableOptions){ 
        if(args.position){
            this._position = args.position;
        } else {
            if(args.parent) this.parent = args.parent
            if(args.offset) this._offset = args.offset
        }
    }
}