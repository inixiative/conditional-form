# Testing the React Components

## Quick Start

### 1. Using Bun/Node.js

```bash
# Install dependencies
bun install react react-dom
# or
npm install react react-dom

# Run the example
bun run src/react/example.tsx
```

### 2. Using a React App

Create a new React app and import the components:

```tsx
import { DynamicForm, defaultShadcnComponents } from 'conditional-form';

function App() {
  const [values, setValues] = useState({});
  
  return (
    <DynamicForm
      schema={yourSchema}
      values={values}
      onChange={setValues}
      components={defaultShadcnComponents}
    >
      <DynamicForm.Models />
      <DynamicForm.Options />
    </DynamicForm>
  );
}
```

### 3. Using the Test HTML File

Open `test-react.html` in a browser. This provides a standalone test without build tools.

## Testing Different Scenarios

### Basic Test
```tsx
// Minimal schema to test basic functionality
const schema = {
  order: ['model', 'option'],
  fields: {
    model: [{
      label: 'Select Model',
      visualization: 'radio',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      options: [
        { id: '1', label: 'Option A', value: 'a', conditions: true },
        { id: '2', label: 'Option B', value: 'b', conditions: true }
      ]
    }],
    option: [{
      label: 'Dependent Field',
      visualization: 'text',
      conditions: { field: 'model', operator: 'equals', value: 'a' },
      disabled: false,
      locked: false
    }]
  }
};
```

### Testing Conditions
```tsx
// Test that fields appear/disappear based on conditions
const [values, setValues] = useState({ gameId: 'chess' });

// Change gameId and verify dependent fields update
setValues({ gameId: 'poker' });
```

### Testing Custom Components
```tsx
// Override default components
const customComponents = {
  ...defaultShadcnComponents,
  Input: MyCustomInput,
  Select: MyCustomSelect
};

<DynamicForm
  schema={schema}
  values={values}
  onChange={onChange}
  components={customComponents}
/>
```

### Testing Validation
```tsx
import { validateFormSubmission } from 'conditional-form';

const result = validateFormSubmission(values, models);
if (result.errors) {
  console.log('Validation errors:', result.errors);
}
```

## Integration with Existing Projects

### Next.js
```tsx
// pages/form-test.tsx
import dynamic from 'next/dynamic';

const DynamicForm = dynamic(
  () => import('conditional-form').then(mod => mod.DynamicForm),
  { ssr: false }
);
```

### Vite
```tsx
// vite.config.ts
export default {
  optimizeDeps: {
    include: ['conditional-form']
  }
};
```

### Create React App
```tsx
import { DynamicForm } from 'conditional-form';
// Works out of the box
```

## Debugging

### Enable Console Logging
```tsx
// The components log warnings for condition evaluation failures
// Check browser console for details
```

### Inspect Field Dependencies
```tsx
import { extractDependencies } from 'conditional-form';

const deps = extractDependencies(field.conditions);
console.log(`Field depends on:`, Array.from(deps));
```

### Performance Monitoring
```tsx
// Use React DevTools Profiler to check re-renders
// Fields should only re-render when their dependencies change
```

## Common Issues

1. **Fields not showing**: Check condition syntax and ensure json-rules operators are correct
2. **Components not styled**: Make sure to include CSS or use the default components
3. **Type errors**: Ensure TypeScript is configured with `"jsx": "react"` in tsconfig