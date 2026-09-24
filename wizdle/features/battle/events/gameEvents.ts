import Entity from "@/features/battle/entities/entity";
import { Wizard } from "@/features/battle/entities/wizard"
import Spell from "@/features/battle/spells/spell";

export type GameEvents = {
    collision: {
        entity1: Entity,
        entity2: Entity
    },
    castSpell: {
        spell: Spell,
        caster: Wizard
    }
}