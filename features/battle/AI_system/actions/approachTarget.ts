import { Body, BodyType, ForceMode } from "../../modules/body";
import { Movement } from "../../modules/movement";
import { Team } from "../../modules/team";
import Vector from "../../types/vector";
import { Action } from "../behavior";
import { EntityContext } from "../behaviorRegistry";


export class approachTarget implements Action{
    public name = "approach_target"
    requires = [Movement]

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        const movement = ctx.blackboard.get("Movement")

        const target = ctx.blackboard.get("current_target") as Team

        console.log(`My Team: ${ctx.owner.get(Team)?.teamId}`)
        console.log(`target: ${target}`)

        if (target){
            const movementDir = new Vector({
                startPos: ctx.owner.position, 
                endPos: target.collider.tight.position,
                magnitude: 1
            })

            const circleDir = new Vector({
                dx: movementDir.dy,
                dy: -1 * movementDir.dx,
                magnitude: 0.15
            })

            movementDir.add(circleDir)

            console.log(`movementDir: ${movementDir}`)
    
            movement.moveInDirection(movementDir)
        }
    }
}