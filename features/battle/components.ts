import { Rectangle } from "./collisions/shapes/rectangle";
import { Shape } from "./collisions/shapes/shape";
import { Renderable, Updatable } from "./component_interfaces";
import { GameObject } from "./entities/gameObject";
import { toScreenPosition, toScreenValue } from "./rendering/renderingUtils";
import { Position } from "./types/position";
import Vector from "./types/vector";
import { softSign } from "./utilities/mathUtils";
import { insertionSorted } from "./utilities/sortUtils";


export abstract class Component{
    owner!: GameObject;

    onAttach(): void{} 
    onDetach(): void{}

    protected registerUpdateable(this: Component & Updatable) {
        this.owner.scene.updatables.add(this);
    }
    protected unregisterUpdateable(this: Component & Updatable){
        this.owner.scene.updatables.delete(this)
    }

    protected registerRenderable(this: Component & Renderable) {
        const layer = this.owner.layer;
        this.owner.scene.renderables[layer].push(this);
        this.owner.scene.renderables[layer] = insertionSorted(this.owner.scene.renderables[layer], (a) => { return a.renderHeight });
    }
    protected unregisterRenderable(this: Component & Renderable){
        const layer = this.owner.layer;
        const idx = this.owner.scene.renderables[layer].indexOf(this);
        if (idx >= 0) this.owner.scene.renderables[layer].splice(idx, 1);
    }

    update?(dt: number): void;
    render?(): void;
}

type SpriteOptions = {
    offset?: Position;

    image: HTMLImageElement;
    width: number;
    height: number;

    renderHeight?: number;
}

export class Sprite extends Component implements Renderable{
    offset: Position = {x:0, y:0};

    image: HTMLImageElement;
    width: number;
    height: number;

    visible = true;

    renderHeight = 0;

    constructor(args:SpriteOptions){
        super()
        
        this.image = args.image;
        this.width = args.width;
        this.height = args.height;

        if(args.offset) this.offset = args.offset;

        if (args.renderHeight) this.renderHeight = args.renderHeight;
    }

    onAttach(): void {
        super.onAttach();

        this.registerRenderable();
    }

    onDetach(): void {
        super.onDetach();

        this.unregisterRenderable();
    }

    render(): void {
        
        if (this.visible) {
            const scene = this.owner.scene;
            const position = {
                x: this.owner.position.x + this.offset.x,
                y: this.owner.position.y + this.offset.y
            }

            const screenPosition = toScreenPosition(position, scene.canvas);
            const screenWidth = toScreenValue(this.width, scene.canvas);
            const screenHeight = toScreenValue(this.height, scene.canvas);
            
            scene.ctx.save();
    
            scene.ctx.translate(screenPosition.x, screenPosition.y);

            // const scaleX = this._flippedHorizontal ? -1 : 1;
            // const scaleY = this._flippedVertical ? -1 : 1;
            // scene.ctx.scale(scaleX, scaleY);
    
            scene.ctx.drawImage(
                this.image,
                -screenWidth / 2,
                -screenHeight / 2,
                screenWidth,
                screenHeight
            );
    
            scene.ctx.restore();
        }
    }
}

type BodyOptions = {
    velocity?: Vector,
    acceleration?: Vector
}

export class Body extends Component implements Updatable{
    velocity: Vector;

    acceleration: Vector;

    constructor(args: BodyOptions){
        super()

        this.velocity = args.velocity ? args.velocity : new Vector({dx: 0, dy: 0})
        
        this.acceleration = args.acceleration ? args.acceleration : new Vector({dx: 0, dy: 0})
    }

    onAttach(): void {
        super.onAttach();

        this.registerUpdateable();
    }

    onDetach(): void {
        super.onAttach();

        this.unregisterUpdateable();
    }

    update(dt: number): void {
        this.velocity.dx += this.acceleration.dx * dt
        this.velocity.dy += this.acceleration.dy * dt
        
        this.owner.position.x += this.velocity.dx * dt
        this.owner.position.y += this.velocity.dy * dt
    }
}

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