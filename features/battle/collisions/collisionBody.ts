import { Rectangle } from "./shapes/rectangle";
import { Shape } from "./shapes/shape";
import { Scene, UpdateOptions } from "../scene";
import { Entity, EntityOptions } from "../entity";
import { GameObject } from "../gameObject";

export type CollisionBodyOptions = EntityOptions & {
    shape: Shape;
    xOffset?: number;
    yOffset?: number;
}

export class CollisionBody extends Entity{
    parent!: GameObject;

    tight: Shape;
    dirty: boolean = false;

    physics = false;

    constructor(args: CollisionBodyOptions) {
        super(args)

        this.tight = args.shape;
        this.tight.color = "#0000003f";

        this.addChild(this.tight)
    }

    update(args: UpdateOptions): void {
        super.update(args)

        
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    newFatbox(): Rectangle{
        return new Rectangle({ 
            position: this.tight.position,
            width: this.tight.width+0.1,
            height: this.tight.height+0.1
        })
    }
}