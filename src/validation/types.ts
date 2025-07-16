export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  expectedValue?: any;
}

export interface ValidationResult<T = any> {
  original: T;
  updated: T;
  changed: boolean;
  errors?: ValidationError[];
}