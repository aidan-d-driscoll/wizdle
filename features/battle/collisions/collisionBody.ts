import { Rectangle } from "@/types/shapes/rectangle";
import { Shape } from "@/types/shapes/shape";
import Entity from "@/features/battle/entities/entity";
import { Collidable } from "./collidable";

export type collisionBodyOptions = {
    tight: Shape
    owner: Collidable
}

export class CollisionBody {
    private static nextId = 0;
    readonly id: number;

    owner: Collidable;

    tight: Shape;
    fat: Rectangle;
    dirty: boolean = false;

    constructor(args: collisionBodyOptions) {
        this.id = CollisionBody.nextId;
        CollisionBody.nextId++;

        this.owner = args.owner;

        this.tight = args.tight
        this.fat = new Rectangle({ startingPosition: this.tight.position, width: this.tight.width, height: this.tight.height})
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

    renderOnto(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.fat.renderOnto(canvas, ctx, "#03ff2d56")
        this.tight.renderOnto(canvas, ctx, "#4603ff4f")
    }
}