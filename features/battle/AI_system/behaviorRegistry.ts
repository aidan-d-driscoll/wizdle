import "./index"
import { GameObject } from "../gameObject";
import { moveTowardsPoint } from "./actions/moveTowardsPoint";

export interface EntityContext {
    owner: GameObject;
    blackboard: Map<string, any>;
    dt: number;
}

export interface Action {
    name: string;

    perform: ActionFunction;
}

type ActionFunction =  (ctx: EntityContext, params: Record<string, any> | undefined) => void;

export class BehaviorRegistry {
    private static actions = new Map<string, ActionFunction>()

    static initialize() {
        BehaviorRegistry.addAction(new moveTowardsPoint())
    }

    static addAction(a: Action){
        console.info(`Adding new action ${a.name}`)
        BehaviorRegistry.actions.set(a.name, a.perform)
    }

    static getAction(name: string): ActionFunction{
        console.info(`Finding action ${name}`)
        const func = BehaviorRegistry.actions.get(name);
        if (!func){
            console.warn(`Attempt to perform unknown action: ${name}`)
            return (ctx: EntityContext, params: Record<string, number> | undefined) => {}
        }

        return func;
    }
}