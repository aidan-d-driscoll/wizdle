import { getDistance } from "../../utilities/mathUtils";
import { EntityContext, Trigger } from "../behaviorRegistry";

export class farFromPoint implements Trigger{
    public name = "far_from_point"

    evaluate(ctx: EntityContext, params: Record<string, any> | undefined) {
        if (!params) {
            throw new Error(`${this.name} missing required parameters`)
        }

        return getDistance({from: ctx.owner.position, to: {x: params["pointX"], y: params["pointY"]}}) > params["distance"]
    }
}