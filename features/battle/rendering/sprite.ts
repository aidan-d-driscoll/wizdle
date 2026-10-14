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

    constructor(args:SpriteOptions){
        super(args)

        this.image = args.image;
        this.width = args.width;
        this.height = args.height;

        if(args.visible !== undefined) this.visible = args.visible
    }

    render(scene: Scene){
        if(this.visible){
            const screenPosition = toScreenPosition(this.position, scene.canvas)
            const screenWidth = toScreenValue(this.width, scene.canvas)
            const screenHeight = toScreenValue(this.height, scene.canvas);
            
            scene.ctx.save();

            scene.ctx.drawImage(
                this.image,
                screenPosition.x - screenWidth / 2,
                screenPosition.y - screenHeight / 2,
                screenWidth,
                screenHeight
            );

            scene.ctx.restore();
        }
        
    }
}