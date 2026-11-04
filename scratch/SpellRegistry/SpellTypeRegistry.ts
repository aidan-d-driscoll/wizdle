import { Beam, Missile, Spell } from "./spells";
import { SpellConstructor, SpellData } from "./types";

export class SpellTypeRegistry{
    static readonly spellTypes = new Map<number, SpellConstructor>([
        [0, Beam],
        [1, Missile]
    ]);
    static readonly spellCodes: Map<SpellConstructor, number>;

    static {
        SpellTypeRegistry.spellTypes.forEach((ctor, idx) => {
            SpellTypeRegistry.spellCodes.set(ctor, idx);
        });
    }

    static getSpellByCode(code: number): SpellConstructor{
        const spellType = SpellTypeRegistry.spellTypes.get(code)
        if(spellType === undefined){
            throw new ReferenceError(`${code} is not associated with a SpellType`)
        }

        return spellType;
    }

    static getCodeOfSpell(spell: Spell<SpellData>): number{
        const code = SpellTypeRegistry.spellCodes.get(spell.constructor as SpellConstructor)
        if(code === undefined){
            throw new ReferenceError(`${spell.constructor.name} is not associated with a SpellType`)
        }

        return code;
    }
}