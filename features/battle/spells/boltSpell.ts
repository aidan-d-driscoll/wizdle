import Spell, { spellOptions } from "@/features/battle/spells/spell";
import { Projectile } from "@/features/battle/entities/spellEffects/projectile";
import { Wizard } from "@/features/battle/entities/wizard";
import Vector from "@/types/vector";
import { setOptionalRandomNumber } from "@/utilities/mathUtils";
import { Sprite } from "../rendering/sprite";

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
        if (!source.nearestEnemy) return null
        return new Projectile({
            engine: source.engine,
            physics: false,
            startingPosition: source.position,
            sprite: new Sprite({
                canvas: source.engine.canvas,
                startingPosition: source.position,
                image: this.sprite.image,
                width: this.sprite.width,
                height: this.sprite.height,
            }),
            startingVelocity: new Vector({startPos: source.position, endPos: source.nearestEnemy.position, magnitude: this.travelSpeed}),
            source: source,
            knockback: this.knockback,
            travelSpeed: this.travelSpeed,
            damage: this.damage
        })
    }

    toString(): string{
        if (this.knockback < 40) return "Bolt Spell( cast time =" + this.castTime + ", damage=" + this.damage + ", knockback=" + this.knockback + ", travel speed=" + this.travelSpeed +")"
        else return "Imaginary Technique..."
    }
}