import { Aura } from "../entities/aura";
import Entity from "../entities/entity";
import { Projectile } from "../entities/projectile";
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