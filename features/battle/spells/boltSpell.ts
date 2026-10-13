import Spell, { spellOptions } from "@/features/battle/spells/spell";
import { Projectile } from "@/features/battle/entities/spellEffects/projectile";
import Vector from "@/types/vector";
import { setOptionalRandomNumber } from "@/utilities/mathUtils";
import { Sprite } from "../rendering/sprite";
import { Scene } from "../scene";
import { CollisionBody } from "../collisions/collisionBody";
import { Circle } from "../collisions/shapes/circle";
import Combatant from "../entities/combatant";

const MIN_TRAVEL_SPEED = 1;
const MAX_TRAVEL_SPEED = 2;


type boltSpellOptions = spellOptions & {
    travelSpeed?: number
}

export class BoltSpell extends Spell{
    travelSpeed: number;
    width = 0.07;

    constructor(args: boltSpellOptions){
        super(args)

        this.travelSpeed = setOptionalRandomNumber({value: args.travelSpeed, min: MIN_TRAVEL_SPEED, max: MAX_TRAVEL_SPEED}) * this.spellQuality
    }

    newCast(source: Combatant, scene: Scene): void {
        if(source.nearestEnemy){
            scene.add(new Projectile({
                scene: scene,
                physics: false,
                position: source.position,
                children: [new Sprite({
                    image: this.sprite.image,
                    width: this.sprite.width,
                    height: this.sprite.height,
                })],
                velocity: new Vector({startPos: source.position, endPos: source.nearestEnemy.position, magnitude: this.travelSpeed}),
                source: source,
                knockback: this.knockback,
                travelSpeed: this.travelSpeed,
                damage: this.damage,
                cb: new CollisionBody({
                    shape: new Circle({ radius: 0.04 })
                })
            }))
        }
    }

    toString(): string{
        if (this.knockback < 40) return "Bolt Spell( cast time =" + this.castTime + ", damage=" + this.damage + ", knockback=" + this.knockback + ", travel speed=" + this.travelSpeed +")"
        else return "Imaginary Technique..."
    }
}