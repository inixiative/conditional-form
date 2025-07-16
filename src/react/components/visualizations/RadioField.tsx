import React from 'react';

export interface RadioOption {
  value: any;
  label: string;
  helperText?: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface RadioFieldProps {
  value?: any;
  onChange: (value: any) => void;
  options: RadioOption[];
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  
  // Injected components
  RadioGroup: React.ComponentType<any>;
  RadioGroupItem: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  value,
  onChange,
  options,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
  orientation = 'vertical',
  RadioGroup,
  RadioGroupItem,
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
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2'}
      >
        {options.map((option) => (
          <div key={JSON.stringify(option.value)} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value}
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
      </RadioGroup>
      
      {helperText && !error && FormDescription && (
        <FormDescription>{helperText}</FormDescription>
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};