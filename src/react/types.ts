import type { ReactNode, ComponentType } from 'react';
import type { GeneratedFormSchema, FormSubmissionData, ModelGroup } from '../types';

// Component injection props for customizing UI components
export interface ComponentProps {
  // Basic form elements
  Input?: ComponentType<any>;
  Select?: ComponentType<any>;
  Textarea?: ComponentType<any>;
  Checkbox?: ComponentType<any>;
  Radio?: ComponentType<any>;
  Switch?: ComponentType<any>;
  Button?: ComponentType<any>;
  
  // Layout components
  FormItem?: ComponentType<any>;
  Label?: ComponentType<any>;
  FormMessage?: ComponentType<any>;
  FormDescription?: ComponentType<any>;
}

// Field renderer props
export interface FieldRendererProps {
  fieldKey: string;
  field: any;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  components?: ComponentProps;
}

// Main form props
export interface DynamicFormProps {
  schema: GeneratedFormSchema;
  models?: ModelGroup[];
  values?: FormSubmissionData;
  onChange?: (values: FormSubmissionData) => void;
  onSubmit?: (values: FormSubmissionData) => void;
  components?: ComponentProps;
  className?: string;
  children?: ReactNode;
}

// Hook return type
export interface UseDynamicFormReturn {
  values: FormSubmissionData;
  errors: Record<string, string>;
  setValue: (key: string, value: any) => void;
  handleSubmit: (onSubmit: (values: FormSubmissionData) => void) => void;
  visibleFields: string[];
  validationResult?: any;
}