import { getSkillById, insertSkill } from "@/lib/api_functions/skillsApi";
import { PackedRecord, Schema } from "./packedSchema";

// Run with: npx tsx .\scratch\spell_id\test.ts

const SpellSchema: Schema = {
    bytes: 16,
    fields: {
        spell_type: { bits: 8 },
        cooldown: { bits: 8, min: 0.3, max: 2, step: 0.01 },
        damage: { bits: 5, min: 20, max: 100, step: 5 },
        pixels: { bits: 22 }
    }
}

async function addSkill(){
    const spell = new PackedRecord(SpellSchema, { spell_type: 3,  cooldown: 1.556, damage: 95, pixels: 40000 });

    const spellID = spell.pack();
    for(const byte of spellID){
        console.log(byte.toString(2))
    }
    await insertSkill(spellID);

    const retreivedSpell = await getSkillById(spellID)
    console.log(retreivedSpell)
    if (retreivedSpell){
        const unpackedSpell = PackedRecord.unPack(SpellSchema, retreivedSpell._id)
        console.log(unpackedSpell.values)
    }
}

addSkill()