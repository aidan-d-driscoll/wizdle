import Combatant, { CombatantOptions } from "./combatant";
import { setOptionalRandomNumber } from "@/utilities/mathUtils";
import Spell from "@/features/battle/spells/spell";
import { UpdateOptions } from "../scene";
import { BoltSpell } from "../spells/boltSpell";
import { Sprite } from "../rendering/sprite";

const CIRCLING_SPEED = 1.2

type WizardOptions = CombatantOptions & {
    spells: Spell[],
    name: string
}

export class Wizard extends Combatant{
    castTimers: number[] = [];
    spells: Spell[] = [];

    name: string;

    radius = 0.1;

    constructor(args: WizardOptions) {
        super(args)

        this.name = args.name;

        const spellArtNum = setOptionalRandomNumber({min: 0, max: 3.03})
        let spellArt = new Image();
        spellArt.src = "/assets/red-ray.png";

        if (spellArtNum < 1){
            spellArt = new Image();
            spellArt.src = "/assets/gold-bolt.png";
        } else if (spellArtNum < 2) {
            spellArt = new Image();
            spellArt.src = "/assets/blue-blast.png";
        } else if (spellArtNum < 3) {
            spellArt = new Image();
            spellArt.src = "/assets/red-ray.png";
        } else {
            spellArt = new Image();
            spellArt.src = "/assets/grape-shot.png";
        }

        this.spells = [new BoltSpell({
            caster: this,
            knockback: (spellArtNum > 3) ? 50 : undefined,
            travelSpeed: (spellArtNum > 3) ? 2 : undefined,
            sprite: new Sprite({
                image: spellArt,
                width: 0.2,
                height: 0.2
            })
        })]

        
        for (let i=0; i<this.spells.length; i++){
            this.castTimers.push(0)
        }

        this.name = args.name;

        console.log(this.toString())

    }

    update(args: UpdateOptions){
        super.update(args)

        if (!this.dead){
            for(let i = 0; i < this.castTimers.length; i++){
                this.castTimers[i] += args.dt
                if (this.castTimers[i] >= this.spells[i].castTime){
                    this.spells[i].newCast(this, args.scene)
                    this.castTimers[i] -= this.spells[i].castTime
                }
            }
        }
    }

    toString(){
        let out = this.name + "\n > Max HP = " + this.currentHP + "\n > speed: " + this.moveSpeed + "\n > spells:"
        for(const spell of this.spells)
            out += "\n   > " +spell.toString()
        return out
    }
}