import { AIConfig } from "../components/brain";

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