import React, { useState } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const dynamicOptionsSchema = {
  order: ['country', 'state', 'city', 'postalCode'],
  fields: {
    country: [{
      label: 'Country',
      visualization: 'select',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      config: { placeholder: 'Select country' },
      options: [
        { id: '1', label: 'United States', value: 'us', writeIn: false, conditions: true },
        { id: '2', label: 'Canada', value: 'ca', writeIn: false, conditions: true },
        { id: '3', label: 'United Kingdom', value: 'uk', writeIn: false, conditions: true }
      ]
    }],
    state: [{
      label: 'State/Province',
      visualization: 'select',
      conditions: { field: 'country', operator: 'in', value: ['us', 'ca'] },
      disabled: false,
      locked: false,
      config: { placeholder: 'Select state/province' },
      options: [
        // US States
        { id: '4', label: 'California', value: 'CA', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'us' } },
        { id: '5', label: 'New York', value: 'NY', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'us' } },
        { id: '6', label: 'Texas', value: 'TX', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'us' } },
        // Canadian Provinces
        { id: '7', label: 'Ontario', value: 'ON', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'ca' } },
        { id: '8', label: 'Quebec', value: 'QC', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'ca' } },
        { id: '9', label: 'British Columbia', value: 'BC', writeIn: false, 
          conditions: { field: 'country', operator: 'equals', value: 'ca' } }
      ]
    }],
    city: [{
      label: 'City',
      visualization: 'select',
      conditions: {
        or: [
          { field: 'state', operator: 'in', value: ['CA', 'NY', 'TX'] },
          { field: 'state', operator: 'in', value: ['ON', 'QC', 'BC'] },
          { field: 'country', operator: 'equals', value: 'uk' }
        ]
      },
      disabled: false,
      locked: false,
      config: { placeholder: 'Select city' },
      options: [
        // California cities
        { id: '10', label: 'Los Angeles', value: 'la', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'CA' } },
        { id: '11', label: 'San Francisco', value: 'sf', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'CA' } },
        // New York cities
        { id: '12', label: 'New York City', value: 'nyc', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'NY' } },
        { id: '13', label: 'Buffalo', value: 'buffalo', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'NY' } },
        // Texas cities
        { id: '14', label: 'Houston', value: 'houston', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'TX' } },
        { id: '15', label: 'Austin', value: 'austin', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'TX' } },
        // Ontario cities
        { id: '16', label: 'Toronto', value: 'toronto', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'ON' } },
        { id: '17', label: 'Ottawa', value: 'ottawa', writeIn: false,
          conditions: { field: 'state', operator: 'equals', value: 'ON' } },
        // UK cities
        { id: '18', label: 'London', value: 'london', writeIn: false,
          conditions: { field: 'country', operator: 'equals', value: 'uk' } },
        { id: '19', label: 'Manchester', value: 'manchester', writeIn: false,
          conditions: { field: 'country', operator: 'equals', value: 'uk' } }
      ]
    }],
    postalCode: [{
      label: 'Postal/ZIP Code',
      visualization: 'text',
      conditions: {
        or: [
          { field: 'country', operator: 'equals', value: 'us' },
          { field: 'country', operator: 'equals', value: 'ca' },
          { field: 'country', operator: 'equals', value: 'uk' }
        ]
      },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Enter postal code'
      },
      helperText: 'Format varies by country',
      tooltip: 'US: 12345, Canada: A1B 2C3, UK: SW1A 1AA'
    }]
  }
};

function DynamicOptionsTest() {
  const [values, setValues] = useState({})

  return (
    <div className="test-page">
      <h1>Dynamic Options</h1>
      <p className="test-description">
        This demonstrates how options themselves can have conditions, creating dynamic cascading dropdowns.
        Select a country to see different states/provinces, then select a state to see cities specific to that state.
        Notice how UK doesn't have states but goes directly to cities.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={dynamicOptionsSchema}
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

export default DynamicOptionsTest