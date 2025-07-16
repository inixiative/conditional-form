import React from 'react';

export interface SelectOption {
  value: any;
  label: string;
  helperText?: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  value?: any | any[];
  onChange: (value: any | any[]) => void;
  options: SelectOption[];
  label?: string;
  tooltip?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  multiple?: boolean;
  
  // Injected components
  Select: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  label,
  tooltip,
  placeholder = 'Select an option',
  helperText,
  disabled = false,
  required = false,
  error,
  multiple = false,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  const handleChange = (newValue: any) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(newValue);
      
      if (isSelected) {
        onChange(currentValues.filter(v => v !== newValue));
      } else {
        onChange([...currentValues, newValue]);
      }
    } else {
      onChange(newValue);
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
      
      <Select
        value={multiple ? undefined : value}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={JSON.stringify(option.value)} 
              value={option.value}
              disabled={option.disabled}
              title={option.tooltip}
            >
              <div>
                {option.label}
                {option.helperText && (
                  <div className="text-sm text-muted-foreground">
                    {option.helperText}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {helperText && !error && FormDescription && (
        <FormDescription>{helperText}</FormDescription>
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </FormItem>
  );
};