import { Scene } from "../scene";

export type EffectContext = {
    scene: Scene;
}

export abstract class Effect{
    abstract name: string;
    required_params: string[] = []
    abstract activate(ctx: EffectContext, params: Record<string, number | string> | undefined): void;
}