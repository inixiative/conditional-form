import { useState, useCallback, useMemo } from 'react';
import { check } from '@inixiative/json-rules';
import type { GeneratedFormSchema, FormSubmissionData, ModelGroup } from '../../types';
import { extractDependencies, getDependencyValues } from '../utils/extractDependencies';

export interface UseDynamicFormOptions {
  schema: GeneratedFormSchema;
  initialValues?: FormSubmissionData;
  context?: Record<string, any>;
  models?: ModelGroup[];
  onChange?: (values: FormSubmissionData) => void;
}

export interface UseDynamicFormReturn {
  values: FormSubmissionData;
  setValue: (key: string, value: any) => void;
  setValues: (values: FormSubmissionData) => void;
  getFieldDependencies: (fieldKey: string) => Set<string>;
  isFieldVisible: (fieldKey: string) => boolean;
  getVisibleOptions: (fieldKey: string) => any[];
  reset: () => void;
}

export function useDynamicForm({
  schema,
  initialValues = {},
  context: additionalContext = {},
  models,
  onChange
}: UseDynamicFormOptions): UseDynamicFormReturn {
  const [values, setValues] = useState<FormSubmissionData>(initialValues);

  // Build full context including models
  const fullContext = useMemo(() => {
    const ctx = {
      ...additionalContext,
      ...values
    };
    
    // Add full model objects for condition checking
    models?.forEach(modelGroup => {
      const selectedId = values[modelGroup.key];
      if (selectedId) {
        const selectedModel = modelGroup.records.find(record => record.id === selectedId);
        if (selectedModel) {
          ctx[`${modelGroup.key}Model`] = selectedModel;
        }
      }
    });
    
    return ctx;
  }, [additionalContext, values, models]);

  // Get dependencies for a field
  const getFieldDependencies = useCallback((fieldKey: string): Set<string> => {
    const fields = schema.fields[fieldKey];
    if (!fields) return new Set();

    const allDeps = new Set<string>();
    
    fields.forEach(field => {
      const fieldDeps = extractDependencies(field.conditions);
      fieldDeps.forEach(dep => allDeps.add(dep));
      
      // Also check option conditions
      field.options?.forEach(option => {
        const optionDeps = extractDependencies(option.conditions);
        optionDeps.forEach(dep => allDeps.add(dep));
      });
    });

    return allDeps;
  }, [schema.fields]);

  // Check if a field is visible based on conditions
  const isFieldVisible = useCallback((fieldKey: string): boolean => {
    const fields = schema.fields[fieldKey];
    if (!fields || fields.length === 0) return false;

    // Check if any field definition is applicable
    return fields.some(field => {
      try {
        return check(field.conditions, fullContext) === true;
      } catch {
        return false;
      }
    });
  }, [schema.fields, fullContext]);

  // Get visible options for a field
  const getVisibleOptions = useCallback((fieldKey: string): any[] => {
    const fields = schema.fields[fieldKey];
    if (!fields) return [];

    // Find applicable field first
    const applicableField = fields.find(field => {
      try {
        return check(field.conditions, fullContext) === true;
      } catch {
        return false;
      }
    });

    if (!applicableField || !applicableField.options) return [];

    // Filter options by conditions
    return applicableField.options.filter(option => {
      try {
        return check(option.conditions, fullContext) === true;
      } catch {
        return false;
      }
    });
  }, [schema.fields, fullContext]);

  // Set a single value
  const setValue = useCallback((key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onChange?.(newValues);
  }, [values, onChange]);

  // Set multiple values
  const handleSetValues = useCallback((newValues: FormSubmissionData) => {
    setValues(newValues);
    onChange?.(newValues);
  }, [onChange]);

  // Reset to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    onChange?.(initialValues);
  }, [initialValues, onChange]);

  return {
    values,
    setValue,
    setValues: handleSetValues,
    getFieldDependencies,
    isFieldVisible,
    getVisibleOptions,
    reset
  };
}