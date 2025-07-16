import React from 'react';

// Default shadcn/ui-style components
// These can be overridden by importing actual shadcn components

export const DefaultInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
DefaultInput.displayName = 'Input';

export const DefaultTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
DefaultTextarea.displayName = 'Textarea';

export const DefaultLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    {...props}
  />
));
DefaultLabel.displayName = 'Label';

export const DefaultFormItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={`space-y-2 ${className || ''}`}>
    {children}
  </div>
);

export const DefaultFormMessage: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={`text-sm font-medium text-destructive ${className || ''}`}>
    {children}
  </p>
);

export const DefaultFormDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={`text-sm text-muted-foreground ${className || ''}`}>
    {children}
  </p>
);

// Select components
export const DefaultSelect: React.FC<{
  value?: any;
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ value, onValueChange, disabled, children }) => {
  // Extract options from children
  const options: Array<{ value: any; disabled?: boolean; children: React.ReactNode }> = [];
  let placeholder = '';
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as any;
      if (child.type === DefaultSelectTrigger) {
        // Extract placeholder from SelectValue
        React.Children.forEach(childProps.children, (triggerChild: any) => {
          if (React.isValidElement(triggerChild) && triggerChild.type === DefaultSelectValue) {
            const triggerChildProps = triggerChild.props as any;
            placeholder = triggerChildProps.placeholder || '';
          }
        });
      } else if (child.type === DefaultSelectContent) {
        // Extract SelectItems
        React.Children.forEach(childProps.children, (contentChild: any) => {
          if (React.isValidElement(contentChild) && contentChild.type === DefaultSelectItem) {
            const contentChildProps = contentChild.props as any;
            options.push({
              value: contentChildProps.value,
              disabled: contentChildProps.disabled,
              children: contentChildProps.children
            });
          }
        });
      }
    }
  });
  
  return (
    <select
      value={value || ''}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option
          key={option.value || index}
          value={option.value}
          disabled={option.disabled}
        >
          {option.children}
        </option>
      ))}
    </select>
  );
};

export const DefaultSelectTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => <>{children}</>;

export const DefaultSelectContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => <>{children}</>;

export const DefaultSelectItem: React.FC<{
  value: any;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}> = ({ children }) => <>{children}</>;

export const DefaultSelectValue: React.FC<{
  placeholder?: string;
  className?: string;
}> = ({ placeholder }) => <>{placeholder}</>;

// Radio components
export const DefaultRadioGroup: React.FC<{
  value?: any;
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onValueChange, disabled, children, className }) => {
  const name = React.useMemo(() => `radio-group-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Process children to find RadioGroupItems even if they're wrapped
  const processChild = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;
    
    // If this is a RadioGroupItem, clone it with the necessary props
    if (child.type === DefaultRadioGroupItem) {
      const childProps = child.props as any;
      return React.cloneElement(child, {
        ...childProps,
        checked: childProps.value === value,
        onChange: () => onValueChange?.(childProps.value),
        disabled: disabled || childProps.disabled,
        name
      });
    }
    
    // If this has children (like a wrapper div), process its children
    const childProps = child.props as any;
    if (childProps && childProps.children) {
      return React.cloneElement(child, {
        ...childProps,
        children: React.Children.map(childProps.children, processChild)
      });
    }
    
    return child;
  };
  
  return (
    <div className={`grid gap-2 ${className || ''}`}>
      {React.Children.map(children, processChild)}
    </div>
  );
};

export const DefaultRadioGroupItem: React.FC<{
  value: any;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  name?: string;
}> = ({ value, checked, onChange, disabled, id, className, name }) => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  
  return (
    <input
      type="radio"
      value={stringValue}
      checked={checked || false}
      onChange={(e) => {
        if (e.target.checked && onChange) {
          onChange();
        }
      }}
      disabled={disabled}
      id={id}
      name={name}
      className={`h-4 w-4 ${className || ''}`}
    />
  );
};

// Checkbox
export const DefaultCheckbox: React.FC<{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}> = ({ checked, onCheckedChange, disabled, id, className }) => (
  <input
    type="checkbox"
    checked={checked || false}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    disabled={disabled}
    id={id}
    className={`h-4 w-4 ${className || ''}`}
  />
);

// Switch
export const DefaultSwitch: React.FC<{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onCheckedChange, disabled, className }) => (
  <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input
      type="checkbox"
      checked={checked || false}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

// Slider
export const DefaultSlider: React.FC<{
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}> = ({ value, onValueChange, min = 0, max = 100, step = 1, disabled, className }) => (
  <input
    type="range"
    value={value?.[0] || min}
    onChange={(e) => onValueChange?.([Number(e.target.value)])}
    min={min}
    max={max}
    step={step}
    disabled={disabled}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className || ''}`}
  />
);

// Default component map
export const defaultShadcnComponents = {
  // Basic inputs
  Input: DefaultInput,
  Textarea: DefaultTextarea,
  Label: DefaultLabel,
  
  // Form layout
  FormItem: DefaultFormItem,
  FormMessage: DefaultFormMessage,
  FormDescription: DefaultFormDescription,
  
  // Select
  Select: DefaultSelect,
  SelectContent: DefaultSelectContent,
  SelectItem: DefaultSelectItem,
  SelectTrigger: DefaultSelectTrigger,
  SelectValue: DefaultSelectValue,
  
  // Radio
  RadioGroup: DefaultRadioGroup,
  RadioGroupItem: DefaultRadioGroupItem,
  
  // Checkbox & Switch
  Checkbox: DefaultCheckbox,
  Switch: DefaultSwitch,
  
  // Slider
  Slider: DefaultSlider,
};