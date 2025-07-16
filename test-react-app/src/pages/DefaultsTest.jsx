import React, { useState } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const defaultsSchema = {
  order: ['category', 'productName', 'quantity', 'urgency', 'notes'],
  fields: {
    category: [{
      label: 'Product Category',
      visualization: 'select',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      defaultValue: 'electronics',
      config: { placeholder: 'Choose a category' },
      options: [
        { id: '1', label: 'Electronics', value: 'electronics', writeIn: false, conditions: true },
        { id: '2', label: 'Clothing', value: 'clothing', writeIn: false, conditions: true },
        { id: '3', label: 'Food', value: 'food', writeIn: false, conditions: true }
      ]
    }],
    productName: [{
      label: 'Product Name',
      visualization: 'text',
      conditions: true,
      disabled: false,
      locked: false,
      defaultValue: 'New Product',
      config: {
        placeholder: 'Enter product name...'
      }
    }],
    quantity: [{
      label: 'Quantity',
      visualization: 'number',
      conditions: { field: 'category', operator: 'in', value: ['electronics', 'clothing'] },
      disabled: false,
      locked: false,
      defaultValue: 1,
      config: {
        min: 1,
        max: 100
      },
      helperText: 'Default quantity is 1'
    }],
    urgency: [{
      label: 'Order Urgency',
      visualization: 'radio',
      conditions: { field: 'category', operator: 'equals', value: 'food' },
      disabled: false,
      locked: false,
      defaultValue: 'normal',
      options: [
        { id: '4', label: 'Low', value: 'low', writeIn: false, conditions: true },
        { id: '5', label: 'Normal', value: 'normal', writeIn: false, conditions: true },
        { id: '6', label: 'High', value: 'high', writeIn: false, conditions: true }
      ]
    }],
    notes: [{
      label: 'Additional Notes',
      visualization: 'textarea',
      conditions: true,
      disabled: false,
      locked: false,
      defaultValue: 'Please handle with care.',
      config: {
        placeholder: 'Any special instructions...',
        rows: 4
      }
    }]
  }
};

function DefaultsTest() {
  const [values, setValues] = useState({})

  return (
    <div className="test-page">
      <h1>Default Values Test</h1>
      <p className="test-description">
        This test demonstrates how default values work in conditional forms.
        Notice how fields come pre-populated with default values, and when you change
        the category, conditional fields appear with their own defaults.
        Try changing from Electronics to Food to see how the urgency field appears
        with "Normal" pre-selected.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={defaultsSchema}
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

export default DefaultsTest