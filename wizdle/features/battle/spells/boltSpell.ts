import { spellOptions } from "@/types/options";
import Spell from "./spell";
import { Projectile } from "../entities/projectile";
import { Wizard } from "../entities/wizard";
import Vector from "@/types/vector";
import { setOptionalRandomNumber } from "@/utilities/mathUtils";

const MIN_TRAVEL_SPEED = 1;
const MAX_TRAVEL_SPEED = 2.5;


type boltSpellOptions = spellOptions & {
    travelSpeed?: number
}

export class BoltSpell extends Spell{
    travelSpeed: number;
    width = 0.07;

    constructor(args: boltSpellOptions){
        super(args)

        this.travelSpeed = setOptionalRandomNumber({value: args.travelSpeed, min: MIN_TRAVEL_SPEED, max: MAX_TRAVEL_SPEED})
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
            travelSpeed: this.travelSpeed,
            damage: this.damage
        })
    }

    toString(): string{
        return "Bolt Spell( cast time =" + this.castTime + ", damage=" + this.damage + ", knockback=" + this.knockback + ", travel speed=" + this.travelSpeed +")"
    }
}