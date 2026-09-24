import { Aura } from "@/features/battle/entities/spellEffects/aura";
import Entity from "@/features/battle/entities/entity";
import { Projectile } from "@/features/battle/entities/spellEffects/projectile";
import { spellOptions } from "@/types/options";

export default abstract class Spell{
    image: HTMLImageElement;
    knockback: number;
    castTime: number;

    dead = false;

    constructor({image, knockback, castTime}:spellOptions){
        this.image = image;
        this.knockback = knockback;
        this.castTime = castTime;
    }

    abstract newCast(source: Entity): Projectile | Aura | null;
}