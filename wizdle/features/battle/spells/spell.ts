import { getRandomFloat, setOptionalRandomNumber } from "@/utilities/mathUtils";
import { Aura } from "../entities/aura";
import Entity from "../entities/entity";
import { Projectile } from "../entities/projectile";
import { spellOptions } from "@/types/options";

const MIN_KNOCKBACK = 0.2;
const MAX_KNOCKBACK = 2;

const MIN_CAST_TIME = 0.25;
const MAX_CAST_TIME = 10;

const MIN_DAMAGE = 1;
const MAX_DAMAGE = 10;

export default abstract class Spell{
    image: HTMLImageElement;
    knockback: number;
    castTime: number;
    damage: number;

    dead = false;

    constructor(args:spellOptions){
        this.image = args.image;

        this.castTime = setOptionalRandomNumber({value: args.castTime, min: MIN_CAST_TIME, max: MAX_CAST_TIME})

        this.knockback = setOptionalRandomNumber({value: args.knockback, min: MIN_KNOCKBACK, max: MAX_KNOCKBACK})

        this.damage = setOptionalRandomNumber({value: args.damage, min: MIN_DAMAGE, max: MAX_DAMAGE})
    }

    abstract newCast(source: Entity): Projectile | Aura | null;
}