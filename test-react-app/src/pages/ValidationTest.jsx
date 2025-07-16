import React, { useState } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const validationSchema = {
  order: ['accountType', 'username', 'email', 'age', 'businessName', 'employeeCount'],
  fields: {
    accountType: [{
      label: 'Account Type',
      visualization: 'radio',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      options: [
        { id: '1', label: 'Personal', value: 'personal', writeIn: false, conditions: true },
        { id: '2', label: 'Business', value: 'business', writeIn: false, conditions: true }
      ]
    }],
    username: [{
      label: 'Username',
      visualization: 'text',
      conditions: true,
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Choose a username',
        required: true
      },
      helperText: 'Must be at least 3 characters'
    }],
    email: [{
      label: 'Email',
      visualization: 'email',
      conditions: true,
      disabled: false,
      locked: false,
      config: {
        placeholder: 'your@email.com',
        required: true
      }
    }],
    age: [{
      label: 'Age',
      visualization: 'number',
      conditions: { field: 'accountType', operator: 'equals', value: 'personal' },
      disabled: false,
      locked: false,
      config: {
        min: 18,
        max: 120,
        required: true
      },
      helperText: 'Must be 18 or older'
    }],
    businessName: [{
      label: 'Business Name',
      visualization: 'text',
      conditions: { field: 'accountType', operator: 'equals', value: 'business' },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Your Company Inc.',
        required: true
      }
    }],
    employeeCount: [{
      label: 'Number of Employees',
      visualization: 'select',
      conditions: { field: 'accountType', operator: 'equals', value: 'business' },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Select range',
        required: true
      },
      options: [
        { id: '3', label: '1-10', value: 'small', writeIn: false, conditions: true },
        { id: '4', label: '11-50', value: 'medium', writeIn: false, conditions: true },
        { id: '5', label: '51-200', value: 'large', writeIn: false, conditions: true },
        { id: '6', label: '200+', value: 'enterprise', writeIn: false, conditions: true }
      ]
    }]
  }
};

function ValidationTest() {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  // Simple validation example
  const validateForm = () => {
    const newErrors = {}
    
    if (!values.username || values.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!values.email || !values.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (values.accountType === 'personal' && (!values.age || values.age < 18)) {
      newErrors.age = 'You must be 18 or older'
    }
    
    if (values.accountType === 'business') {
      if (!values.businessName) {
        newErrors.businessName = 'Business name is required'
      }
      if (!values.employeeCount) {
        newErrors.employeeCount = 'Please select employee count'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="test-page">
      <h1>Form Validation</h1>
      <p className="test-description">
        This demonstrates how validation can work with conditional forms.
        Different fields have different validation rules. Required fields are marked
        and validation happens when you click the validate button.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={validationSchema}
          values={values}
          onChange={setValues}
          components={defaultShadcnComponents}
        >
          <DynamicForm.Models />
          <DynamicForm.Options />
        </DynamicForm>
        
        <button 
          onClick={validateForm}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Validate Form
        </button>
      </div>
      
      {Object.keys(errors).length > 0 && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#c00' }}>Validation Errors:</h4>
          {Object.entries(errors).map(([field, error]) => (
            <div key={field} style={{ color: '#c00', fontSize: '14px' }}>
              {field}: {error}
            </div>
          ))}
        </div>
      )}
      
      <div className="values-display">
        <h3>Current Form Values:</h3>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ValidationTest