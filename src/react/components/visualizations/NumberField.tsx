import React from 'react';

export interface NumberFieldProps {
  value?: number;
  onChange: (value: number) => void;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  
  // Injected components
  Input: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  label,
  tooltip,
  placeholder,
  helperText,
  disabled = false,
  required = false,
  error,
  min,
  max,
  step = 1,
  Input,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    } else if (e.target.value === '') {
      onChange(0);
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
      
      <Input
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
      
      {helperText && !error && FormDescription && (
        <FormDescription>{helperText}</FormDescription>
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};