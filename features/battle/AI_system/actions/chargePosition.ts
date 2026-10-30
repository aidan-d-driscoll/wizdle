import { Body, BodyType, ForceMode } from "../../modules/body";
import { MovementControl } from "../../modules/movementControl";
import Vector from "../../types/vector";
import { Action } from "../behavior";
import { EntityContext } from "../behaviorRegistry";

export class chargePosition extends Action{
    public name = "charge_position"
    requires = [MovementControl]

    perform(ctx: EntityContext, params: Record<string, any> | undefined): void{
        if (!params) {
            throw new Error(`${this.name} missing required parameters`)
        }

        const movement = ctx.blackboard.get("MovementControl")

        const movementDir = new Vector({startPos: ctx.owner.position, endPos: {x: params["positionX"], y: params["positionY"]}})

        console.log(`movementDir: ${movementDir}`)

        movement.moveInDirection(movementDir)
    }
}