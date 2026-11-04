import { Effect, EffectContext } from "../effect";

export class createProjectile extends Effect{
    name = "create_projectile";

    activate(ctx: EffectContext, params: Record<string, number | string> | undefined){
        console.log("Creating projectile!")
    }
}