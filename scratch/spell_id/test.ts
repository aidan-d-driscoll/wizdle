import { getSkillById, insertSkill } from "@/lib/api_functions/skillsApi";
import { Skill } from "./packables";

// Run with: npx tsx .\scratch\spell_id\test.ts

async function addSkill(){
    let skill = new Skill({ spell_type: 0, cooldown: 1.14, damage: 95, damage_type: 3 });
    console.log(skill)
    console.log(skill.toDoc())
    
    await insertSkill(skill.toDoc());

    const retreivedSkill = await getSkillById(skill.toDoc()._id)
    if (retreivedSkill){
        retreivedSkill.activate()
        console.log(retreivedSkill.doc)
    }
}

addSkill()