# Textarea Visualization

Multi-line text input field.

## Config Options

```typescript
config: {
  placeholder?: string;  // Placeholder text
  required?: boolean;    // Mark field as required
  rows?: number;        // Number of visible rows (default: 4)
  minLength?: number;   // Minimum character length
  maxLength?: number;   // Maximum character length
}
```

## Examples

```json
{
  "label": "Description",
  "visualization": "textarea",
  "config": {
    "placeholder": "Enter a detailed description...",
    "rows": 6,
    "maxLength": 500
  }
}
```

```json
{
  "label": "Comments",
  "visualization": "textarea",
  "config": {
    "required": false,
    "rows": 3
  }
}
```