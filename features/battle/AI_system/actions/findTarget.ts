import { Team } from "../../modules/team";
import { getRawDistance } from "../../utilities/mathUtils";
import { Action } from "../behavior";
import { EntityContext } from "../behaviorRegistry";

export class findTarget extends Action{
    name = "find_target";

    perform(ctx: EntityContext, params: Record<string, any> | undefined){
        const scene = ctx.owner.scene
        const team = ctx.owner.get(Team)

        if (!team) {
            throw new Error(`GameObject without Team module cannot perform ${this.name}`)
        }
        
        let target_timer = ctx.blackboard.get("target_timer") as number
        target_timer += ctx.dt;
        
        console.log(`target Timer: ${target_timer}`)

        if(target_timer >= 0.05){
            console.log("Target timer triggered")

            // reset target timer
            target_timer -= 0.5;

            // find a new target
            if (scene.targetables.length > 0){
                let newTarget: Team;
                let bestDistance = Infinity;
                for (const t of scene.targetables){
                    if (t.teamId !== team.teamId){
                        const distance = getRawDistance({from: team.collider.tight.position, to: t.collider.tight.position})
                        if(distance < bestDistance){
                            bestDistance = distance;
                            newTarget = t;
                            ctx.blackboard.set("current_target", t)
                            console.log(`newTarget: ${newTarget}`)
                        }
                    }
                }
            }
        }

        ctx.blackboard.set("target_timer", target_timer)
    }
}