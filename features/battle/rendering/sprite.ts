import Position, { Positionable } from "@/types/position";
import { toScreenPosition } from "./rendering";
import { toScreenValue } from "@/utilities/renderingUtils";
import { Engine } from "../engine";

export type SpriteOptions = {
    image: HTMLImageElement
    width: number
    height: number
    offset?: Position

    visible?: boolean
}


export class Sprite implements Positionable{
    private static nextId: number = 0;
    readonly id: number;

    private _position!: Position;

    private _xOffset = 0;
    private _yOffset = 0;

    image: HTMLImageElement;
    width: number;
    height: number;

    visible = true;

    constructor(args:SpriteOptions){
        this.id = Sprite.nextId;
        Sprite.nextId++;

        console.log(this.id)

        if (args.offset){
            this._xOffset = args.offset.x;
            this._yOffset = args.offset.y;
        }

        this.image = args.image;
        this.width = args.width;
        this.height = args.height;

        if(args.visible !== undefined) this.visible = args.visible
    }

    get x(): number { return this._position.x }
    set x(value: number) { this._position.x = value }

    get y(): number { return this._position.y }
    set y(value: number) { this._position.y = value }

    get position(): Position { return this._position }
    set position(value: Position) { 
        this._position = value
        this._position.x += this._xOffset;
        this._position.y += this._yOffset;
    }

    render(engine: Engine){
        if(this.visible){
            const screenPosition = toScreenPosition(this._position, engine.canvas)
            const screenWidth = toScreenValue(this.width, engine.canvas)
            const screenHeight = toScreenValue(this.height, engine.canvas);
            
            engine.ctx.save();

            engine.ctx.drawImage(
                this.image,
                screenPosition.x - screenWidth / 2,
                screenPosition.y - screenHeight / 2,
                screenWidth,
                screenHeight
            );

            engine.ctx.restore();
        }
        
    }

    // getScreenPosition(canvas: HTMLCanvasElement){
    //     return {
    //         x: (this.position.x + 1) / 2 * canvas.width,
    //         y: (1 - (this.position.y + 1) / 2) * canvas.height
    //     };
    // }
}