import { GameObject } from "../gameObject";

export interface Updatable {
    update(dt:number):void;
}

export interface Renderable {
    owner: GameObject;
    renderHeight: number;

    render():void;
}