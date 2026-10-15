import Vector from "@/features/battle/types/vector";
import { GameObject, ObjectOptions } from "../gameObject";
import Combatant from "../combatant";

export type projectileOptions = ObjectOptions & {
    source?: Combatant;
    knockback: number;
    travelSpeed: number;
    damage: number;
}

export class Projectile extends GameObject{
    knockback: Vector;
    source: Combatant | null = null;
    damage: number;

    constructor(args: projectileOptions){
        super(args)

        this.physics = false;

        if(args.source) this.source = args.source

        this.knockback = new Vector({dx: this.velocity.dx, dy: this.velocity.dy, magnitude: args.knockback})
        this.damage = args.damage
    }

    onCollisionEnter(other: GameObject){
        if (other instanceof Combatant && other !== this.source){
            other.applyKnockback(this.knockback)
            other.takeDamage(this.damage)
            this.destroy()
        }
    }
}