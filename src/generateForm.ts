import type { 
  ModelGroup,
  GeneratedFormSchema
} from './types';
import { createModelSelectorField } from './helpers/createModelSelectorField';
import { createFormElementFields } from './helpers/createFormElementFields';

export const generateForm = <TResource extends string = string>(
  models?: ModelGroup<any, TResource>[]
): GeneratedFormSchema => {
  const order = new Set<string>();
  const fields: GeneratedFormSchema['fields'] = {};

  if (!models || models.length === 0) {
    return {
      order: [],
      fields: {}
    };
  }

  // Step 1: Create model selector fields
  models.forEach((modelGroup) => {
    createModelSelectorField(modelGroup, order, fields);
  });

  // Step 2: Create form element fields
  models.forEach((modelGroup) => {
    createFormElementFields(modelGroup, order, fields);
  });

  return {
    order: [...order],
    fields
  };
};