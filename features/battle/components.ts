import { Rectangle } from "./collisions/shapes/rectangle";
import { Shape } from "./collisions/shapes/shape";
import { GameObject } from "./entities/gameObject";
import { UpdateOptions } from "./scene";
import { Position } from "./types/position";


export abstract class Component{
    owner!: GameObject;

    onAttach(): void{ if (this.update) this.owner.scene.updatables.add(this) } 
    onDetach(): void{ this.owner.scene.updatables.delete(this) }

    update?(dt: number): void;
    render?(): void;
}

type SpriteOptions = {
    offset?: Position;

    image: HTMLImageElement;
    width: number;
    height: number;
}

export class Sprite extends Component{
    offset: Position = {x:0, y:0};
    image: HTMLImageElement;
    width: number;
    height: number;

    constructor(args:SpriteOptions){
        super()
        
        this.image = args.image;
        this.width = args.width;
        this.height = args.height;
    }
}

type CollisionBodyOptions = {
    offset?: Position;

    shape: Shape;
}

export class CollisionBody extends Component {
    offset: Position = {x: 0, y: 0}

    tight: Shape;
    fat: Rectangle;

    constructor(args:CollisionBodyOptions){
        super()

        this.tight = args.shape;

        this.fat = new Rectangle({
            width: this.tight.width + 0.1,
            height: this.tight.height + 0.1
        })
    }

    update(dt: number){
        this.tight.position = this.owner.position
        if (this.tight.breaches(this.fat)) {
            this.owner.scene.markDirty(this)
            this.fat.position = {x: this.tight.x, y: this.tight.y}
        }
    }
    
}