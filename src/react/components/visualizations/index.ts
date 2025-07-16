// Text inputs
export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';

export { TextareaField } from './TextareaField';
export type { TextareaFieldProps } from './TextareaField';

export { NumberField } from './NumberField';
export type { NumberFieldProps } from './NumberField';

// Selection components
export { SelectField } from './SelectField';
export type { SelectFieldProps, SelectOption } from './SelectField';

export { RadioField } from './RadioField';
export type { RadioFieldProps, RadioOption } from './RadioField';

export { CheckboxField } from './CheckboxField';
export type { CheckboxFieldProps, CheckboxOption } from './CheckboxField';

export { SwitchField } from './SwitchField';
export type { SwitchFieldProps } from './SwitchField';

// Date/Time
export { DateField } from './DateField';
export type { DateFieldProps } from './DateField';

// Advanced inputs
export { SliderField } from './SliderField';
export type { SliderFieldProps } from './SliderField';

export { ColorField } from './ColorField';
export type { ColorFieldProps } from './ColorField';

// Special
export { HiddenField } from './HiddenField';
export type { HiddenFieldProps } from './HiddenField';

// Visualization type mapping
export const VISUALIZATION_COMPONENTS = {
  text: 'TextField',
  textarea: 'TextareaField',
  number: 'NumberField',
  email: 'TextField', // Uses TextField with type="email"
  url: 'TextField', // Uses TextField with type="url"
  tel: 'TextField', // Uses TextField with type="tel"
  password: 'TextField', // Uses TextField with type="password"
  
  select: 'SelectField',
  selectSingle: 'SelectField', // alias
  selectMulti: 'SelectField', // with multiple=true
  
  radio: 'RadioField',
  checkbox: 'CheckboxField',
  switch: 'SwitchField',
  
  date: 'DateField',
  time: 'DateField', // DateField can handle time
  datetime: 'DateField', // with includeTime=true
  
  slider: 'SliderField',
  range: 'SliderField', // alias
  
  color: 'ColorField',
  
  hidden: 'HiddenField'
} as const;