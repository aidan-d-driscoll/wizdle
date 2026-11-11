import { Skill, SkillDoc } from "@/scratch/spell_id/packables";
import { deserializeRawID, postJson, serializeRawID } from "./utils";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.API_BASE_URL ?? "http://localhost:3000"
    : "";

export async function getSkills() {
    return await (await(fetch("/api/skills"))).json()
}

export async function getSkillById(id: string): Promise<Skill | null> {
    const res = await fetch(`${BASE_URL}/api/skills/${id}`);
  
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  
    const out = await res.json();

    return Skill.fromDoc(out);
}

export async function insertSkill(doc: SkillDoc): Promise<SkillDoc> {
    return await postJson("/api/skills", doc);
}

