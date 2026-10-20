export interface Updateable {
    update(dt:number):void;
}

export interface Renderable {
    renderHeight: number;

    render():void;
}