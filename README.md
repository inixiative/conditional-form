# conditional-form

A dynamic form generation and validation library that creates forms based on data models with conditional logic.

## Features

- **Dynamic Form Generation**: Generate form schemas from model configurations
- **Conditional Field Rendering**: Show/hide fields based on JSON rules
- **Smart Validation**: Auto-corrects invalid values and provides detailed error messages
- **Model-Based Structure**: Build forms around selectable models (products, templates, etc.)
- **TypeScript Support**: Full type safety with generics

## Installation

```bash
npm install conditional-form
# or
bun add conditional-form
```

## Quick Start

```typescript
import { generateForm, validateFormSubmission } from 'conditional-form';
import type { ModelGroup } from 'conditional-form';

// Define your models
const games: ModelGroup = {
  label: 'Game',
  key: 'gameId',
  records: [
    {
      id: 'game-1',
      name: 'Chess',
      elements: [
        {
          key: 'timeControl',
          formElement: {
            id: 'time-control',
            label: 'Time Control',
            visualization: 'select',
            conditions: true,
            options: [
              { id: 'blitz', label: 'Blitz (5 min)', value: 'blitz' },
              { id: 'rapid', label: 'Rapid (15 min)', value: 'rapid' },
              { id: 'classical', label: 'Classical (30 min)', value: 'classical' }
            ]
          }
        }
      ]
    }
  ]
};

// Generate form schema
const formSchema = generateForm([games]);

// Validate a submission
const submission = {
  gameId: 'game-1',
  timeControl: 'blitz'
};

const result = validateFormSubmission(submission, [games]);
```

## Core Concepts

### Model Groups

A ModelGroup represents a collection of selectable models (e.g., products, templates):

```typescript
interface ModelGroup<Model = any, TResource extends string = string> {
  label: string;  // Display name (e.g., "Game", "Template")
  key: string;    // Form field key (e.g., "gameId", "templateId")
  records: ModelWithElements<Model, TResource>[];  // Available options
}
```

### Form Elements

Form elements define the fields associated with each model:

```typescript
interface FormElement {
  id: string;
  label: string;
  visualization: FormElementVisualizationType;
  conditions?: any;  // JSON rules conditions
  options?: FormElementOption[];
  defaultValue?: any;
  helperText?: string;
  disabled?: boolean;
  locked?: boolean;
}
```

### Visualization Types

Supported UI components:
- `text`, `textarea`, `number`, `email`, `url`, `tel`
- `select`, `radio`, `checkbox`, `switch`
- `date`, `time`, `datetime`
- `file`, `image`, `color`, `range`
- `code`, `markdown`, `richtext`

### Conditional Logic

Fields can have conditions that determine when they're visible:

```typescript
// Show field only when gameId is 'chess'
conditions: {
  field: 'gameId',
  operator: 'equals',
  value: 'chess'
}

// Complex conditions
conditions: {
  all: [
    { field: 'gameId', operator: 'equals', value: 'chess' },
    { field: 'playerCount', operator: 'greaterThan', value: 2 }
  ]
}
```

## API Reference

### generateForm(models)

Generates a form schema from model definitions.

**Parameters:**
- `models`: Array of ModelGroup objects

**Returns:** `GeneratedFormSchema`
```typescript
{
  order: string[];  // Field display order
  fields: {
    [key: string]: FormField[];  // Fields grouped by key
  }
}
```

### validateFormSubmission(submission, models, exemptFields?, additionalContext?)

Validates and auto-corrects form submissions.

**Parameters:**
- `submission`: Form data to validate
- `models`: Same model definitions used for generation
- `exemptFields`: Optional array of field keys to skip validation
- `additionalContext`: Additional data for condition evaluation

**Returns:** `ValidationResult`
```typescript
{
  original: FormSubmissionData;  // Original submission
  updated: FormSubmissionData;   // Corrected submission
  changed: boolean;              // Whether corrections were made
  errors?: ValidationError[];    // Validation errors
}
```

## Validation Behavior

The validation system automatically handles several scenarios:

### Auto-Selection
- **Single Option**: When only one option is available, it's automatically selected
- **Default Values**: Uses default values when fields are missing

### Error Handling
- **Invalid Values**: Removes invalid selections and reports errors
- **Missing Fields**: Removes fields that no longer exist in the schema
- **Multiple Options**: Reports error when invalid value has multiple valid alternatives

### Conditional Fields
- Fields are validated only when their conditions are met
- Context includes both form values and full model objects

## Advanced Usage

### Array Fields

Support for array notation in field keys:

```typescript
{
  key: 'tournaments.0.format',
  formElement: {
    label: 'Tournament Format',
    // ...
  }
}
```

### Custom Context

Provide additional context for condition evaluation:

```typescript
const result = validateFormSubmission(
  submission,
  models,
  ['customField'],  // Exempt fields
  { userRole: 'admin' }  // Additional context
);
```

### Model Context Access

In conditions, you can access full model objects:

```typescript
// Access model properties in conditions
conditions: {
  field: 'gameModel.maxPlayers',
  operator: 'greaterThan',
  value: 4
}
```

## Examples

### Multi-Step Form

```typescript
const models = [
  {
    label: 'Product Category',
    key: 'categoryId',
    records: [/* categories */]
  },
  {
    label: 'Product',
    key: 'productId',
    records: [/* products with category-specific fields */]
  }
];

const schema = generateForm(models);
// Fields will automatically show/hide based on selected category
```

### Dynamic Configuration

```typescript
const activityTemplates: ModelGroup = {
  label: 'Activity Template',
  key: 'templateId',
  records: templates.map(template => ({
    ...template,
    elements: template.configFields.map(field => ({
      key: `config.${field.name}`,
      formElement: field
    }))
  }))
};
```

## License

MIT