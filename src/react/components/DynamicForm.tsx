import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { check } from '@inixiative/json-rules';
import type { GeneratedFormSchema, FormSubmissionData, ModelGroup, FormField } from '../../types';
import { defaultShadcnComponents } from './defaults/shadcnComponents';
import { FieldRenderer } from './FieldRenderer';

export interface DynamicFormProps {
  schema: GeneratedFormSchema;
  values: FormSubmissionData;
  onChange: (values: FormSubmissionData) => void;
  context?: Record<string, any>;
  components?: Record<string, React.ComponentType<any>>;
  models?: ModelGroup[];
  className?: string;
  children?: React.ReactNode;
}

// Context for sharing form state and components
interface DynamicFormContextValue {
  schema: GeneratedFormSchema;
  values: FormSubmissionData;
  onChange: (values: FormSubmissionData) => void;
  context: Record<string, any>;
  components: Record<string, React.ComponentType<any>>;
  models?: ModelGroup[];
}

const DynamicFormContext = createContext<DynamicFormContextValue | null>(null);

export const useDynamicFormContext = () => {
  const context = useContext(DynamicFormContext);
  if (!context) {
    throw new Error('useDynamicFormContext must be used within DynamicForm');
  }
  return context;
};

// Models section component
const ModelsSection: React.FC = () => {
  const { schema, values, onChange, context, components } = useDynamicFormContext();
  
  const modelFields = useMemo(() => {
    // Find all fields that have isModel=true
    return schema.order
      .filter(fieldKey => {
        const fields = schema.fields[fieldKey];
        return fields && fields.some(field => field.isModel);
      })
      .map(fieldKey => ({
        key: fieldKey,
        fields: schema.fields[fieldKey]
      }));
  }, [schema.order, schema.fields]);

  if (modelFields.length === 0) return null;

  return (
    <div className="space-y-4">
      {modelFields.map(({ key, fields }) => (
        <FieldRenderer
          key={key}
          fieldKey={key}
          fields={fields}
          values={values}
          onChange={onChange}
          context={context}
          components={components}
        />
      ))}
    </div>
  );
};

// Options section component
const OptionsSection: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { schema, values, onChange, context, components } = useDynamicFormContext();
  
  const optionFields = useMemo(() => {
    // Find all fields that don't have isModel=true
    return schema.order
      .filter(fieldKey => {
        const fields = schema.fields[fieldKey];
        return fields && !fields.some(field => field.isModel);
      })
      .map(fieldKey => ({
        key: fieldKey,
        fields: schema.fields[fieldKey]
      }));
  }, [schema.order, schema.fields]);

  return (
    <div className="space-y-4">
      {/* Custom fields from children appear first */}
      {children}
      
      {/* Then schema-generated fields */}
      {optionFields.map(({ key, fields }) => (
        <FieldRenderer
          key={key}
          fieldKey={key}
          fields={fields}
          values={values}
          onChange={onChange}
          context={context}
          components={components}
        />
      ))}
    </div>
  );
};

// Main form component
export const DynamicForm: React.FC<DynamicFormProps> & {
  Models: typeof ModelsSection;
  Options: typeof OptionsSection;
} = ({
  schema,
  values,
  onChange,
  context: additionalContext = {},
  components: userComponents = {},
  models,
  className,
  children
}) => {
  // Build full context for condition evaluation
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

  // Merge user components with defaults
  const mergedComponents = useMemo(() => ({
    ...defaultShadcnComponents,
    ...userComponents
  }), [userComponents]);

  const contextValue: DynamicFormContextValue = {
    schema,
    values,
    onChange,
    context: fullContext,
    components: mergedComponents,
    models
  };

  return (
    <DynamicFormContext.Provider value={contextValue}>
      <div className={`space-y-6 ${className || ''}`}>
        {children}
      </div>
    </DynamicFormContext.Provider>
  );
};

// Attach compound components
DynamicForm.Models = ModelsSection;
DynamicForm.Options = OptionsSection;