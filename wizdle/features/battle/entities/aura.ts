import Entity from "./entity";
import { entityOptions, moveOptions } from "@/types/options";
import { Wizard } from "./wizard";
import { getDistance } from "@/utilities/mathUtils";

type auraOptions = entityOptions & {
    source: Wizard
    duration: number
    knockback: number
}

export class Aura extends Entity {
    duration: number
    source: Wizard
    knockback: number
    durationTimer = 0

    constructor(args: auraOptions) {
        super(args)
        this.duration = args.duration
        this.source = args.source
        this.knockback = args.knockback
        this.width = args.width
    }

    move(args: moveOptions): void{
        this.position.x = this.source.position.x
        this.position.y = this.source.position.y
    }

    update(dt: number): void{
        this.durationTimer += dt;
        if (this.durationTimer >= this.duration) this.dead = true
        else super.update(dt)
    }

    collideWith(e: Entity): void {
        if (e instanceof Wizard && e !== this.source){
            const xDiff = e.position.x - this.position.y
            const yDiff = e.position.y - this.position.y

            const targetDistance = getDistance(e.position, this.position)
            
            const xDir = xDiff / targetDistance
            const yDir = yDiff / targetDistance
    
            const xKnockback = xDir * this.knockback
            const yKnockback = yDir * this.knockback

            e.applyKnockback(xKnockback, yKnockback)
        }
    }
}