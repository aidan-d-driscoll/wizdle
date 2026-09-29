import Entity from "@/features/battle/entities/entity";
import { Wizard } from "@/features/battle/entities/wizard"
import Spell from "@/features/battle/spells/spell";
import { CollisionBox } from "../collisions/collisionBox";

export type GameEvents = {
    collision: {
        entity1: Entity,
        entity2: Entity
    },
    castSpell: {
        spell: Spell,
        caster: Wizard
    },
    takeDamage: {
        damage: number,
        target: Wizard
    },
    breachEvent: {
        box: CollisionBox
    },
    boxCollision: {
        box1: CollisionBox,
        box2: CollisionBox
    }
}