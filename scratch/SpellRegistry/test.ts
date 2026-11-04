import { SpellTypeRegistry } from "./SpellTypeRegistry";

const retrievedSpell1 = {
    spellCode: 1,
    cooldown: 100,
    damage: 50,
    speed: 20
}

const retrievedSpell2 = {
    spellCode: 0,
    cooldown: 60,
    damage: 40,
    width: 10
}

const spell1 = new (SpellTypeRegistry.getSpellByCode(retrievedSpell1.spellCode))(retrievedSpell1)
const spell2 = new (SpellTypeRegistry.getSpellByCode(retrievedSpell2.spellCode))(retrievedSpell2)

spell1.cast()
console.log(spell1.data.cooldown)

spell2.cast()
console.log(spell2.data.cooldown)