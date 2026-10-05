import Position, { positionObject } from "@/types/position";

export type spriteOptions = {
    startingPosition: Position
    image: HTMLImageElement
    width: number
    height: number
    canvas: HTMLCanvasElement
}

export class Sprite extends positionObject{
    image: HTMLImageElement;
    width: number;
    height: number;

    private _screenPosition: Position;

    constructor(args:spriteOptions){
        super(args.startingPosition)

        this._screenPosition = {
            x: (this.position.x + 1) / 2 * args.canvas.width,
            y: (1 - (this.position.y + 1) / 2) * args.canvas.height
        }

        this.image = args.image;
        this.width = args.width;
        this.height = args.height;
    }

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
        this._screenPosition = this.getScreenPosition(canvas)
        
        ctx.save();

        ctx.drawImage(
            this.image,
            this._screenPosition.x - this.width / 2,
            this._screenPosition.y - this.height / 2,
            this.width,
            this.height
        );

        ctx.restore();
    }

    getScreenPosition(canvas: HTMLCanvasElement){
        return {
            x: (this.position.x + 1) / 2 * canvas.width,
            y: (1 - (this.position.y + 1) / 2) * canvas.height
        };
    }
}