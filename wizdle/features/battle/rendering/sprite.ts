import Position from "@/types/position";

export type spriteOptions = {
    position: Position
    image: HTMLImageElement
    width: number
    height: number
}

export class sprite{
    position: Position;
    image: HTMLImageElement;
    width: number;
    height: number;

    constructor(args:spriteOptions){
        this.position = args.position;
        this.image = args.image;
        this.width = args.width;
        this.height = args.height;
    }
}