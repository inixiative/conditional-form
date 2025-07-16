import React from 'react';
import { isEqual } from 'lodash';

export interface CheckboxOption {
  value: any;
  label: string;
  helperText?: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface CheckboxFieldProps {
  value?: boolean | any[];
  onChange: (value: boolean | any[]) => void;
  options?: CheckboxOption[]; // For multiple checkboxes
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  multiple?: boolean; // If true, expects options array and returns array of values
  
  // Injected components
  Checkbox: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  value,
  onChange,
  options,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
  multiple = false,
  Checkbox,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  // Single checkbox mode
  if (!multiple && !options) {
    return (
      <FormItem>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked: boolean) => onChange(checked)}
            disabled={disabled}
            id="checkbox"
          />
          {label && (
            <Label htmlFor="checkbox">
              {label}
              {required && <span>*</span>}
            </Label>
          )}
        </div>
        
        {helperText && !error && FormDescription && (
          <FormDescription>{helperText}</FormDescription>
        )}
        
        {error && (
          <FormMessage>{error}</FormMessage>
        )}
      </FormItem>
    );
  }

  // Multiple checkboxes mode
  const selectedValues = Array.isArray(value) ? value : [];
  
  const handleOptionChange = (optionValue: any, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionValue]);
    } else {
      // For object values, we need to use deep equality
      onChange(selectedValues.filter(v => !isEqual(v, optionValue)));
    }
  };

  return (
    <FormItem>
      {label && (
        <Label title={tooltip}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      
      <div className="space-y-2">
        {options?.map((option) => (
          <div key={JSON.stringify(option.value)} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedValues.some(v => isEqual(v, option.value))}
              onCheckedChange={(checked: boolean) => handleOptionChange(option.value, checked)}
              disabled={option.disabled || disabled}
              id={JSON.stringify(option.value)}
            />
            <Label htmlFor={JSON.stringify(option.value)} className="flex-1">
              <span title={option.tooltip}>{option.label}</span>
              {option.helperText && (
                <div className="text-sm text-muted-foreground">
                  {option.helperText}
                </div>
              )}
            </Label>
          </div>
        ))}
      </div>
      
      {helperText && !error && FormDescription && (
        <FormDescription>{helperText}</FormDescription>
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};