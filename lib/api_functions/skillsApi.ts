import { ObjectId } from "mongodb";
import { postJson } from "./utils";

interface SkillEffect {
    label: string,
    params?: Record<string, number | string>
}

export type Skill = {
    _id: string
    cooldown: number
    on_activate: [SkillEffect]
}

export async function getSkills() {
    return await (await(fetch("/api/skills"))).json()
}

export async function generateSkill(): Promise<Skill> {
    return await postJson("/api/skills", {
        cooldown: 0.5,
        on_activate:[
            { 
                label: "create_projectile",
                params: {
                    size: 0.1,
                    speed: 0.1
                }
            }
        ]
    })
}

export async function getSkillById(id: string): Promise<Skill | null> {
    const res = await fetch(`/api/skills/${encodeURIComponent(id)}`);
  
    if (res.status === 404) return null; // not found is a normal outcome, not an error
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  
    return res.json();
  }