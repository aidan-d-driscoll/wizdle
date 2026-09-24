import { spellOptions } from "@/types/options";
import Spell from "@/features/battle/spells/spell";
import { Projectile } from "@/features/battle/entities/spellEffects/projectile";
import { Wizard } from "@/features/battle/entities/wizard";
import Vector from "@/types/vector";

type boltSpellOptions = spellOptions & {
    travelSpeed: number
}

export class BoltSpell extends Spell{
    travelSpeed: number;
    width = 0.1;
    knockback:number;

    constructor(args: boltSpellOptions){
        super(args)
        this.travelSpeed = args.travelSpeed
        this.knockback = args.knockback
    }

    newCast(source: Wizard): Projectile | null {
        if (!source.attackTarget) return null
        return new Projectile({
            startingPosition: source.position,
            image: this.image,
            width: this.width,
            startingVelocity: new Vector({startPos: source.position, endPos: source.attackTarget.position, magnitude: this.travelSpeed}),
            source: source,
            knockback: this.knockback,
            travelSpeed: this.travelSpeed
        })
    }
}