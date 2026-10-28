import { GameObject } from "../gameObject";
import { chargePosition } from "./actions/chargePosition";
import { withinRangeOfPosition } from "./triggers/withinRangeOfPosition";
import { startTargetTimer } from "./actions/startTargetTimer";
import { findTarget } from "./actions/findTarget";
import { approachTarget } from "./actions/approachTarget";
import { Action, Trigger } from "./behavior";

export interface EntityContext {
    owner: GameObject;
    blackboard: Map<string, any>;
    dt: number;
}

export class BehaviorRegistry {
    private static actions = new Map<string, Action>()
    private static triggers = new Map<string, Trigger>()

    static initialize() {
        // Actions
        BehaviorRegistry.addAction(new chargePosition())
        BehaviorRegistry.addAction(new startTargetTimer())
        BehaviorRegistry.addAction(new findTarget())
        BehaviorRegistry.addAction(new approachTarget())

        // Trigger
        BehaviorRegistry.addTrigger(new withinRangeOfPosition())
    }

    static addAction(a: Action) {
        BehaviorRegistry.actions.set(a.name, a)
    }

    static getAction(name: string): Action {
        const a = BehaviorRegistry.actions.get(name);
        if (!a){
            throw new Error(`Action ${name} does not exist`)
        }

        return a;
    }

    static addTrigger(t: Trigger) {
        BehaviorRegistry.triggers.set(t.name, t)
    }

    static getTrigger(name: string): Trigger {
        const trig = BehaviorRegistry.triggers.get(name);
        if (!trig){
            throw new Error(`Trigger ${name} does not exist`)
        }

        return trig;
    }
}