import "./index"
import { GameObject } from "../gameObject";
import { moveTowardsPoint } from "./actions/moveTowardsPoint";
import { moveAwayFromPoint } from "./actions/moveTowardsPoint copy";
import { closeToPoint } from "./triggers/closeToPoint";
import { farFromPoint } from "./triggers/farFromPoint";

export interface EntityContext {
    owner: GameObject;
    blackboard: Map<string, any>;
    dt: number;
}

export interface Action {
    name: string;

    perform: ActionFunction;
}

export interface Trigger {
    name: string;

    evaluate: TriggerFunction;
}

type ActionFunction = (ctx: EntityContext, params: Record<string, any> | undefined) => void;

type TriggerFunction = (ctx: EntityContext, params: Record<string, any> | undefined) => boolean;

export class BehaviorRegistry {
    private static actions = new Map<string, ActionFunction>()
    private static triggers = new Map<string, TriggerFunction>()

    static initialize() {
        // Actions
        BehaviorRegistry.addAction(new moveTowardsPoint())
        BehaviorRegistry.addAction(new moveAwayFromPoint())

        // Actions
        BehaviorRegistry.addTrigger(new closeToPoint())
        BehaviorRegistry.addTrigger(new farFromPoint())
    }

    static addAction(a: Action) {
        BehaviorRegistry.actions.set(a.name, a.perform)
    }

    static getAction(name: string): ActionFunction {
        const func = BehaviorRegistry.actions.get(name);
        if (!func){
            console.warn(`Attempt to perform unknown action: ${name}`)
            return (ctx: EntityContext, params: Record<string, number> | undefined) => {}
        }

        return func;
    }

    static addTrigger(t: Trigger) {
        BehaviorRegistry.triggers.set(t.name, t.evaluate)
    }

    static getTrigger(name: string): TriggerFunction {
        const trig = BehaviorRegistry.triggers.get(name);
        if (!trig){
            throw new Error(`Error: Attempt to evaluate unknown trigger - ${name}`)
        }

        return trig;
    }
}