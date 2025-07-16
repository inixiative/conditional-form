# Slider Visualization

A range slider for selecting numeric values.

## Usage Modes

### 1. Continuous Range
When no options are provided, the slider uses a continuous numeric range:

```typescript
config: {
  min?: number;      // Default: 0
  max?: number;      // Default: 100
  step?: number;     // Default: 1
  showValue?: boolean; // Default: true
}
```

Example:
```json
{
  "label": "Volume",
  "visualization": "slider",
  "config": {
    "min": 0,
    "max": 100,
    "step": 10
  }
}
```

### 2. Discrete Options
When options are provided, the slider only allows selecting from those specific values:

```json
{
  "label": "Priority",
  "visualization": "slider",
  "options": [
    { "id": "1", "label": "Low", "value": 1, "conditions": true },
    { "id": "2", "label": "Medium", "value": 2, "conditions": true },
    { "id": "3", "label": "High", "value": 3, "conditions": true }
  ]
}
```

The slider will snap to the nearest option value and display the option label when `showValue` is true.