import { Renderable, Updatable } from "./interfaces";
import { GameObject } from "../gameObject";
import { insertionSorted } from "../utilities/sortUtils";

export abstract class Component{
    owner!: GameObject;

    onAttach(): void{} 
    onDetach(): void{}

    protected registerUpdateable(this: Component & Updatable) {
        this.owner.scene.updatables.add(this);
    }
    protected unregisterUpdateable(this: Component & Updatable){
        this.owner.scene.updatables.delete(this)
    }

    protected registerRenderable(this: Component & Renderable) {
        const layer = this.owner.layer;
        this.owner.scene.renderables[layer].push(this);
        this.owner.scene.renderables[layer] = insertionSorted(this.owner.scene.renderables[layer], (a) => { return a.renderHeight });
    }
    protected unregisterRenderable(this: Component & Renderable){
        const layer = this.owner.layer;
        const idx = this.owner.scene.renderables[layer].indexOf(this);
        if (idx >= 0) this.owner.scene.renderables[layer].splice(idx, 1);
    }
}