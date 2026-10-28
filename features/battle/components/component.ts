import { Renderable, Updatable } from "./interfaces";
import { GameObject } from "../gameObject";
import { insertionSorted } from "../utilities/sortUtils";
import { Body } from "./body";
import { ComponentRequirementError } from "../errors";

export type ComponentType<T extends Component = Component> = (abstract new (...args: any[]) => T) & {
    requires: ComponentType[];
    max: number;
};

export abstract class Component{
    owner!: GameObject;

    static max: number = Infinity;

    static requires: ComponentType<Component>[] = [];

    onAttach(): void {
        const comp = this.constructor as ComponentType
        for (const c of comp.requires){
            if (!this.owner.get(c)) {
                throw new ComponentRequirementError(`${comp.name} added to GameObject without required component ${c.name}`)
            }
        }
    }
    
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