import "./index"
import { GameObject } from "../gameObject";
import { chargePosition } from "./actions/chargePosition";
import { withinRangeOfPosition } from "./triggers/withinRangeOfPosition";
import { startTargetTimer } from "./actions/startTargetTimer";
import { findTarget } from "./actions/findTarget";
import { approachTarget } from "./actions/approachTarget";
import { constrainSpeed } from "./actions/constrainSpeed";
import { Module, ModuleType } from "../modules/module";

export interface EntityContext {
    owner: GameObject;
    blackboard: Map<string, any>;
    dt: number;
}

type ActionFunction = (ctx: EntityContext, params: Record<string, any> | undefined) => void;

type TriggerFunction = (ctx: EntityContext, params: Record<string, any> | undefined) => boolean;

abstract class Behavior{
    abstract name: string;
    static requires: ModuleType<Module>[] = [];
}

export interface Action extends Behavior {
    perform: ActionFunction;
}
    
export interface Trigger extends Behavior {
    evaluate: TriggerFunction;
}

export class BehaviorRegistry {
    private static actions = new Map<string, ActionFunction>()
    private static triggers = new Map<string, TriggerFunction>()

    static initialize() {
        // Actions
        BehaviorRegistry.addAction(new chargePosition())
        BehaviorRegistry.addAction(new startTargetTimer())
        BehaviorRegistry.addAction(new findTarget())
        BehaviorRegistry.addAction(new approachTarget())
        BehaviorRegistry.addAction(new constrainSpeed())

        // Trigger
        BehaviorRegistry.addTrigger(new withinRangeOfPosition())
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