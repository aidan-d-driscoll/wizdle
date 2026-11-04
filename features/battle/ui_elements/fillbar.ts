import { Rectangle } from "../shapes/rectangle";
import { Entity, EntityOptions } from "../entity";
import { Scene } from "../scene";
import { HexColor } from "../rendering/renderingUtils";

export type HealthbarOptions = EntityOptions & {
    maxValue: number;
    startingValue?: number;

    width: number;
    height: number;

    color: HexColor;
    emptyColor?: HexColor;
}

export class Fillbar extends Entity{
    maxValue: number;
    _value: number;
    set value(value: number){
        const new_width = this.emptyRect.width * Math.min(value, this.maxValue) / this.maxValue
        const dw = this.currentRect.width - new_width

        this.currentRect.width = new_width
        this.currentRect.offset = {
            x: this.currentRect.offset.x - (dw/2),
            y: this.currentRect.offset.y
        }
    }
    get value(): number {
        return this._value
    }

    emptyRect: Rectangle;
    currentRect: Rectangle;

    get color(): HexColor {
        return this.currentRect.color
    }
    set color(value: HexColor) {
        this.currentRect.color = value
    }

    get emptyColor(): HexColor {
        return this.emptyRect.color
    }
    set emptyColor(value: HexColor) {
        this.emptyRect.color = value
    }

    constructor(args: HealthbarOptions){
        super(args)

        this.maxValue = args.maxValue;
        this._value = args.startingValue ? args.startingValue : this.maxValue;

        this.emptyRect = new Rectangle({
            width: args.width,
            height: args.height,
            color: args.emptyColor ? args.emptyColor : "#222222",
        })
        this.addChild(this.emptyRect)

        this.currentRect = new Rectangle({
            width: args.width,
            height: args.height,
            color: args.color,
            renderHeight: 0.01
        })
        this.addChild(this.currentRect)
        
        this.value = this.value
    }

    render(scene: Scene) {}
}