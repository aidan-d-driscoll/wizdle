import Entity from "./entity";
import { entityOptions, moveOptions } from "@/types/options";
import { Wizard } from "./wizard";
import { getDistance } from "@/utilities/mathUtils";

type auraOptions = entityOptions & {
    source: Wizard
    duration: number
    knockback: number
    yOffset: number
}

export class Aura extends Entity {
    duration: number
    source: Wizard
    knockback: number
    durationTimer = 0
    yOffset: number = 0

    constructor(args: auraOptions) {
        super(args)
        this.duration = args.duration
        this.source = args.source
        this.knockback = args.knockback
        this.width = args.width
        this.yOffset = args.yOffset
    }

    move(args: moveOptions): void{
        this.x = this.source.x
        this.y = this.source.y + this.yOffset
    }

    update(dt: number): void{
        this.durationTimer += dt;
        if (this.durationTimer >= this.duration) this.dead = true
        else super.update(dt)
    }

    collideWith(e: Entity): void {
        if (e instanceof Wizard && e !== this.source){
            const xDiff = e.x - this.y
            const yDiff = e.y - this.y

            const targetDistance = getDistance({from: e.position, to: this.position})
            
            const xDir = xDiff / targetDistance
            const yDir = yDiff / targetDistance
    
            const xKnockback = xDir * this.knockback
            const yKnockback = yDir * this.knockback

            e.applyKnockback(xKnockback, yKnockback)
        }
    }
}