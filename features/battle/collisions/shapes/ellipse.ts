import { Shape, ShapeOptions } from "./shape";
import { Rectangle } from "./rectangle";
import { Circle } from "./circle";
import { Scene } from "@/features/battle/scene";
import { toScreenPosition, toScreenValue } from "@/features/battle/utilities/renderingUtils";
import { Position } from "@/features/battle/types/position";

export type EllipseOptions = ShapeOptions & {
    radiusX: number
    radiusY: number
}

export class Ellipse extends Shape {
    xMax = 0;
    xMin = 0;
    yMax = 0;
    yMin = 0;

    protected _width = 0;
    protected _height = 0;

    protected _radiusX: number;
    protected _radiusY: number;

    constructor(args: EllipseOptions) {
        super(args)

        this._radiusX = args.radiusX
        this._radiusY = args.radiusY

        this.updateBounds()
    }

    get radiusX(): number {
        return this._radiusX;
    }

    set radiusX(value: number) {
        this._radiusX = value;
        this.updateBounds()
    }

    get radiusY(): number {
        return this._radiusY;
    }

    set radiusY(value: number) {
        this._radiusY = value;
        this.updateBounds()
    }

    private updateBounds(): void {
        this.xMax = this.position.x + this._radiusX;
        this.xMin = this.position.x - this._radiusX;
        this.yMax = this.position.y + this._radiusY;
        this.yMin = this.position.y - this._radiusY;

        this._width = 2 * this._radiusX;
        this._height = 2 * this._radiusY;
    }

    contains(target: Position): boolean {
        const dx = (target.x - this.position.x) / this._radiusX
        const dy = (target.y - this.position.y) / this._radiusY

        
        return dx * dx + dy * dy <= 1
    }

    overlaps(target: Shape): boolean {
        if (target instanceof Rectangle) {
            const cx = this.position.x
            const cy = this.position.y

            const nearestX = Math.max(target.xMin, Math.min(cx, target.xMax))
            const nearestY = Math.max(target.yMin, Math.min(cy, target.yMax))

            const dx = (cx - nearestX) / this._radiusX
            const dy = (cy - nearestY) / this._radiusY

            return dx * dx + dy * dy <= 1
        }
        if (target instanceof Circle) {
            return this.overlapsEllipse(target.position, target.radius, target.radius)
        }
        if (target instanceof Ellipse) {
            return this.overlapsEllipse(target.position, target.radiusX, target.radiusY)
        }
        return false
    }

    private overlapsEllipse(other: Position, otherRadiusX: number, otherRadiusY: number): boolean {
        const dx = other.x - this.position.x
        const dy = other.y - this.position.y

        const axx = this._radiusX * this._radiusX
        const ayy = this._radiusY * this._radiusY
        const bxx = otherRadiusX * otherRadiusX
        const byy = otherRadiusY * otherRadiusY

        const separation = (s: number): number =>
            (dx * dx) / (axx / (1 - s) + bxx / s) +
            (dy * dy) / (ayy / (1 - s) + byy / s)

        let lo = 0
        let hi = 1

        for (let i = 0; i < 40; i++) {
            const m1 = lo + (hi - lo) / 3
            const m2 = hi - (hi - lo) / 3

            const f1 = separation(m1)
            const f2 = separation(m2)

            // Any value above 1 proves the ellipses are apart
            if (f1 > 1 || f2 > 1) return false

            if (f1 < f2) lo = m1
            else hi = m2
        }

        return true
    }

    render(scene: Scene) {
        const screenPosition = toScreenPosition(this.position, scene.canvas)

        const radiusX = toScreenValue(this._radiusX, scene.canvas)
        const radiusY = toScreenValue(this._radiusY, scene.canvas)

        scene.ctx.save()

        scene.ctx.fillStyle = this.color
        scene.ctx.beginPath()
        scene.ctx.ellipse(screenPosition.x, screenPosition.y, radiusX, radiusY, 0, 0, Math.PI * 2)
        scene.ctx.fill()

        scene.ctx.restore()
    }
}