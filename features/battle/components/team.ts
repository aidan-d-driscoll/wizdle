import { Body } from "./body";
import { Collider } from "./collider";
import { Component, ComponentType } from "./component";

export class Team extends Component{
    static max = 1;
    static requires = [Body, Collider]

    body!: Body;
    collider!: Collider;

    teamId: number;

    constructor(teamId: number){
        super()

        this.teamId = teamId;
    }

    onAttach(): void {
        super.onAttach();

        const body = this.owner.get(Body)
        if (body) this.body = body

        const collider = this.owner.get(Collider)
        if (collider) this.collider = collider

        this.owner.scene.targetables.push(this)
    }
}