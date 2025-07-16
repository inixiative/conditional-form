# Text Visualization

Single-line text input field.

## Config Options

```typescript
config: {
  placeholder?: string;  // Placeholder text
  required?: boolean;    // Mark field as required
  minLength?: number;    // Minimum character length
  maxLength?: number;    // Maximum character length
  pattern?: string;      // Regex pattern for validation
}
```

## Examples

```json
{
  "label": "Full Name",
  "visualization": "text",
  "config": {
    "placeholder": "Enter your full name",
    "required": true,
    "minLength": 2,
    "maxLength": 100
  }
}
```

```json
{
  "label": "Username",
  "visualization": "text",
  "config": {
    "placeholder": "alphanumeric only",
    "pattern": "^[a-zA-Z0-9]+$"
  }
}
```