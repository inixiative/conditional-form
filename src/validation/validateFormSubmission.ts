import { cloneDeep, get, set, unset, isEqual, pick, forEach, find, filter, map } from 'lodash';
import { check } from '@inixiative/json-rules';
import type { GeneratedFormSchema, FormSubmissionData, ModelGroup } from '../types';
import type { ValidationResult, ValidationError } from './types';
import { generateForm } from '../generateForm';

export const validateFormSubmission = <TResource extends string = string>(
  submission: FormSubmissionData,
  models?: ModelGroup<any, TResource>[],
  exemptFields?: string[],
  additionalContext?: any
): ValidationResult<FormSubmissionData> => {
  const original = cloneDeep(submission);
  const updated = cloneDeep(submission);
  const errors: ValidationError[] = [];
  
  // Track if any changes were made
  let changed = false;

  // Regenerate form with current models to get latest schema
  const schema = generateForm(models);

  // Build context for condition checking - combines submission data with model data
  const buildContext = () => {
    const context = {
      ...additionalContext,
      ...updated, // Current form values
    };
    
    // Inject full model objects for conditions to check against
    // Store under {key}Model to preserve original ID values for conditions
    forEach(models, modelGroup => {
      const selectedId = get(updated, modelGroup.key);
      if (selectedId) {
        const selectedModel = find(modelGroup.records, { id: selectedId });
        if (selectedModel) {
          set(context, `${modelGroup.key}Model`, selectedModel);
        }
      }
    });
    
    return context;
  };

  // Get model keys for filtering
  const modelKeys = map(models, 'key');
  

  // Validate each field in the submission
  forEach(updated, (value, fieldKey) => {
    // Skip model selector fields - they're handled separately
    if (modelKeys.includes(fieldKey)) return;
    
    // Skip exempt fields
    if (exemptFields?.includes(fieldKey)) return;


    // Check if field exists in schema
    const fields = schema.fields[fieldKey];
    
    // Remove fields that no longer exist in schema
    if (!fields || fields.length === 0) {
      unset(updated, fieldKey);
      changed = true;
      return;
    }

    // Find which field definitions apply based on conditions
    const applicableFields = fields.filter(field => 
      check(field.conditions, buildContext()) === true
    );
    
    if (applicableFields.length === 0) {
      // No field definition applies with current conditions
      unset(updated, fieldKey);
      changed = true;
      return;
    }
    
    if (applicableFields.length > 1) {
      // Multiple fields match - this is a configuration error
      errors.push({
        field: fieldKey,
        message: `Configuration error: Multiple field definitions match conditions for "${fieldKey}"`,
        value
      });
      return;
    }
    
    const field = applicableFields[0];

    // Validate field with options
    if (field.options) {
      const validOption = find(field.options, option => isEqual(option.value, value));
      
      if (!validOption) {
        // Get visible options based on conditions
        const visibleOptions = filter(field.options, opt => 
          check(opt.conditions, buildContext()) === true
        );
        
        if (!visibleOptions.length) {
          // No valid options - remove the field
          unset(updated, fieldKey);
          changed = true;
        } else if (visibleOptions.length === 1) {
          // Auto-select single option
          set(updated, fieldKey, visibleOptions[0].value);
          changed = true;
        } else {
          // Multiple options available but value is invalid - remove and report error
          unset(updated, fieldKey);
          changed = true;
          errors.push({
            field: fieldKey,
            message: `Invalid value for field "${field.label}"`,
            value,
            expectedValue: map(visibleOptions, 'value')
          });
        }
      } else {
        // Check if selected option's conditions are still met
        if (check(validOption.conditions, buildContext()) !== true) {
          // Find alternative valid option
          const alternativeOption = find(field.options, opt => 
            check(opt.conditions, buildContext()) === true
          );
          
          if (alternativeOption) {
            set(updated, fieldKey, alternativeOption.value);
            changed = true;
          } else {
            errors.push({
              field: fieldKey,
              message: `Selected option is no longer valid for field "${field.label}"`,
              value
            });
          }
        }
      }
    }
  });

  // Check for required fields that are missing
  forEach(schema.fields, (fields, fieldKey) => {
    // Skip model selector fields
    if (modelKeys.includes(fieldKey)) return;
    
    // Skip exempt fields
    if (exemptFields?.includes(fieldKey)) return;

    if (!updated.hasOwnProperty(fieldKey)) {
      // Find which field definition applies
      const applicableFields = fields.filter(field => 
        check(field.conditions, buildContext()) === true
      );
      
      if (applicableFields.length !== 1) {
        // Either no field applies or multiple fields apply - skip
        return;
      }
      
      const field = applicableFields[0];

      // Check if field has a default value
      if (field.defaultValue !== undefined) {
        set(updated, fieldKey, field.defaultValue);
        changed = true;
      } else if (field.options) {
        // Get visible options
        const visibleOptions = filter(field.options, opt => 
          check(opt.conditions, buildContext()) === true
        );

        if (visibleOptions.length === 1) {
          // Auto-select single option
          set(updated, fieldKey, visibleOptions[0].value);
          changed = true;
        }
      }
    }
  });

  // Validate model selections
  forEach(models, modelGroup => {
    // Skip exempt fields
    if (exemptFields?.includes(modelGroup.key)) return;
    
    const selectedId = get(updated, modelGroup.key);
    
    if (!selectedId) {
      // Auto-select if single option or use first as default
      if (modelGroup.records.length === 1) {
        set(updated, modelGroup.key, modelGroup.records[0].id);
        changed = true;
      } else if (modelGroup.records.length > 0) {
        set(updated, modelGroup.key, modelGroup.records[0].id);
        changed = true;
      }
    } else {
      // Validate the selected ID exists
      const validRecord = find(modelGroup.records, { id: selectedId });
      if (!validRecord) {
        errors.push({
          field: modelGroup.key,
          message: `Invalid selection for ${modelGroup.label}`,
          value: selectedId,
          expectedValue: map(modelGroup.records, 'id')
        });
      }
    }
  });

  // Check if any changes were made
  if (!changed) {
    changed = !isEqual(original, updated);
  }

  // Keep only model IDs and form fields - remove any full model objects
  const formFieldKeys = Object.keys(schema.fields);
  
  const allowedKeys = [...formFieldKeys, ...modelKeys, ...(exemptFields || [])];
  const cleanUpdated = pick(updated, allowedKeys);

  // Ensure model fields only contain IDs (in case objects got in somehow)
  forEach(modelKeys, key => {
    const value = get(cleanUpdated, key);
    if (value && typeof value === 'object' && value.id) {
      set(cleanUpdated, key, value.id);
    }
  });

  return {
    original,
    updated: cleanUpdated,
    changed,
    errors: errors.length > 0 ? errors : undefined
  };
};