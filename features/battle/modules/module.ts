import { Renderable, Updatable } from "./interfaces";
import { GameObject } from "../gameObject";
import { insertionSort, insertionSorted } from "../utilities/sortUtils";

export type ModuleType<T extends Module = Module> = (abstract new (...args: any[]) => T) & {
    requires: ModuleType[];
    max: number;
};

export abstract class Module{
    owner!: GameObject;

    static max: number = Infinity;

    static requires: ModuleType<Module>[] = [];

    onAttach(): void {}
    
    onDetach(): void{}

    protected registerUpdateable(this: Module & Updatable) {
        this.owner.scene.updatables.add(this);
    }
    protected unregisterUpdateable(this: Module & Updatable){
        this.owner.scene.updatables.delete(this)
    }

    protected registerRenderable(this: Module & Renderable) {
        const layer = this.owner.layer;
        this.owner.scene.renderables[layer].push(this);
    }
    protected unregisterRenderable(this: Module & Renderable){
        const layer = this.owner.layer;
        const idx = this.owner.scene.renderables[layer].indexOf(this);
        if (idx >= 0) this.owner.scene.renderables[layer].splice(idx, 1);
    }
}