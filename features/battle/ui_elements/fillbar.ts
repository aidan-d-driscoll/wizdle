import { Rectangle } from "../collisions/shapes/rectangle";
import { Entity, EntityOptions } from "../entities/entity";
import { Scene } from "../scene";
import { HexColor } from "../utilities/renderingUtils";

export type HealthbarOptions = EntityOptions & {
    maxHP: number;
    color?: HexColor;
}

export class Fillbar extends Entity{
    maxHP: number;

    empty_rect: Rectangle;
    current_rect: Rectangle;

    color?: HexColor;

    constructor(args: HealthbarOptions){
        super(args)
        this.maxHP = args.maxHP
        this.color = args.color ? args.color : "#2320ff"

        this.empty_rect = new Rectangle({
            width: 0.2,
            height: 0.02
        })
        this.addChild(this.empty_rect)

        this.current_rect = new Rectangle({
            width: 0.2,
            height: 0.02,
            color: this.color,
            renderHeight: 0.01
        })
        this.addChild(this.current_rect)

        console.log(this.current_rect.offset)
    }

    setHealth(current: number){
        const new_width = 0.2 * Math.min(current, this.maxHP) / this.maxHP
        const dw = this.current_rect.width - new_width

        console.log(this.current_rect.offset)

        this.current_rect.width = new_width
        this.current_rect.offset = {
            x: this.current_rect.offset.x - (dw/2),
            y: this.current_rect.offset.y
        }
    }

    render(scene: Scene) {
        for (const child of this.children){
            child.render(scene)
        }
    }
}