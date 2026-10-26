import { getDistance } from "../../utilities/mathUtils";
import { EntityContext, Trigger } from "../behaviorRegistry";

export class withinRangeOfPosition implements Trigger{
    public name = "within_range_of_position"

    evaluate(ctx: EntityContext, params: Record<string, any> | undefined): boolean {
        if (!params) {
            throw new Error(`${this.name} missing required parameters`);
        }

        console.log(`Distance from center ${getDistance({from: ctx.owner.position, to: {x: params["positionX"], y: params["positionY"]}})}`)

        return (getDistance({from: ctx.owner.position, to: {x: params["positionX"], y: params["positionY"]}}) < params["range"]);
    }
}