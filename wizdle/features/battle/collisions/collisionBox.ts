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
        this.fat.scale(2);
    }

    update(): void {
        if (this.tight.breaches(this.fat)) {
            this.dirty = true;
            this.fat.position = this.tight.position;
        }
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){

        const fatScreenPosition = this.getFatScreenPosition(canvas)
        const fatBoxWidth = this.fat.width*canvas.width/2
        const fatBoxHeight = this.fat.height*canvas.height/2
        fatScreenPosition.x -= 0.5*fatBoxWidth
        fatScreenPosition.y -= 0.5*fatBoxHeight
        
        ctx.save();

        ctx.fillStyle = "#9c044b46"
        ctx.fillRect(fatScreenPosition.x, fatScreenPosition.y, fatBoxWidth, fatBoxHeight)

        ctx.restore();

        const screenPosition = this.getScreenPosition(canvas)
        const boxWidth = this.tight.width*canvas.width/2
        const boxHeight = this.tight.height*canvas.height/2
        screenPosition.x -= 0.5*boxWidth
        screenPosition.y -= 0.5*boxHeight
        
        ctx.save();

        ctx.fillStyle = "#13049c42"
        ctx.fillRect(screenPosition.x, screenPosition.y, boxWidth, boxHeight)

        ctx.restore();
    }

    getScreenPosition(canvas: HTMLCanvasElement){
        return {
            x: (this.tight.position.x + 1) / 2 * canvas.width,
            y: (1 - (this.tight.position.y + 1) / 2) * canvas.height
        };
    }

    getFatScreenPosition(canvas: HTMLCanvasElement){
        return {
            x: (this.fat.position.x + 1) / 2 * canvas.width,
            y: (1 - (this.fat.position.y + 1) / 2) * canvas.height
        };
    }
}