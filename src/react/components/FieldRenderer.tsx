import React, { useEffect } from 'react';
import type { FormField, FormSubmissionData } from '../../types';
import { VisualizationField, type VisualizationFieldProps } from './VisualizationField';
import { useFieldState } from '../hooks/useFieldState';

export interface FieldRendererProps {
  fieldKey: string;
  fields: FormField[];
  values: FormSubmissionData;
  onChange: (values: FormSubmissionData) => void;
  context: Record<string, any>;
  components: Record<string, React.ComponentType<any>>; // This stays generic as it comes from parent
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldKey,
  fields,
  values,
  onChange,
  context,
  components
}) => {
  // Use memoized field state hook
  const { applicableField, visibleOptions } = useFieldState({
    fieldKey,
    fields,
    values,
    context
  });

  // Handle default values and cleanup when visibility changes
  useEffect(() => {
    if (applicableField) {
      // Field is visible - set default value if needed
      if (applicableField.defaultValue !== undefined && values[fieldKey] === undefined) {
        onChange({
          ...values,
          [fieldKey]: applicableField.defaultValue
        });
      }
    } else {
      // Field is not visible - remove its value if it exists
      if (values[fieldKey] !== undefined) {
        const newValues = { ...values };
        delete newValues[fieldKey];
        onChange(newValues);
      }
    }
  }, [applicableField, fieldKey, values, onChange]); // Run when field visibility or values change

  // Handle field value changes
  const handleChange = (newValue: any) => {
    onChange({
      ...values,
      [fieldKey]: newValue
    });
  };

  // Don't render if no applicable field
  if (!applicableField) {
    return null;
  }

  // Don't render hidden fields
  if (applicableField.visualization === 'hidden') {
    return (
      <input
        type="hidden"
        value={typeof values[fieldKey] === 'object' ? JSON.stringify(values[fieldKey]) : values[fieldKey] || ''}
        onChange={() => {}} // Hidden fields don't change via UI
      />
    );
  }

  const fieldWithFilteredOptions = {
    ...applicableField,
    options: visibleOptions
  };

  return (
    <VisualizationField
      field={fieldWithFilteredOptions}
      value={values[fieldKey]}
      onChange={handleChange}
      components={components as VisualizationFieldProps['components']}
      fieldKey={fieldKey}
      // You could add error handling here in the future
      // error={errors[fieldKey]}
    />
  );
};