import { Module, ModuleType } from "../modules/module";
import { EntityContext } from "./behaviorRegistry";

abstract class Behavior{
    abstract name: string;
    requires: ModuleType<Module>[] = [];
}

export abstract class Action extends Behavior {
    abstract perform(ctx: EntityContext, params: Record<string, any> | undefined): void;
}
    
export abstract class Trigger extends Behavior {
    abstract evaluate(ctx: EntityContext, params: Record<string, any> | undefined): boolean;
}