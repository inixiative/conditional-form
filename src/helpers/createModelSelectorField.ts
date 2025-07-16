import type { ModelGroup, GeneratedFormSchema, FormFieldOption } from '../types';
import { getRecordLabel } from './getRecordLabel';
import { determineVisualization } from './determineVisualization';

/**
 * Creates a selector field for a model group
 */
export const createModelSelectorField = <Model = any, TResource extends string = string>(
  modelGroup: ModelGroup<Model, TResource>,
  order: Set<string>,
  fields: GeneratedFormSchema['fields']
): void => {
  const { label, key, records } = modelGroup;
  
  // Add to order
  order.add(key);
  
  // Create field for model selection
  const options: FormFieldOption[] = records.map((record, index) => ({
    id: `${key}-option-${index}`,
    label: getRecordLabel(record),
    value: record.id,
    description: null,
    helperText: null,
    tooltip: null,
    writeIn: false,
    isDefault: index === 0,
    conditions: undefined,
    disabledConditions: undefined
  }));
  
  fields[key] = [{
    label,
    helperText: null,
    tooltip: null,
    visualization: determineVisualization(records.length),
    defaultValue: records.length > 0 ? records[0].id : undefined,
    disabled: false,
    locked: false,
    config: null,
    options,
    conditions: true,
    isModel: true // Mark this as a model selection field
  }];
};