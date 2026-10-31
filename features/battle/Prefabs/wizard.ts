import { GameObject } from "../gameObject";
import { Body, BodyType } from "../modules/body";
import { Brain } from "../modules/brain";
import { Collider } from "../modules/collider";
import { MovementControl } from "../modules/movementControl";
import { Sprite } from "../modules/sprite";
import { Team } from "../modules/team";
import { Scene } from "../scene";
import { Ellipse } from "../shapes/ellipse";
import { Position } from "../types/position";

export function wizard(args:{
    scene: Scene,
    team: number,
    position: Position
}): GameObject{
    const wizardArt = new Image();
        
    const artNum = Math.random() * 4

    if (artNum >= 3) wizardArt.src = "/assets/testing-assets/grape-omancer.png";
    else if (artNum >= 2) wizardArt.src = "/assets/testing-assets/blood-sorcerer.png";
    else if (artNum >= 1) wizardArt.src = "/assets/testing-assets/rain-mage.png";
    else wizardArt.src = "/assets/testing-assets/grass-druid.png";

    const wizard = new GameObject({
        scene: args.scene,
        position: args.position
    })

    wizard.add(new Sprite({
        offset: {x: -0.01, y: 0.09},
        image: wizardArt,
        width: 0.2,
        height: 0.2,
        renderHeight: 1
    }))

    wizard.add(new Body({
        bodyType: BodyType.DYNAMIC,
        bounce: 0.6,
        mass: 1.5,
        physicsCollider: new Collider({
            offset: {x: 0, y: 0},
            shape: new Ellipse({
                position: wizard.position,
                radiusX: 0.09,
                radiusY: 0.09
            })
        })
    }))

    wizard.add(new MovementControl(1.5))

    wizard.add(new Team(args.team))

    wizard.add(new Brain("combatant"))
    
    return wizard
}