import { Component, ComponentType } from "./component";
import { Updatable } from "./interfaces";
import { AIConfig, loadAIConfig } from "../utilities/fileUtils";
import { Body } from "./body";
import { BehaviorRegistry } from "../AI_system/behaviorRegistry";

export class Brain extends Component implements Updatable{
    static requires = [Body];
    static max = 1;

    configName: string;
    public currentState: string = "";
    public blackboard = new Map<string, any>;
    public timeInCurrentState = 0.0;
    
    private configData: AIConfig | undefined;

    constructor(configName: string){
        super()

        this.configName = configName;
    }

    async onAttach(): Promise<void> {
        super.onAttach()

        this.configData = await loadAIConfig(this.configName)
        if (!this.configData){
            throw new Error(`Failed to load AI config: ${this.configName}`);
        }
        console.log(this.configData)

        this.currentState = this.configData.initial_state;

        this.registerUpdateable()
    }

    onDetach(): void {
        super.onDetach()
        this.unregisterUpdateable()
    }

    update(dt: number){
        this.timeInCurrentState += dt;
        this.blackboard.set("timeInCurrentState", this.timeInCurrentState)

        const currentState = this.configData?.states[this.currentState]
        if (!currentState) return;

        const ctx = {owner: this.owner, blackboard: this.blackboard, dt: dt}

        if (currentState.on_update){
            for(const a of currentState.on_update) {
                console.log(`Performing action ${a.action}`)
                BehaviorRegistry.getAction(a.action)(ctx, a.params)
            }
        }
    }
}