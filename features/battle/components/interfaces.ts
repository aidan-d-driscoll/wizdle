export interface Updatable {
    update(dt:number):void;
}

export interface Renderable {
    renderHeight: number;

    render():void;
}