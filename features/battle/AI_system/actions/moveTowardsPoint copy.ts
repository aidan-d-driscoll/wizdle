import { Body, BodyType, ForceMode } from "../../components/body";
import Vector from "../../types/vector";
import { Action, EntityContext } from "../behaviorRegistry";

export class moveAwayFromPoint implements Action{
    public name = "move_away_from_point"

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        if (!params) {
            throw new Error(`${this.name} missing required parameters`)
        }

        const speed = ctx.blackboard.get("speed") ?? 0.01;
        ctx.blackboard.set("speed", speed)

        const body = ctx.owner.get(Body)
        if (!body || body.bodyType != BodyType.DYNAMIC) {
            throw new Error(`GameObjects without a DYNAMIC body cannot ${this.name}`)
        }

        body.applyForce(new Vector({startPos: {x: params["targetX"], y: params["targetY"]}, endPos: ctx.owner.position, magnitude: ctx.blackboard.get("speed")}))
    }
}