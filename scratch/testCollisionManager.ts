import CollisionManager from "../features/battle/collisions/collisionManager"
import { CollisionBody } from "../features/battle/collisions/collisionBody"
import { Rectangle } from "@/types/shapes/rectangle";

import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

async function main() {
    
    
    const boxA = new CollisionBody({tight: new Rectangle({
        startingPosition: {x:1, y:1}, 
        width: 1, 
        height: 1
    })})
    const boxB = new CollisionBody({tight: new Rectangle({
        startingPosition: {x:3, y:3}, 
        width: 1, 
        height: 1
    })})
    const boxC = new CollisionBody({tight: new Rectangle({
        startingPosition: {x:3, y:1}, 
        width: 1, 
        height: 1
    })})

    console.log(boxA)
    console.log(boxB)
    console.log(boxC)

    const cm = new CollisionManager();

    cm.add(boxA)
    cm.add(boxB)
    cm.add(boxC)

    const updaters = [boxA, boxB, boxC, cm]

    let answer = ""

    while(answer !== "q"){

        const rl = readline.createInterface({ input, output });

        try {
            answer = await rl.question('\n<Press enter to continue or "q" to exit>');
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            rl.close();
        }

        boxA.tight.position = {x: boxA.tight.position.x+0.04, y:boxA.tight.position.y}
        boxC.tight.position = {x: boxC.tight.position.x-0.04, y:boxC.tight.position.y}

        for (const u of updaters){
            u.update()
        }
    }
}

main()