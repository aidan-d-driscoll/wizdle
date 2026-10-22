import { Rectangle } from "../shapes/rectangle";
import { Shape } from "../shapes/shape";
import { GameObject } from "../gameObject";
import { Position } from "../types/position";
import { Component, ComponentType } from "./component";
import { Renderable, Updatable } from "./interfaces";
import { Body } from "./body";


type ColliderOptions = {
    offset?: Position;

    shape: Shape;

    onCollisionEnter?: (other: GameObject) => void;
    onCollisionStay?: (other: GameObject) => void;
    onCollisionExit?: (other: GameObject) => void;
}

export class Collider extends Component implements Updatable, Renderable{
    static requires: ComponentType[] = [Body]

    body!: Body;

    offset: Position = {x: 0, y: 0}

    tight: Shape;
    fat!: Rectangle;

    renderHeight: number;

    constructor(args: ColliderOptions){
        super()

        this.tight = args.shape;

        this.renderHeight = 0;

        this.onCollisionEnter = args.onCollisionEnter;
        this.onCollisionStay = args.onCollisionStay;
        this.onCollisionExit = args.onCollisionExit;
    }

    onAttach(): void {
        super.onAttach();

        this.followOwnerPosition()

        this.fat = new Rectangle({
            position: {
                x: this.owner.position.x,
                y: this.owner.position.y
            },
            width: this.tight.width + 0.1,
            height: this.tight.height + 0.1
        })

        const body = this.owner.get(Body);

        if (!body) throw new Error("Attampted to add Collider to GameObject with no Body");
        
        this.body = body;

        this.registerUpdateable();
        this.registerRenderable();
    }

    onDetach(): void {
        this.unregisterUpdateable();
        this.unregisterRenderable();
    }

    update(dt: number){
        this.followOwnerPosition();

        if (this.tight.breaches(this.fat)) {
            this.owner.scene.markDirty(this)
            this.fat.position = {x: this.tight.position.x, y: this.tight.position.y}
        }
    }
    render(){
        this.fat.render(this.owner.scene)
        this.tight.render(this.owner.scene)
    }

    protected followOwnerPosition() {
        this.tight.position = {
            x: this.owner.position.x + this.offset.x,
            y: this.owner.position.y + this.offset.y
        }
    }

    onCollisionEnter?(other: GameObject): void;
    onCollisionStay?(other: GameObject): void;
    onCollisionExit?(other: GameObject): void;
    
}