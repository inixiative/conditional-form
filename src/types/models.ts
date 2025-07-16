// Try to import from Prisma client, fallback to local types
// export type { 
//   FormElement as PrismaFormElement,
//   FormElementOption as PrismaFormElementOption,
//   ResourceFormElement as PrismaResourceFormElement,
//   FormElementVisualizationType as PrismaFormElementVisualizationType
// } from '@prisma/client';

// Fallback types if Prisma types aren't available
export enum FormElementVisualizationType {
  hidden = 'hidden',
  constant = 'constant',
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  email = 'email',
  url = 'url',
  password = 'password',
  select = 'select',
  multiSelect = 'multiSelect',
  radio = 'radio',
  checkbox = 'checkbox',
  buttonGroup = 'buttonGroup',
  multiButtonGroup = 'multiButtonGroup',
  slider = 'slider',
  switch = 'switch',
  datePicker = 'datePicker',
  timePicker = 'timePicker',
  dateTimePicker = 'dateTimePicker',
  colorPicker = 'colorPicker',
  filePicker = 'filePicker',
  custom = 'custom'
}

export interface FormElement {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  label: string;
  description?: string;
  helperText?: string;
  tooltip?: string;
  key?: string;
  visualization: FormElementVisualizationType;
  defaultValue?: any;
  defaultOptionId?: string;
  conditions: any;
  disabled: boolean;
  locked: boolean;
  config?: any;
  
  // Relations
  options?: FormElementOption[];
  defaultOption?: FormElementOption | null;
  resourceElements?: ResourceFormElement[];
}

export interface FormElementOption {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  value: any;
  description?: string;
  helperText?: string;
  tooltip?: string;
  order: number;
  writeIn: boolean;
  conditions?: any;
  disabledConditions?: any;
  formElementId: string;
  
  // Relations
  formElement?: FormElement;
  defaultForElements?: FormElement[];
}

export interface ResourceFormElement<T extends string = string> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  resourceType: T;
  resourceId: string;
  key: string;
  order: number;
  formElementId: string;
  
  // Relations
  formElement?: FormElement;
}