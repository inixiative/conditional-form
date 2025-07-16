import { forEach } from 'lodash';
import type { ModelGroup, GeneratedFormSchema, FormField } from '../types';
import { groupFieldsByKey } from './groupFieldsByKey';

export const createFormElementFields = <Model = any, TResource extends string = string>(
  modelGroup: ModelGroup<Model, TResource>,
  order: Set<string>,
  fields: GeneratedFormSchema['fields']
): void => {
  const { key: modelKey, records } = modelGroup;
  
  const fieldsByKey = groupFieldsByKey(records, modelKey);
  
  forEach(fieldsByKey, (formElements, fieldKey) => {
    order.add(fieldKey);
    
    fields[fieldKey] ??= [];
    
    forEach(formElements, formElement => {
      let defaultValue = formElement.defaultValue;
      
      if (formElement.defaultOptionId && formElement.options) {
        const defaultOption = formElement.options.find(opt => opt.id === formElement.defaultOptionId);
        if (defaultOption) {
          defaultValue = defaultOption.value;
        }
      }
      
      const field: FormField = {
        label: formElement.label,
        helperText: formElement.helperText,
        tooltip: formElement.tooltip,
        visualization: formElement.visualization,
        defaultValue,
        disabled: formElement.disabled,
        locked: formElement.locked,
        config: formElement.config,
        options: formElement.options,
        conditions: formElement.conditions
      };
      
      fields[fieldKey].push(field);
    });
  });
};