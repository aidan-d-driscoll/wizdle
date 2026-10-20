import { Rectangle } from "../collisions/shapes/rectangle";
import { Shape } from "../collisions/shapes/shape";
import { GameObject } from "../gameObject";
import { Position } from "../types/position";
import { Component } from "./component";
import { Updatable } from "./interfaces";


type ColliderOptions = {
    offset?: Position;

    shape: Shape;

    onCollisionEnter: (other: GameObject) => void;
    onCollisionStay: (other: GameObject) => void;
    onCollisionExit: (other: GameObject) => void;
}

export class Collider extends Component implements Updatable{
    offset: Position = {x: 0, y: 0}

    tight: Shape;
    fat: Rectangle;

    constructor(args: ColliderOptions){
        super()

        this.tight = args.shape;

        this.fat = new Rectangle({
            scene: this.owner.scene,
            width: this.tight.width + 0.1,
            height: this.tight.height + 0.1
        })

        this.onCollisionEnter = args.onCollisionEnter
        this.onCollisionStay = args.onCollisionStay
        this.onCollisionExit = args.onCollisionExit
    }

    update(dt: number){
        this.tight.position = this.owner.position
        if (this.tight.breaches(this.fat)) {
            this.owner.scene.markDirty(this)
            this.fat.position = {x: this.tight.x, y: this.tight.y}
        }
    }

    onCollisionEnter?(other: GameObject): void;
    onCollisionStay?(other: GameObject): void;
    onCollisionExit?(other: GameObject): void;
    
}