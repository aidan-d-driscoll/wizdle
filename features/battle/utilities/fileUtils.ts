interface AIAction {
    action: string,
    params?: Record<string, any>
}

interface AITransition {
    trigger: string,
    target_state: string,
    actions?: [AIAction]
}

interface AIState {
    on_enter?: [AIAction]
    on_update?: [AIAction]
    on_exit?: [AIAction]
    transition?: [AITransition]
}

export interface AIConfig {
    ai_name: string;
    initial_state: string;
    states: Record<string, AIState>
}

export async function loadAIConfig(filename: string) {
    try {
      const module = await import(`../AI_system/config_files/${filename}.json`, {
        with: { type: "json" } // Required in newer Node environments
      });
      
      const config: AIConfig = module.default;
      return config;
    } catch (error) {
      console.error("Failed to load AI_config file:", error);
    }
  }