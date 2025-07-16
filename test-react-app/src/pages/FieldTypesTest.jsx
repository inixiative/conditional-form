import React, { useState } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const fieldTypesSchema = {
  order: ['showFields', 'textField', 'emailField', 'numberField', 'sliderField', 'dateField', 'checkboxField', 'switchField', 'colorField'],
  fields: {
    showFields: [{
      label: 'Select fields to display',
      visualization: 'switch',
      conditions: true,
      disabled: false,
      locked: false,
      defaultValue: true
    }],
    textField: [{
      label: 'Text Input',
      visualization: 'text',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Enter some text...',
        required: true
      },
      tooltip: 'This is a basic text input field',
      helperText: 'You can enter any text here'
    }],
    emailField: [{
      label: 'Email Address',
      visualization: 'email',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'user@example.com'
      },
      helperText: 'Enter a valid email address'
    }],
    numberField: [{
      label: 'Age',
      visualization: 'number',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      defaultValue: 25,
      config: {
        min: 0,
        max: 120,
        placeholder: 'Enter your age'
      }
    }],
    sliderField: [{
      label: 'Satisfaction Level',
      visualization: 'slider',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      defaultValue: 50,
      config: {
        min: 0,
        max: 100,
        step: 10,
        showValue: true
      },
      helperText: 'Rate your satisfaction from 0 to 100'
    }],
    dateField: [{
      label: 'Birth Date',
      visualization: 'date',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      helperText: 'Select your birth date'
    }],
    checkboxField: [{
      label: 'Interests',
      visualization: 'checkbox',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      options: [
        { id: '1', label: 'Sports', value: 'sports', writeIn: false, conditions: true, helperText: 'All kinds of sports' },
        { id: '2', label: 'Music', value: 'music', writeIn: false, conditions: true, tooltip: 'Playing or listening' },
        { id: '3', label: 'Reading', value: 'reading', writeIn: false, conditions: true }
      ]
    }],
    switchField: [{
      label: 'Subscribe to newsletter',
      visualization: 'switch',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      defaultValue: false,
      helperText: 'Get weekly updates'
    }],
    colorField: [{
      label: 'Favorite Color',
      visualization: 'color',
      conditions: { field: 'showFields', operator: 'equals', value: true },
      disabled: false,
      locked: false,
      defaultValue: '#3b82f6'
    }]
  }
};

function FieldTypesTest() {
  const [values, setValues] = useState({})

  return (
    <div className="test-page">
      <h1>All Field Types</h1>
      <p className="test-description">
        This page demonstrates all available field types in the conditional form.
        Toggle the switch to show/hide all fields. Each field type has different configurations
        including tooltips, helper text, placeholders, and default values.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={fieldTypesSchema}
          values={values}
          onChange={setValues}
          components={defaultShadcnComponents}
        >
          <DynamicForm.Models />
          <DynamicForm.Options />
        </DynamicForm>
      </div>
      
      <div className="values-display">
        <h3>Current Form Values:</h3>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  )
}

export default FieldTypesTest