import { Position } from "@/types/position";

export default class GameObject {
    position!: Position;
    dx!: number;
    dy!: number;
    kx!: number;
    ky!: number;

    constructor(x: number, y: number, dx: number = 0, dy: number = 0){
        this.position = {
            x: x,
            y: y
        }
        this.dx = dx;
        this.dy = dy;
        this.kx = 0;
        this.ky = 0;
    }
}