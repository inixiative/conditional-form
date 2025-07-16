import type { FormElementVisualizationType } from './models';

// Form submission data - key/value pairs
export type FormSubmissionData = Record<string, any>;

export interface GeneratedFormSchema {
  order: string[];
  fields: {
    [fieldKey: string]: FormField[];
  };
}

export interface FormField {
  label: string;
  helperText?: string;
  tooltip?: string;
  visualization: FormElementVisualizationType | string;
  defaultValue?: any;
  disabled: boolean;
  locked: boolean;
  config?: any;
  options?: FormFieldOption[];
  conditions?: any;
  isModel?: boolean; // Flag to indicate this is a model selection field
}

export interface FormFieldOption {
  id: string;
  label: string;
  value: any;
  description?: string;
  helperText?: string;
  tooltip?: string;
  writeIn: boolean;
  isDefault?: boolean;
  conditions?: any;
  disabledConditions?: any;
}