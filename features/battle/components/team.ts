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

        this.body = this.owner.getRequired(Body);

        this.collider = this.owner.getRequired(Collider);

        this.owner.scene.targetables.push(this);
    }

    onDetach(): void {
        const idx = this.owner.scene.targetables.indexOf(this)
        if(idx !== -1) this.owner.scene.targetables.splice(idx, 1)
    }
}