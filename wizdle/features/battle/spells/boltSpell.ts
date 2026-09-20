import { spellOptions } from "@/types/options";
import Spell from "./spell";
import { Bolt } from "../entities/bolt";
import { Projectile } from "../entities/projectile";
import { Wizard } from "../entities/wizard";

type boltSpellOptions = spellOptions & {
    travelSpeed: number
}

export class BoltSpell extends Spell{
    travelSpeed: number
    width = 0.3

    constructor(args: boltSpellOptions){
        super(args)
        this.travelSpeed = args.travelSpeed
    }

    newCast(source: Wizard): Projectile | null {
        if (!source.target) return null
        return new Bolt({
            source: source,
            startingPosition: source.position,
            image: this.image,
            width: this.width,
            target: source.target,
            knockback: this.knockback,
            travelSpeed: this.travelSpeed
        })
    }
}