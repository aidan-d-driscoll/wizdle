export class ComponentRequirementError extends Error {
    public readonly field?: string;
  
    constructor(message: string, field?: string) {
      super(message);
      
      this.name = 'ComponentRequirementError';
      this.field = field;
  
      Object.setPrototypeOf(this, ComponentRequirementError.prototype);
    }
  }