import { Shape, ShapeOptions } from "@/types/shapes/shape"
import { Rectangle } from "@/types/shapes/rectangle"
import { Engine } from "@/features/battle/engine";
import { toScreenPosition, toScreenValue } from "@/utilities/renderingUtils";

export type circleOptions = ShapeOptions & {
    radius: number
}

export class Circle extends Shape{
    xMax: number;
    xMin: number;
    yMax: number;
    yMin: number;

    protected _width: number;
    protected _height: number;

    protected _radius: number;

    constructor(args:circleOptions){
        super(args)

        this._radius = args.radius

        this.xMax = this.position.x + this._radius;
        this.xMin = this.position.x - this._radius;
        this.yMax = this.position.y + this._radius;
        this.yMin = this.position.y - this._radius;
        

        this._width = 2*this._radius;
        this._height = 2*this._radius;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;

        this._width = 2*this._radius;
        this._height = 2*this._radius;
    }

    overlaps(target: Shape): boolean {
        const cx = this.position.x
        const cy = this.position.y

        if (target instanceof Rectangle) {
            // Closest point on the rectangle to the circle's center
            const nearestX = Math.max(target.xMin, Math.min(cx, target.xMax))
            const nearestY = Math.max(target.yMin, Math.min(cy, target.yMax))

            const dx = cx - nearestX
            const dy = cy - nearestY

            // Compare squared distances to avoid a sqrt
            return dx * dx + dy * dy <= this._radius * this._radius
        }
        if (target instanceof Circle) {
            const dx = cx - target.position.x
            const dy = cy - target.position.y
            const r = this._radius + target.radius
            return dx * dx + dy * dy <= r * r
        }
        return false
    }

    render(engine: Engine, color: string){
        const screenPosition = toScreenPosition(this.position, engine.canvas)

        const radiusX = toScreenValue(this.radius, engine.canvas)
        const radiusY = radiusX
        
        engine.ctx.save()

        engine.ctx.fillStyle = color
        engine.ctx.beginPath()
        engine.ctx.ellipse(screenPosition.x, screenPosition.y, radiusX, radiusY, 0, 0, Math.PI * 2)
        engine.ctx.fill()

        engine.ctx.restore()
        
    }   
}