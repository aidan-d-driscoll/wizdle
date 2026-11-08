import { definePackable } from "./packableFactory";
import { Schema } from "./types";

const SPELL_TYPE = ["Bolt", "Beam"]
const DAMAGE_TYPE = ["Piercing", "Bludgeoning", "Slashing", "Fire"]

const skillSchema: Schema = {
    bytes: 16,
    fields: {
        spell_type: { bits: 1 },
        cooldown: { bits: 8, min: 0.3, max: 2, step: 0.01 },
        damage: { bits: 5, min: 20, max: 100, step: 5 },
        damage_type: { bits: 2 }
    }
}

export class Skill extends definePackable(skillSchema){
    activate(){
        console.log(SPELL_TYPE[this.values.spell_type] + " spell deals " + this.values.damage + " " + DAMAGE_TYPE[this.values.damage_type] + " damage!\n > On cooldown for " + this.values.cooldown + " seconds")
    }
}