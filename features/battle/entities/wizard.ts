import Combatant, { CombatantOptions } from "./combatant";
import { getRandomFloat, setOptionalRandomNumber } from "@/features/battle/utilities/mathUtils";
import Spell from "@/features/battle/spells/spell";
import { UpdateOptions } from "../scene";
import { BoltSpell } from "../spells/boltSpell";
import { Sprite } from "../rendering/sprite";
import { HexColor } from "../utilities/renderingUtils";

type WizardOptions = CombatantOptions & {
    spells: Spell[],
    name: string
}

const CAST_BAR_Y_SPACING = 0.035

export class Wizard extends Combatant{
    castTimers: number[] = [];
    spells: Spell[] = [];

    name: string;

    radius = 0.1;

    constructor(args: WizardOptions) {
        super(args)

        this.name = args.name;

        let numSpells = 1
        let randomNum = getRandomFloat(0, 1)

        while (randomNum < 0.75){
            numSpells++;
            randomNum = getRandomFloat(0, 1)
        }

        for(let i = 0; i < numSpells; i++){
            const spellArtNum = setOptionalRandomNumber({min: 0, max: 4.01})
            let castColor: HexColor
            const spellArt = new Image();
            spellArt.src = "/assets/testing-assets/red-ray.png";

            if (spellArtNum < 1) {
                spellArt.src = "/assets/testing-assets/blue-blast.png";
                castColor = "#25beda";
            } else if (spellArtNum < 2) {
                spellArt.src = "/assets/testing-assets/red-ray.png";
                castColor = "#d83737";
            } else if (spellArtNum < 3) {
                spellArt.src = "/assets/testing-assets/purple-power.png";
                castColor = "#840db3";
            } else if (spellArtNum < 4) {
                spellArt.src = "/assets/testing-assets/green-glyph.png";
                castColor = "#10af25";
            } else {
                spellArt.src = "/assets/testing-assets/grape-shot.png";
                castColor = "#3c0561";
            }

            this.spells.push(
                new BoltSpell({
                    caster: this,
                    knockback: (spellArtNum > 4) ? 50 : undefined,
                    travelSpeed: (spellArtNum > 4) ? 2 : undefined,
                    castBarColor: castColor,
                    sprite: new Sprite({
                        image: spellArt,
                        width: 0.2,
                        height: 0.2
                    })
                })
            )
        }

        

        let castBarXOffset = -0.055;
        let castBarYOffset = -1 * CAST_BAR_Y_SPACING;
        
        for (let s = 0;  s < this.spells.length; s++){
            const spell = this.spells[s]
            castBarXOffset = -1 * castBarXOffset
            if (s % 2 == 0){
                if (s+1 == this.spells.length) { castBarXOffset = 0; }
                castBarYOffset -= CAST_BAR_Y_SPACING;
            }
            this.addChild(spell.castBar);
            const castBarOffset = {
                x: castBarXOffset,
                y: castBarYOffset
            }
            spell.castBar.offset = castBarOffset;
            
        }

        this.name = args.name;

        console.log(this.toString())

    }

    update(args: UpdateOptions){
        super.update(args)

        if (!this.dead){
            for (const spell of this.spells) { spell.update(args) }
        }
    }

    toString(){
        let out = this.name + "\n > Max HP = " + this.currentHP + "\n > speed: " + this.moveSpeed + "\n > spells:"
        for(const spell of this.spells)
            out += "\n   > " +spell.toString()
        return out
    }
}