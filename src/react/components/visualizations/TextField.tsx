import React from 'react';

export interface TextFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
  
  // Injected components
  Input: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const TextField: React.FC<TextFieldProps> = ({
  value = '',
  onChange,
  label,
  tooltip,
  placeholder,
  helperText,
  disabled = false,
  required = false,
  error,
  type = 'text',
  Input,
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
      
      <Input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
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