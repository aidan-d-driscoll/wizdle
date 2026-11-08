import { EffectContext } from "../skills/effect";
import { EffectRegistry } from "../skills/effectRegistry";
import { Updatable } from "./interfaces";
import { Module } from "./module";
import { generateSkill, getSkillById, Skill } from "@/lib/api_functions/skillsApi";

type SkillTimer = {
    skill: Skill,
    timer: number
}

export class SkillManager extends Module implements Updatable{
    skillTracker: SkillTimer[] = [];

    ctx!: EffectContext;

    constructor(skillIds: string[] = []){
        super()

        for (const id of skillIds){
            this.addSkill(id)
        }
    }

    onAttach(): void {
        this.ctx = {
            scene: this.owner.scene
        }

        this.registerUpdateable();
    }

    onDetach(): void {
        this.unregisterUpdateable();
    }

    update(dt: number){
        for (const tracker of this.skillTracker){
            tracker.timer += dt;
            if (tracker.timer > tracker.skill.cooldown){
                for (const e of tracker.skill.on_activate){
                    EffectRegistry.get(e.label).activate(this.ctx, e.params);
                    tracker.timer -= tracker.skill.cooldown;
                }
            }
        }
    }

    async addSkill(skillId: string): Promise<Skill> {
        const skill = await getSkillById(skillId)

        if (!skill){
            throw new Error(`Could not find skill where ID=${skillId}`)
        }

        // console.log(skill.on_activate)

        for (const e of skill.on_activate){
            const reqs = EffectRegistry.get(e.label).required_params
            const given_params = e.params
            if(reqs.length > 0 && !given_params){
                let rString = "["
                for(const r in reqs){
                    rString += `"${r}, "`
                }
                rString += "]"
                throw new Error(`${e.label} effect requires parameters ${rString}`)
            }
            if(given_params){
                for (const r of reqs){
                    if(!given_params[r]){
                        throw new Error(`${e.label} effect requires "${r}" parameter`)
                    }
                }
            }
        }

        this.skillTracker.push({
            skill: skill, 
            timer: 0
        })

        return skill
    }
}