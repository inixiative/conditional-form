import React from 'react';

export interface ColorFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  
  // Injected components
  Input: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const ColorField: React.FC<ColorFieldProps> = ({
  value = '#000000',
  onChange,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
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
      
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          disabled={disabled}
          className="w-12 h-10"
        />
        <Input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1"
        />
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