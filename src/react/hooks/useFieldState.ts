import { useMemo } from 'react';
import { check } from '@inixiative/json-rules';
import type { FormField, FormSubmissionData } from '../../types';
import { extractDependencies, getDependencyValues } from '../utils/extractDependencies';

export interface UseFieldStateOptions {
  fieldKey: string;
  fields: FormField[];
  values: FormSubmissionData;
  context: Record<string, any>;
}

export interface UseFieldStateReturn {
  applicableField: FormField | null;
  isVisible: boolean;
  visibleOptions: any[];
  dependencies: Set<string>;
  dependencyValues: any[];
}

/**
 * Hook for managing individual field state with proper memoization
 * Only re-evaluates when field dependencies change
 */
export function useFieldState({
  fieldKey,
  fields,
  values,
  context
}: UseFieldStateOptions): UseFieldStateReturn {
  // Extract all dependencies for this field
  const dependencies = useMemo(() => {
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
  }, [fields]);

  // Get dependency values for memoization
  const dependencyValues = useMemo(
    () => getDependencyValues(dependencies, values),
    [dependencies, values]
  );

  // Find applicable field based on conditions
  // This only re-evaluates when dependencies change
  const applicableField = useMemo(() => {
    const validFields = fields.filter(field => {
      try {
        return check(field.conditions, context) === true;
      } catch (error) {
        console.warn(`Condition evaluation failed for field ${fieldKey}:`, error);
        return false;
      }
    });

    if (validFields.length === 0) {
      return null;
    }

    if (validFields.length > 1) {
      console.warn(`Multiple field definitions match conditions for "${fieldKey}". Using first match.`);
    }

    return validFields[0];
  }, [fields, context, fieldKey, ...dependencyValues]); // Only re-run when deps change

  // Get filtered options based on conditions and evaluate disabled state
  const visibleOptions = useMemo(() => {
    if (!applicableField?.options) return [];

    return applicableField.options
      .filter(option => {
        try {
          return check(option.conditions, context) === true;
        } catch (error) {
          console.warn(`Option condition evaluation failed for ${fieldKey}:`, error);
          return false;
        }
      })
      .map(option => ({
        ...option,
        // Evaluate disabled conditions
        disabled: option.disabledConditions ? 
          check(option.disabledConditions, context) === true : 
          false
      }));
  }, [applicableField, context, fieldKey, ...dependencyValues]); // Only re-run when deps change

  const isVisible = applicableField !== null;

  return {
    applicableField,
    isVisible,
    visibleOptions,
    dependencies,
    dependencyValues
  };
}