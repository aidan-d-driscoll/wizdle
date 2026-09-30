import { Rectangle, rectangleOptions } from "@/types/rectangle";

export class CollisionBox{
    private static nextId = 0;
    readonly id: number;

    tight: Rectangle;
    fat: Rectangle;
    dirty: boolean = false;

    constructor(args: rectangleOptions) {
        this.id = CollisionBox.nextId;
        CollisionBox.nextId++;

        this.tight = new Rectangle(args)
        this.fat = new Rectangle(args)
        this.fat.scale(1.1);
    }

    update(): void {
        // console.log("COLLBOX")
        if (this.tight.breaches(this.fat)) {
            this.dirty = true;
            this.fat.position = this.tight.position;
        }
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
        const screenPosition = this.getScreenPosition(canvas)
        
        ctx.save();

        ctx.fillStyle = "#13049c42"
        ctx.fillRect(screenPosition.x, screenPosition.y, this.tight.width, this.tight.height)

        ctx.restore();
    }

    getScreenPosition(canvas: HTMLCanvasElement){
        return {
            x: (this.tight.position.x + 1) / 2 * canvas.width - 0.5 * this.tight.width,
            y: (1 - (this.tight.position.y + 1) / 2) * canvas.height - 0.5 * this.tight.height
        };
    }
}