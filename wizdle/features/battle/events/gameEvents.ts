import { Wizard } from "@/features/battle/entities/wizard"
import Spell from "@/features/battle/spells/spell";
import { CollisionBody } from "../collisions/collisionBody";

export type GameEvents = {
    castSpell: {
        spell: Spell,
        caster: Wizard
    },
    takeDamage: {
        damage: number,
        target: Wizard
    },
    breachEvent: {
        box: CollisionBody
    },
    collisionEnter: {
        box1: CollisionBody,
        box2: CollisionBody
    },
    collisionStay: {
        box1: CollisionBody,
        box2: CollisionBody
    },
    collisionLeave: {
        box1: CollisionBody,
        box2: CollisionBody
    }
}