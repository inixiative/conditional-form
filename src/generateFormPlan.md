# Generate Form Implementation Plan

## Updated Input Structure
```typescript
interface FormGeneratorInput<TResource extends string = string, Model = any> {
  models: ModelGroupWithElements<Model, TResource>[];
}

interface ModelGroupWithElements<Model = any, TResource extends string = string> {
  label: string;     // e.g., "Game", "Activity Template", "Format"
  key: string;       // e.g., "gameId", "activityTemplateId", "formatId"
  records: Model[];  // The model instances to choose from
  elements: ResourceFormElementWithElement<TResource>[];  // Form elements for this model type
}
```

## Example Input
```typescript
const input = {
  models: [
    {
      label: "Game",
      key: "gameId",
      records: [
        { id: "1", name: "Magic: The Gathering" },
        { id: "2", name: "Pokemon" }
      ],
      elements: [
        // Form elements that appear when a game is selected
        // These elements might have conditions based on which game is selected
      ]
    },
    {
      label: "Activity Template",
      key: "activityTemplateId", 
      records: [
        { id: "1", label: "Standard Tournament" },
        { id: "2", label: "Casual Play" }
      ],
      elements: [
        // Form elements that appear when an activity template is selected
        // These might have conditions based on both selected game AND template
      ]
    }
  ]
}
```

## Form Structure
The generated form will have:
1. **Model Selectors Section**: Fields to select from each model type
2. **Dynamic Fields Section**: Fields that appear based on model selections

## Processing Flow
1. For each ModelGroup:
   - Create a selector field with the model records as options
   - Store the associated elements for conditional rendering
   
2. Evaluate conditions to determine which elements to show based on:
   - Selected model IDs (e.g., which game was selected)
   - Other form values
   
3. Group and order the visible fields appropriately

## Benefits of This Structure
- Clear relationship between models and their form fields
- Natural hierarchical structure (select game → show game-specific fields)
- Easier to understand data flow
- More efficient - only process elements for selected models