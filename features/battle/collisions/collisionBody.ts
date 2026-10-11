import { Rectangle } from "@/types/shapes/rectangle";
import { Shape } from "@/types/shapes/shape";
import { Engine } from "../engine";
import { GameObject } from "../objects/gameObject";

export type collisionBodyOptions = {
    shape: Shape;
    xOffset?: number;
    yOffset?: number;
}

export class CollisionBody {
    private static nextId = 0;
    readonly id: number;

    owner!: GameObject;

    tight: Shape;
    fat: Rectangle;
    dirty: boolean = false;

    constructor(args: collisionBodyOptions) {
        this.id = CollisionBody.nextId;
        CollisionBody.nextId++;

        this.tight = args.shape;

        this.fat = this.newFatbox()
    }

    update(): void {
        if (this.tight.breaches(this.fat)) {
            this.dirty = true;
            this.fat.position = {x: this.tight.x, y: this.tight.y}
        }
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    render(engine:Engine) {
        this.fat.render(engine, "#03ff2d56")
        this.tight.render(engine, "#4603ff4f")
    }

    newFatbox(): Rectangle{
        return new Rectangle({ 
            position: this.tight.position,
            width: this.tight.width+0.1,
            height: this.tight.height+0.1
        })
    }
}