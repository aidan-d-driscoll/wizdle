import { deserializeRawID, postJson, serializeRawID } from "./utils";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.API_BASE_URL ?? "http://localhost:3000"
    : "";

interface SkillEffect {
    label: string,
    params?: Record<string, number | string>
}

export type Skill = {
    _id: Uint8Array
    createdAt: Date
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

export async function getSkillById(id: Uint8Array): Promise<Skill | null> {
    const res = await fetch(`${BASE_URL}/api/skills/${serializeRawID(id)}`);
  
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  
    const out = await res.json();
    out._id = deserializeRawID(out._id);

    return out;
}

export async function insertSkill(id: Uint8Array) {
    const data = {
        id: serializeRawID(id)
    }

    return await postJson("/api/skills", data)
}

