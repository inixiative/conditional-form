import React from 'react';

export interface SliderOption {
  id: string;
  label: string;
  value: number;
  helperText?: string;
  tooltip?: string;
}

export interface SliderFieldProps {
  value?: number;
  onChange: (value: number) => void;
  label?: string;
  tooltip?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  
  // For continuous range
  min?: number;
  max?: number;
  step?: number;
  
  // For discrete options
  options?: SliderOption[];
  
  showValue?: boolean;
  
  // Injected components
  Slider: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  FormItem: React.ComponentType<any>;
  FormMessage: React.ComponentType<any>;
  FormDescription?: React.ComponentType<any>;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  value = 0,
  onChange,
  label,
  tooltip,
  helperText,
  disabled = false,
  required = false,
  error,
  min = 0,
  max = 100,
  step = 1,
  options,
  showValue = true,
  Slider,
  Label,
  FormItem,
  FormMessage,
  FormDescription
}) => {
  // Determine mode: discrete options or continuous range
  const hasOptions = options && options.length > 0;
  
  // For discrete options, derive min/max from the option values
  const sliderMin = hasOptions ? Math.min(...options.map(o => o.value)) : min;
  const sliderMax = hasOptions ? Math.max(...options.map(o => o.value)) : max;
  const sliderStep = hasOptions ? 1 : step;
  
  // If using options, map the value to the nearest option
  const handleChange = (newValue: number) => {
    if (hasOptions) {
      // Find the closest option value
      const closestOption = options.reduce((prev, curr) => 
        Math.abs(curr.value - newValue) < Math.abs(prev.value - newValue) ? curr : prev
      );
      onChange(closestOption.value);
    } else {
      onChange(newValue);
    }
  };
  
  // Get display value/label
  const displayValue = hasOptions 
    ? options.find(o => o.value === value)?.label || value.toString()
    : value.toString();
  
  return (
    <FormItem>
      <div className="flex items-center justify-between">
        {label && (
          <Label title={tooltip}>
            {label}
            {required && <span>*</span>}
          </Label>
        )}
        {showValue && (
          <span className="text-sm text-muted-foreground">{displayValue}</span>
        )}
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values: number[]) => handleChange(values[0])}
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        {hasOptions ? (
          <>
            <span>{options[0].label}</span>
            <span>{options[options.length - 1].label}</span>
          </>
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
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
};