import { Effect } from "./effect";
import { createProjectile } from "./effects/createProjectile";

export class EffectRegistry {
    private static effects = new Map<string, Effect>()

    static initialize() {
        EffectRegistry.add(new createProjectile())
    }

    static add(e: Effect) {
        EffectRegistry.effects.set(e.name, e)
    }

    static get(name: string): Effect {
        const a = EffectRegistry.effects.get(name);
        if (!a){
            throw new Error(`${name} effect does not exist`)
        }

        return a;
    }    
}