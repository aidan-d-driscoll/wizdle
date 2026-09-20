import { spellOptions } from "@/types/options";
import Spell from "./spell";
import { Aura } from "../entities/aura";
import { Wizard } from "../entities/wizard";

type auraSpellOptions = spellOptions & {
    duration: number
}

export class AuraSpell extends Spell{
    duration: number
    width = 2

    constructor(args: auraSpellOptions){
        super(args)
        this.duration = args.duration
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
            target: source.target
        })
    }
}