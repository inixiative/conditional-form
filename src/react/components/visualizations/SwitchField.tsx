import React from 'react';

export interface SwitchFieldProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  
  // Injected components
  Switch: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  value = false,
  onChange,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
  Switch,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  return (
    <FormItem>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {label && (
            <Label title={tooltip}>
              {label}
              {required && <span>*</span>}
            </Label>
          )}
          {helperText && !error && FormDescription && (
            <FormDescription>{helperText}</FormDescription>
          )}
        </div>
        
        <Switch
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </div>
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};