import { Body, BodyType, ForceMode } from "../../components/body";
import { Team } from "../../components/team";
import Vector from "../../types/vector";
import { Action, EntityContext } from "../behaviorRegistry";

export class approachTarget implements Action{
    public name = "approach_target"

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        const speed = ctx.blackboard.get("speed") ?? 0.01;
        ctx.blackboard.set("speed", speed)

        const body = ctx.owner.get(Body)
        if (!body || body.bodyType != BodyType.DYNAMIC) {
            throw new Error(`GameObjects without a DYNAMIC body cannot ${this.name}`)
        }

        const target = ctx.blackboard.get("current_target") as Team

        console.log(`My Team: ${ctx.owner.get(Team)?.teamId}`)
        console.log(`target: ${target}`)

        if (target){
            const directForce = new Vector({
                startPos: ctx.owner.position, 
                endPos: target.collider.tight.position, 
                magnitude: speed
            })

            const circleForce = new Vector({
                dx: directForce.dy,
                dy: -1 * directForce.dx,
                magnitude: speed * 0.25
            })

            directForce.add(circleForce)

            directForce.magnitude = speed * ctx.dt
    
            body.applyForce(directForce, ForceMode.IMPULSE)
        }

        
    }
}