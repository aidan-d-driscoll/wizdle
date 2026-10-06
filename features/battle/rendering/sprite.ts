import Position, { Positionable } from "@/types/position";
import { toScreenPosition } from "./rendering";
import { toScreenValue } from "@/utilities/renderingUtils";
import { BattleObject } from "../objects/battleObject";

type BaseSpriteOptions = {
    image: HTMLImageElement
    width: number
    height: number

    visible?: boolean
}

export type SpriteOptions = BaseSpriteOptions & (
    { owner: BattleObject, position?: Position }
    | { owner?: BattleObject, position: Position }
    | { owner?: undefined, position?: undefined}
)


export class Sprite implements Positionable{
    private static nextId: number = 0;
    readonly id: number;

    owner: BattleObject | undefined = undefined;

    private _position: Position;
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

        this.owner = args.owner

        if(args.owner){
            this._position = args.owner.position;
            if(args.position){
                this._xOffset = args.position.x;
                this._yOffset = args.position.y;

                this._position.x += this._xOffset;
                this._position.y += this._yOffset;
            }
        } else if (args.position) {
            this._position = args.position;
        } else {
            this._position = {x:0, y:0};
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

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
        if(this.owner){ this.position = this.owner.position }

        if(this.visible){
            const screenPosition = toScreenPosition(this._position, canvas)
            const screenWidth = toScreenValue(this.width, canvas)
            const screenHeight = toScreenValue(this.height, canvas);
            
            ctx.save();

            ctx.drawImage(
                this.image,
                screenPosition.x - screenWidth / 2,
                screenPosition.y - screenHeight / 2,
                screenWidth,
                screenHeight
            );

            ctx.restore();
        }
        
    }

    // getScreenPosition(canvas: HTMLCanvasElement){
    //     return {
    //         x: (this.position.x + 1) / 2 * canvas.width,
    //         y: (1 - (this.position.y + 1) / 2) * canvas.height
    //     };
    // }
}