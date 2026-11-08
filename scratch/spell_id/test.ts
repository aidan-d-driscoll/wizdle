import { getSkillById, insertSkill } from "@/lib/api_functions/skillsApi";
import { Skill } from "./packables";

// Run with: npx tsx .\scratch\spell_id\test.ts

async function addSkill(){
    let skill = new Skill({ spell_type: 0, cooldown: 1.28, damage: 100, damage_type: 1 });
    
    const skillID = await insertSkill(skill.pack());

    const retreivedSkill = await getSkillById(skillID)
    if (retreivedSkill){
        const unpackedSkill = Skill.fromBytes(retreivedSkill._id)
        unpackedSkill.activate()
    }
}

addSkill()