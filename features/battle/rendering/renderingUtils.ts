import { Position } from "@/features/battle/types/position";
import { getRandomFloat } from "../utilities/mathUtils";

export function toScreenPosition(position: Position, canvas: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return {
        x: (position.x + 1) / 2 * canvas.width,
        y: (1 - (position.y + 1) / 2) * canvas.height
    };
}

export function toScreenValue(value: number, canvas: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return value * (canvas.width / 2);
}

export type HexColor = `#${string}`

export function getRandomWizardArt(): HTMLImageElement {
    const wizardArt = new Image();
    const artNum = getRandomFloat(0, 4)
    
    if (artNum < 1){
        wizardArt.src = "/assets/testing-assets/blood-sorcerer.png"
    } else if (artNum < 2){
        wizardArt.src = "/assets/testing-assets/grass-druid.png"
    } else if (artNum < 3){
        wizardArt.src = "/assets/testing-assets/rain-mage.png"
    } else{
        wizardArt.src = "/assets/testing-assets/grape-omancer.png"
    }

    return wizardArt
}