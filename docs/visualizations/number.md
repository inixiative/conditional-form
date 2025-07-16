# Number Visualization

Numeric input field.

## Config Options

```typescript
config: {
  placeholder?: string;  // Placeholder text
  required?: boolean;    // Mark field as required
  min?: number;         // Minimum value
  max?: number;         // Maximum value
  step?: number;        // Step increment (default: 1)
}
```

## Examples

```json
{
  "label": "Age",
  "visualization": "number",
  "config": {
    "min": 0,
    "max": 150,
    "required": true
  }
}
```

```json
{
  "label": "Price",
  "visualization": "number",
  "config": {
    "min": 0,
    "step": 0.01,
    "placeholder": "0.00"
  }
}
```