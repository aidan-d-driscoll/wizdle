export type Position = {
    x: number;
    y: number;
}

export class positionObject{
    position: Position;

    constructor(args:{x: number, y: number}){
        this.position = args;
    }

    get x(): number {
        return this.position.x
    }
    set x(value: number) {
        this.position.x = value
    }

    get y(): number {
        return this.position.y
    }

    set y(value: number) {
        this.position.y = value
    }
}

export default Position;