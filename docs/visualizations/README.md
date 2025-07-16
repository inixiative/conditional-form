# Form Visualization Types

This directory contains documentation for each visualization type supported by the conditional-form library.

## Overview

Each visualization type has its own configuration options that can be specified in the `config` field of a FormElement. Some visualizations also support field-level properties like `placeholder` through the config.

## Visualization Types

### Input Types
- [text](./text.md) - Single line text input
- [textarea](./textarea.md) - Multi-line text input
- [number](./number.md) - Numeric input
- [email](./email.md) - Email input with validation
- [url](./url.md) - URL input with validation
- [tel](./tel.md) - Telephone number input
- [password](./password.md) - Password input with masking

### Selection Types
- [select](./select.md) - Dropdown selection (single)
- [multiSelect](./multi-select.md) - Dropdown selection (multiple)
- [radio](./radio.md) - Radio button group
- [checkbox](./checkbox.md) - Checkbox (single or multiple)
- [switch](./switch.md) - Toggle switch

### Advanced Types
- [slider](./slider.md) - Range slider
- [date](./date.md) - Date picker
- [datetime](./datetime.md) - Date and time picker
- [time](./time.md) - Time picker
- [color](./color.md) - Color picker

### Special Types
- [hidden](./hidden.md) - Hidden field
- [constant](./constant.md) - Read-only display field

## Common Config Properties

Some properties can be specified at the field level or in the config:

```typescript
{
  label: "Field Label",
  helperText: "Help text shown below the field",
  tooltip: "Tooltip shown on hover",
  defaultValue: "Default value if not provided",
  disabled: false,
  locked: false,
  conditions: { /* JSON rules conditions */ },
  config: {
    // Visualization-specific options
    placeholder: "Placeholder text",
    required: true,
    // ... other options
  }
}
```