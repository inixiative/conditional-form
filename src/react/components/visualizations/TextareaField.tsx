import React from 'react';

export interface TextareaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  rows?: number;
  
  // Injected components
  Textarea: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  value = '',
  onChange,
  label,
  tooltip,
  placeholder,
  helperText,
  disabled = false,
  required = false,
  error,
  rows = 3,
  Textarea,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  return (
    <FormItem>
      {label && (
        <Label title={tooltip}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      
      <Textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
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