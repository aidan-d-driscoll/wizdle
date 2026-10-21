import { toScreenPosition, toScreenValue } from "../rendering/renderingUtils";
import { Position } from "../types/position";
import { Component } from "./component";
import { Renderable } from "./interfaces";


type SpriteOptions = {
    offset?: Position;

    image: HTMLImageElement;
    width: number;
    height: number;

    renderHeight?: number;
}

export class Sprite extends Component implements Renderable{
    offset: Position;

    image: HTMLImageElement;
    width: number;
    height: number;

    visible = true;

    renderHeight: number;

    constructor(args:SpriteOptions){
        super()
        
        this.image = args.image;
        this.width = args.width;
        this.height = args.height;

        this.offset = args.offset ?? {x: 0, y: 0};

        this.renderHeight = args.renderHeight ?? 0;
    }

    onAttach(): void {
        super.onAttach();

        this.registerRenderable();
    }

    onDetach(): void {
        super.onDetach();

        this.unregisterRenderable();
    }

    render(): void {
        if (this.visible) {
            const scene = this.owner.scene;
            const position = {
                x: this.owner.position.x + this.offset.x,
                y: this.owner.position.y + this.offset.y
            }

            const screenPosition = toScreenPosition(position, scene.canvas);
            const screenWidth = toScreenValue(this.width, scene.canvas);
            const screenHeight = toScreenValue(this.height, scene.canvas);
            
            scene.ctx.save();
    
            scene.ctx.translate(screenPosition.x, screenPosition.y);

            // const scaleX = this._flippedHorizontal ? -1 : 1;
            // const scaleY = this._flippedVertical ? -1 : 1;
            // scene.ctx.scale(scaleX, scaleY);
    
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
}