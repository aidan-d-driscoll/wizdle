import { Scene } from "@/features/battle/scene";
import { Shape, ShapeOptions } from "./shape";
import { toScreenPosition, toScreenValue } from "@/features/battle/utilities/renderingUtils";
import { Position } from "@/features/battle/types/position";


export type RectangleOptions = ShapeOptions & {
    width: number, 
    height: number
}

export class Rectangle extends Shape{
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    protected _width: number;
    protected _height: number;

    constructor(args:RectangleOptions) {
        super(args)

        this._width = args.width
        this._height = args.height

        this.xMin = this.x - 0.5 * this._width
        this.xMax = this.x + 0.5 * this._width
        this.yMin = this.y - 0.5 * this._height
        this.yMax = this.y + 0.5 * this._height
    }

    contains(target: Position){
        return (this.xMin <= target.x) && 
           (this.xMax >= target.x) && 
           (this.yMin <= target.y) && 
           (this.yMax >= target.y);
    }

    overlaps(target: Shape): boolean {
        if (!(target instanceof Rectangle)) return target.overlaps(this)

        return (this.xMin <= target.xMax) && 
           (this.xMax >= target.xMin) && 
           (this.yMin <= target.yMax) && 
           (this.yMax >= target.yMin);
    }

    scale(multiplier: number, scaleX: boolean = true, scaleY: boolean = true): void {
        if (scaleX){
            const widthGrowth = Math.abs((this._width * multiplier) - this._width)
            this._width = this._width * multiplier
            this.xMax += 0.5 * widthGrowth
            this.xMin -= 0.5 * widthGrowth
        }
        
        if (scaleY){
            const heightGrowth = Math.abs((this._height * multiplier) - this._height)
            this._height = this._height * multiplier
            this.yMax += 0.5 * heightGrowth
            this.yMin -= 0.5 * heightGrowth
        }
    }

    render(scene: Scene, color: string){
        const screenPosition = toScreenPosition(this.position, scene.canvas)

        const width = toScreenValue(this.width, scene.canvas)
        const height = toScreenValue(this.height, scene.canvas)
        screenPosition.x -= 0.5*width
        screenPosition.y -= 0.5*height
        
        scene.ctx.save()

        scene.ctx.fillStyle = color
        scene.ctx.fillRect(screenPosition.x, screenPosition.y, width, height)

        scene.ctx.restore()
        
    }

    
}