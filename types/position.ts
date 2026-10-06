export type Position = {
    x: number;
    y: number;
}

export interface Positionable{
    get x(): number;
    set x(value: number);

    get y(): number;
    set y(value: number);

    get position(): Position;
    set position(value: Position);
}

export default Position;