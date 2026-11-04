import { Spell } from "./spells";

export type SpellConstructor = new (...args:any[]) => Spell<SpellData>;

export interface SpellData {
    spellCode: number;
    cooldown: number;
    damage: number;
}

export interface BeamData extends SpellData {
    width: number;
}

export interface MissileData extends SpellData {
    speed: number
}