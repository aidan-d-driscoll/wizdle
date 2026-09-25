import { CollisionBox } from "./collisionBox";
import { Rectangle, xBound } from "@/types/rectangle";

class xBound {
    constructor(
        public box: Rectangle,
        public isMin: boolean
    ){}

    get x(): number {
        return this.isMin ? this.box.xMin : this.box.xMax
    }
}

class CollisionManager{
    xBounds: xBound[] = [];
    fatBoxes: Rectangle[] = [];

    // On breach, sort
    sort(): void {
        // Start from the second element (index 1) as the first element is implicitly sorted
        for (let i = 1; i < this.xBounds.length; i++) {
            const current = this.xBounds[i];
            let j = i - 1;

            // Shift elements of the sorted section to the right 
            // if they are greater than the current element
            while (j >= 0 && this.xBounds[j].x > current.x) {
                this.xBounds[j + 1] = this.xBounds[j];
                j--;
            }

            // Insert the current element into its correct relative position
            this.xBounds[j + 1] = current;
        }
    }

    push(newBox: Rectangle){
        this.fatBoxes.push(newBox)

        this.xBounds.push(new xBound(newBox, true))
        this.xBounds.push(new xBound(newBox, false))
    }
}

export const collisions = new CollisionManager()


