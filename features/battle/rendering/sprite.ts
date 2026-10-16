import { Entity, EntityOptions } from "../entities/entity";
import { toScreenPosition } from "./rendering";
import { toScreenValue } from "@/features/battle/utilities/renderingUtils";
import { Scene } from "../scene";

export type SpriteOptions = EntityOptions & {
    image: HTMLImageElement
    width: number
    height: number

    visible?: boolean
}


export class Sprite extends Entity{
    image: HTMLImageElement;
    width: number;
    height: number;

    visible = true;

    protected _flippedVertical = false;
    protected _flippedHorizontal = false;

    constructor(args:SpriteOptions){
        super(args)

        this.image = args.image;
        this.width = args.width;
        this.height = args.height;

        if(args.visible !== undefined) this.visible = args.visible
    }

    render(scene: Scene){
        if (this.visible) {
            const screenPosition = toScreenPosition(this.position, scene.canvas);
            const screenWidth = toScreenValue(this.width, scene.canvas);
            const screenHeight = toScreenValue(this.height, scene.canvas);
            
            scene.ctx.save();
    
            scene.ctx.translate(screenPosition.x, screenPosition.y);
    
            const scaleX = this._flippedHorizontal ? -1 : 1;
            const scaleY = this._flippedVertical ? -1 : 1;
            scene.ctx.scale(scaleX, scaleY);
    
            scene.ctx.drawImage(
                this.image,
                -screenWidth / 2,
                -screenHeight / 2,
                screenWidth,
                screenHeight
            );
    
            scene.ctx.restore();
        }
        
    }

    flipHorizontal(): void { this._flippedHorizontal = !this._flippedHorizontal }

    flipVertical(): void { this._flippedVertical = !this._flippedVertical }
}