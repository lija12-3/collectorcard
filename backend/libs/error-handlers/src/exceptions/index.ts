// Custom exceptions can be added here
export class BusinessLogicException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'BusinessLogicException';
  }
}

export class ValidationException extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
