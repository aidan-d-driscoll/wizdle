import { setOptionalRandomNumber } from "@/utilities/mathUtils";
import { Aura } from "../entities/aura";
import Entity from "../entities/entity";
import { Projectile } from "../entities/projectile";
import { spellOptions } from "@/types/options";

const CAST_TIME_INFLUENCE = 0.6

const MIN_KNOCKBACK = 0.15;
const MAX_KNOCKBACK = MIN_KNOCKBACK*20;

const MIN_CAST_TIME = 0.05;
const MAX_CAST_TIME = MIN_CAST_TIME*40;

const MIN_DAMAGE = 10;
const MAX_DAMAGE = MIN_DAMAGE*5;

export default abstract class Spell{
    image: HTMLImageElement;
    knockback: number;
    castTime: number;
    spellQuality: number;
    damage: number;

    dead = false;

    constructor(args:spellOptions){
        this.image = args.image;

        this.castTime = setOptionalRandomNumber({value: args.castTime, min: MIN_CAST_TIME, max: MAX_CAST_TIME})

        // scales other values based on cast time. Higher cast time = more powerful
        this.spellQuality = Math.pow((this.castTime / MIN_CAST_TIME), CAST_TIME_INFLUENCE);

        this.knockback = setOptionalRandomNumber({value: args.knockback, min: MIN_KNOCKBACK, max: MAX_KNOCKBACK})

        this.damage = setOptionalRandomNumber({value: args.damage, min: MIN_DAMAGE, max: MAX_DAMAGE})
    }

    abstract newCast(source: Entity): Projectile | Aura | null;
}