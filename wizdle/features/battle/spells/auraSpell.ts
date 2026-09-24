import { spellOptions } from "@/types/options";
import Spell from "@/features/battle/spells/spell";
import { Aura } from "@/features/battle/entities/spellEffects/aura";
import { Wizard } from "@/features/battle/entities/wizard";

type auraSpellOptions = spellOptions & {
    duration: number
    yOffset: number
}

export class AuraSpell extends Spell{
    duration: number
    width = 2
    yOffset = 0

    constructor(args: auraSpellOptions){
        super(args)
        this.duration = args.duration
        this.yOffset = args.yOffset
    }

    newCast(source: Wizard): Aura | null {
        if (!source.target) return null
        return new Aura({
            source: source,
            startingPosition: source.position,
            image: this.image,
            width: this.width,
            knockback: this.knockback,
            duration: this.duration,
            target: source.target,
            yOffset: this.yOffset
        })
    }
}