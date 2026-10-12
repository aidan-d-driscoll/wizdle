import { Rectangle } from "./shapes/rectangle";
import { Shape } from "./shapes/shape";
import { Scene, UpdateOptions } from "../scene";
import { GameObject } from "../entities/gameObject";
import Combatant from "../entities/combatant";

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

    physics = false;

    constructor(args: collisionBodyOptions) {
        this.id = CollisionBody.nextId;
        CollisionBody.nextId++;

        this.tight = args.shape;

        this.fat = this.newFatbox()
    }

    update(args: UpdateOptions): void {
        if (this.tight.breaches(this.fat)) {
            this.dirty = true;
            args.scene.cm.markDirty(this);
            if(this.owner instanceof Combatant) args.scene.tm.markDirty(this.owner)
            this.fat.position = {x: this.tight.x, y: this.tight.y}
        }
    }

    toString(): string {
        return (`|${this.fat.xMin.toFixed(2)} |${this.tight.xMin.toFixed(2)} (${this.id}) ${this.tight.xMax.toFixed(2)}| ${this.fat.xMax.toFixed(2)}| @ (${this.fat.position.x.toFixed(2)}, ${this.fat.position.y.toFixed(2)})`)
    }

    render(scene:Scene) {
        this.fat.render(scene, "#03cdff2a")
        this.tight.render(scene, "#4603ff4f")
    }

    newFatbox(): Rectangle{
        return new Rectangle({ 
            position: this.tight.position,
            width: this.tight.width+0.1,
            height: this.tight.height+0.1
        })
    }
}