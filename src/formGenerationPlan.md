# Form Generation Logic Plan

## Input Structure
```typescript
interface FormGeneratorInput<T extends string = string> {
  models: ModelGroup[];
  elements: ResourceFormElementWithElement<T>[];
}

interface ModelGroup {
  label: string;  // e.g., "Game", "Activity Template", "Format"
  key: string;    // e.g., "gameId", "activityTemplateId", "formatId"
  records: ModelRecord[];
}

interface ModelRecord {
  id: string;
  // Should have label or name
  label?: string;
  name?: string;
  [key: string]: any; // Other model properties
}

type ResourceFormElementWithElement<T extends string = string> = 
  ResourceFormElement<T> & {
    formElement: FormElement & {
      options: FormElementOption[];
    }
  };
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
      ]
    },
    {
      label: "Activity Template", 
      key: "activityTemplateId",
      records: [
        { id: "1", label: "Standard Tournament" },
        { id: "2", label: "Casual Play" }
      ]
    }
  ],
  elements: [
    // ResourceFormElements with nested FormElement and options
  ]
}
```