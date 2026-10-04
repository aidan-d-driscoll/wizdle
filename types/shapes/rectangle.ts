import Position from "@/types/position";
import { Shape } from "@/types/shapes/shape";

export type rectangleOptions = {startingPosition: Position, width: number, height: number}

export class Rectangle extends Shape{
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    protected _width: number;
    protected _height: number;

    constructor(args:rectangleOptions) {
        super(args.startingPosition)

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

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string){
        ctx.restore();

        const screenPosition = this.getScreenPosition(canvas)
        const bodyWidth = this.width*canvas.width/2
        const bodyHeight = this.height*canvas.height/2
        screenPosition.x -= 0.5*bodyWidth
        screenPosition.y -= 0.5*bodyHeight
        
        ctx.save();

        ctx.fillStyle = color
        ctx.fillRect(screenPosition.x, screenPosition.y, bodyWidth, bodyHeight)

        ctx.restore();

    }

    
}