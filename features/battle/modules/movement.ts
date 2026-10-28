import { Body } from "./body";
import { Module } from "./module";
import { Updatable } from "./interfaces";

class Movement extends Module implements Updatable{
    static max: number = 1;
    static requires = [Body];
    
    body!: Body;

    speed: number;

    constructor(speed: number){
        super()

        this.speed = speed
    }

    onAttach(): void {
        super.onAttach()

        const body = this.owner.get(Body)
        if (body) this.body = body

        this.registerUpdateable()
    }

    onDetach(): void {
        super.onDetach()

        this.unregisterUpdateable()
    }

    update(dt: number): void {
        
    }
}