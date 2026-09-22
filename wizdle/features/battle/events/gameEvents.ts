import Entity from "../entities/entity";
import { Wizard } from "../entities/wizard"
import Spell from "../spells/spell";

export type GameEvents = {
    collision: {
        entity1: Entity,
        entity2: Entity
    },
    castSpell: {
        spell: Spell,
        caster: Wizard
    },
    dealDamage: {
        damage: number,
        target: Wizard
    }
}