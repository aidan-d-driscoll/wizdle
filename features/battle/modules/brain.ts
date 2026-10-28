import { Module, ModuleType } from "./module";
import { Updatable } from "./interfaces";
import { BehaviorRegistry} from "../AI_system/behaviorRegistry";
import { loadAIConfig } from "../utilities/fileUtils";
import { EntityContext } from "../AI_system/behaviorRegistry";

interface AIAction {
    action: string,
    params?: Record<string, any>
}

interface AITransition {
    trigger: string,
    target_state: string,
    actions?: [AIAction]
    params?: Record<string, any>
}

interface AIState {
    on_enter?: [AIAction]
    on_update?: [AIAction]
    on_exit?: [AIAction]
    transitions?: [AITransition]
}

export interface AIConfig {
    ai_name: string;
    initial_state: string;
    states: Record<string, AIState>
}

export class Brain extends Module implements Updatable{
    static requires = [];
    static max = 1;

    private ctx!: EntityContext

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
        
        for (const [key, state] of Object.entries(this.configData.states)){
            this.getActionRequirements(state.on_enter)
            this.getActionRequirements(state.on_update)
            this.getActionRequirements(state.on_update)
            
        }

        this.currentState = this.configData.initial_state;

        this.ctx = {owner: this.owner, blackboard: this.blackboard, dt: 0}

        this.executeActionList(this.configData?.states[this.currentState].on_enter)

        this.registerUpdateable()
    }

    onDetach(): void {
        super.onDetach()
        this.unregisterUpdateable()
    }

    update(dt: number){
        this.timeInCurrentState += dt;
        this.blackboard.set("timeInCurrentState", this.timeInCurrentState)

        console.log("-----------------------------------------------------------")
        console.log(`current state: ${this.currentState}`)

        let currentState = this.configData?.states[this.currentState]
        if (!currentState) return;

        this.ctx = {owner: this.owner, blackboard: this.blackboard, dt: dt}

        if (currentState.on_update){
            this.executeActionList(currentState.on_update)
        }

        let triggerOutput: boolean;
        
        if (currentState.transitions){
            for(const t of currentState.transitions) {
                triggerOutput = BehaviorRegistry.getTrigger(t.trigger).evaluate(this.ctx, t.params);
                
                if(t.params && t.params["invert_output"] === 1) {
                    console.log("inversion")
                    triggerOutput = !triggerOutput;
                }

                if (triggerOutput){
                    this.executeActionList(currentState?.on_exit);
                    this.currentState = t.target_state;
                    currentState = this.configData?.states[this.currentState];
                    this.executeActionList(currentState?.on_enter);
                }
            }
        }
    }

    private executeActionList(list: [AIAction] | undefined){
        if (!list) return;

        for(const a of list) {
            console.log(`Performing action ${a.action}`)
            BehaviorRegistry.getAction(a.action).perform(this.ctx, a.params)
        }
    }

    private getActionRequirements(list: [AIAction] | undefined){
        if (!list || list.length < 1) return; 

        for (const action of list){
            for (const req of BehaviorRegistry.getAction(action.action).requires){
                this.blackboard.set(req.name, this.owner.getRequired(req))
            }
        }
    }

    private getTransitionRequirements(list: [AITransition] | undefined){
        if (!list || list.length < 1) return; 

        for (const t of list){
            for (const req of BehaviorRegistry.getTrigger(t.trigger).requires){
                this.blackboard.set(req.name, this.owner.getRequired(req))
            }
        }
    }
}