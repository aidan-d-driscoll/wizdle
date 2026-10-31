import { getDistance } from "../../utilities/mathUtils";
import { Trigger } from "../behavior";
import { EntityContext} from "../behaviorRegistry";

export class withinRangeOfPosition extends Trigger{
    public name = "within_range_of_position"

    evaluate(ctx: EntityContext, params: Record<string, any> | undefined): boolean {
        if (!params) {
            throw new Error(`${this.name} missing required parameters`);
        }

        return (getDistance({from: ctx.owner.position, to: {x: params["positionX"], y: params["positionY"]}}) < params["range"]);
    }
}