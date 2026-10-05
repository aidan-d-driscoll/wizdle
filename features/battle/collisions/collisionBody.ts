import { Rectangle } from "@/types/shapes/rectangle";
import { Shape } from "@/types/shapes/shape";
import { Collidable } from "./collidable";

export type collisionBodyOptions = {
    tight: Shape;
    owner: Collidable;
    xOffset?: number;
    yOffset?: number;
}

export class CollisionBody {
    private static nextId = 0;
    readonly id: number;

    owner: Collidable;

    xOffset: number = 0;
    yOffset: number = 0;
    hasOffset = false;

    tight: Shape;
    fat: Rectangle;
    dirty: boolean = false;

    constructor(args: collisionBodyOptions) {
        this.id = CollisionBody.nextId;
        CollisionBody.nextId++;

        this.owner = args.owner;

        if(args.xOffset) this.xOffset = args.xOffset;
        if(args.yOffset) this.yOffset = args.yOffset;

        this.tight = args.tight;
        this.tight.position = args.owner.position;

        if(this.xOffset !== 0 || this.yOffset !== 0){
            this.hasOffset = true;
            this.applyOffset();
        }

        this.fat = this.newFatbox();
    }

    update(): void {
        this.tight.position = this.owner.position;
        if (this.hasOffset) this.applyOffset();

        if (this.tight.breaches(this.fat)) {
            this.dirty = true;
            this.fat.position = this.tight.position;
        }
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.fat.renderOnto(canvas, ctx, "#03ff2d56")
        this.tight.renderOnto(canvas, ctx, "#4603ff4f")
    }

    applyOffset(): void{
        this.tight.position = {x: this.tight.position.x+this.xOffset, y:this.tight.position.y+this.yOffset}
    }

    newFatbox(): Rectangle{
        return new Rectangle({ 
            startingPosition: this.tight.position, 
            width: this.tight.width+0.1, 
            height: this.tight.height+0.1
        })
    }
}