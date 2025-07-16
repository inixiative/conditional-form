import React from 'react';

export interface DateFieldProps {
  value?: string | Date;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  includeTime?: boolean; // For datetime type
  
  // Injected components
  DatePicker?: React.ComponentType<any>; // Custom date picker
  Input: React.ComponentType<any>; // Fallback to regular input
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
  includeTime = false,
  DatePicker,
  Input,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  // Convert value to string format for input
  const inputValue = value instanceof Date ? value.toISOString().split('T')[0] : value || '';
  
  const handleChange = (newValue: string | Date) => {
    if (typeof newValue === 'string') {
      onChange(newValue);
    } else if (newValue instanceof Date) {
      onChange(newValue.toISOString());
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
      
      {DatePicker ? (
        <DatePicker
          value={value}
          onChange={handleChange}
          disabled={disabled}
          includeTime={includeTime}
        />
      ) : (
        <Input
          type={includeTime ? 'datetime-local' : 'date'}
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}
      
      {helperText && !error && FormDescription && (
        <FormDescription>{helperText}</FormDescription>
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};