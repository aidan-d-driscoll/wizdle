import { Engine } from "@/features/battle/engine";
import { Shape, ShapeOptions } from "@/types/shapes/shape";
import { toScreenPosition, toScreenValue } from "@/utilities/renderingUtils";


export type rectangleOptions = ShapeOptions & {
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

    constructor(args:rectangleOptions) {
        super(args)

        this._width = args.width
        this._height = args.height

        this.xMin = this.x - 0.5 * this._width
        this.xMax = this.x + 0.5 * this._width
        this.yMin = this.y - 0.5 * this._height
        this.yMax = this.y + 0.5 * this._height
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

    render(engine: Engine, color: string){
        const screenPosition = toScreenPosition(this.position, engine.canvas)

        const width = toScreenValue(this.width, engine.canvas)
        const height = toScreenValue(this.height, engine.canvas)
        screenPosition.x -= 0.5*width
        screenPosition.y -= 0.5*height
        
        engine.ctx.save()

        engine.ctx.fillStyle = color
        engine.ctx.fillRect(screenPosition.x, screenPosition.y, width, height)

        engine.ctx.restore()
        
    }

    
}