import React, { useMemo } from 'react';
import { check } from '@inixiative/json-rules';
import type { FormField, FormFieldOption } from '../../types';
import {
  TextField,
  TextareaField,
  NumberField,
  SelectField,
  RadioField,
  CheckboxField,
  SwitchField,
  DateField,
  SliderField,
  ColorField,
  HiddenField
} from './visualizations';

interface InjectedComponents {
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  RadioGroup: React.ComponentType<any>;
  RadioGroupItem: React.ComponentType<any>;
  Checkbox: React.ComponentType<any>;
  Switch: React.ComponentType<any>;
  Slider: React.ComponentType<any>;
  [key: string]: React.ComponentType<any> | undefined;
}

export interface VisualizationFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  components: InjectedComponents;
  fieldKey?: string;
  error?: string;
  disabled?: boolean;
}

export const VisualizationField: React.FC<VisualizationFieldProps> = ({
  field,
  value,
  onChange,
  components,
  error,
  disabled = false
}) => {
  // Transform options to remove internal fields but keep useful ones
  const cleanOptions = useMemo(() => {
    if (!field.options) return [];
    return field.options.map((opt: any) => ({
      id: opt.id,
      value: opt.value,
      label: opt.label,
      helperText: opt.helperText,
      tooltip: opt.tooltip,
      disabled: opt.disabled || false
    }));
  }, [field.options]);
  // Common props for all field types
  const commonProps = {
    label: field.label,
    tooltip: field.tooltip,
    helperText: field.helperText,
    disabled: disabled || field.disabled,
    required: field.config?.required,
    error,
    value,
    onChange
  };

  // Create props with all components
  const fieldProps = {
    ...commonProps,
    ...components
  };

  // Handle different visualization types
  switch (field.visualization) {
    case 'text':
      return <TextField {...fieldProps} type="text" placeholder={field.config?.placeholder} />;
    
    case 'email':
      return <TextField {...fieldProps} type="email" placeholder={field.config?.placeholder} />;
    
    case 'url':
      return <TextField {...fieldProps} type="url" placeholder={field.config?.placeholder} />;
    
    case 'tel':
      return <TextField {...fieldProps} type="tel" placeholder={field.config?.placeholder} />;
    
    case 'password':
      return <TextField {...fieldProps} type="password" placeholder={field.config?.placeholder} />;
    
    case 'textarea':
      return (
        <TextareaField 
          {...fieldProps} 
          placeholder={field.config?.placeholder}
          rows={field.config?.rows}
        />
      );
    
    case 'number':
      return (
        <NumberField 
          {...fieldProps}
          min={field.config?.min}
          max={field.config?.max}
          step={field.config?.step}
          placeholder={field.config?.placeholder}
        />
      );
    
    case 'select':
    case 'selectSingle':
      return (
        <SelectField 
          {...fieldProps}
          options={cleanOptions}
          placeholder={field.config?.placeholder}
          multiple={false}
        />
      );
    
    case 'selectMulti':
      return (
        <SelectField 
          {...fieldProps}
          options={cleanOptions}
          placeholder={field.config?.placeholder}
          multiple={true}
        />
      );
    
    case 'radio':
      return (
        <RadioField 
          {...fieldProps}
          options={cleanOptions}
          orientation={field.config?.orientation}
        />
      );
    
    case 'checkbox':
      if (field.options && field.options.length > 0) {
        // Multiple checkboxes
        return (
          <CheckboxField 
            {...fieldProps}
            options={cleanOptions}
            multiple={true}
          />
        );
      } else {
        // Single checkbox
        return (
          <CheckboxField 
            {...fieldProps}
            multiple={false}
          />
        );
      }
    
    case 'switch':
      return <SwitchField {...fieldProps} />;
    
    case 'date':
      return (
        <DateField 
          {...fieldProps}
          includeTime={false}
        />
      );
    
    case 'time':
      return (
        <DateField 
          {...fieldProps}
          includeTime={true}
        />
      );
    
    case 'datetime':
      return (
        <DateField 
          {...fieldProps}
          includeTime={true}
        />
      );
    
    case 'slider':
    case 'range':
      return (
        <SliderField 
          {...fieldProps}
          min={field.config?.min}
          max={field.config?.max}
          step={field.config?.step}
          showValue={field.config?.showValue}
          options={cleanOptions}
        />
      );
    
    case 'color':
      return <ColorField {...fieldProps} />;
    
    case 'hidden':
      return <HiddenField value={value} onChange={onChange} />;
    
    // Fallback for unknown visualization types
    default:
      console.warn(`Unknown visualization type: ${field.visualization}. Falling back to text input.`);
      return <TextField {...fieldProps} type="text" placeholder={field.config?.placeholder} />;
  }
};