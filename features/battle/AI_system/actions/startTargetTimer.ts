import { Action } from "../behavior";
import { EntityContext } from "../behaviorRegistry";

export class startTargetTimer extends Action{
    name = "start_target_timer"

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        ctx.blackboard.set("target_timer", 0)
    }
}