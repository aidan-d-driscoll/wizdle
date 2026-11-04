export class ModuleRequirementError extends Error {
    public readonly field?: string;
  
    constructor(message: string, field?: string) {
      super(message);
      
      this.name = 'ModuleRequirementError';
      this.field = field;
  
      Object.setPrototypeOf(this, ModuleRequirementError.prototype);
    }
  }