import { forEach } from 'lodash';
import type { ModelGroup, FormElement } from '../types';

export const groupFieldsByKey = <Model = any, TResource extends string = string>(
  records: ModelGroup<Model, TResource>['records'],
  modelKey: string
): Record<string, FormElement[]> => {
  const fieldsByKey: Record<string, FormElement[]> = {};
  const elementToModels: Record<string, string[]> = {};
  
  forEach(records, model => {
    forEach(model.elements, element => {
      fieldsByKey[element.key] ??= [];
      elementToModels[element.formElement.id] ??= [];
      
      elementToModels[element.formElement.id].push(model.id);
      
      if (!fieldsByKey[element.key].find(e => e.id === element.formElement.id)) {
        fieldsByKey[element.key].push({ ...element.formElement });
      }
    });
  });
  
  forEach(fieldsByKey, fields => {
    forEach(fields, formElement => {
      const modelIds = elementToModels[formElement.id];
      const modelConditions = modelIds.map(id => ({
        field: modelKey,
        operator: 'equals',
        value: id
      }));
      
      const additionalConditions = modelIds.length === 1 
        ? modelConditions[0]
        : { any: modelConditions };
      
      if (!formElement.conditions || formElement.conditions === true) {
        formElement.conditions = additionalConditions;
      } else {
        formElement.conditions = {
          all: [formElement.conditions, additionalConditions]
        };
      }
    });
  });
  
  return fieldsByKey;
};