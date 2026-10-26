import { Body } from "../../components/body";
import { Action, EntityContext } from "../behaviorRegistry";

export class constrainSpeed implements Action {
    name = "constrain_speed"

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        const body = ctx.owner.get(Body)
        const speed = ctx.blackboard.get("speed") as number

        if(body && body.velocity.magnitude > speed) body.velocity.magnitude = speed;
    }
}