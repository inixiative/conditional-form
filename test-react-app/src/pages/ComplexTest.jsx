import React, { useState } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const complexSchema = {
  order: ['transport', 'vehicleType', 'fuelType', 'bikeType', 'publicType', 'trainClass'],
  fields: {
    transport: [{
      label: 'Mode of Transportation',
      visualization: 'radio',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      options: [
        { id: '1', label: 'Car', value: 'car', writeIn: false, conditions: true },
        { id: '2', label: 'Bicycle', value: 'bicycle', writeIn: false, conditions: true },
        { id: '3', label: 'Public Transport', value: 'public', writeIn: false, conditions: true }
      ]
    }],
    vehicleType: [{
      label: 'Vehicle Type',
      visualization: 'select',
      conditions: { field: 'transport', operator: 'equals', value: 'car' },
      disabled: false,
      locked: false,
      config: { placeholder: 'Select vehicle type' },
      options: [
        { id: '4', label: 'Sedan', value: 'sedan', writeIn: false, conditions: true },
        { id: '5', label: 'SUV', value: 'suv', writeIn: false, conditions: true },
        { id: '6', label: 'Electric', value: 'electric', writeIn: false, conditions: true }
      ]
    }],
    fuelType: [{
      label: 'Fuel Type',
      visualization: 'radio',
      conditions: {
        and: [
          { field: 'transport', operator: 'equals', value: 'car' },
          { field: 'vehicleType', operator: 'in', value: ['sedan', 'suv'] }
        ]
      },
      disabled: false,
      locked: false,
      options: [
        { id: '7', label: 'Gasoline', value: 'gas', writeIn: false, conditions: true },
        { id: '8', label: 'Diesel', value: 'diesel', writeIn: false, conditions: true },
        { id: '9', label: 'Hybrid', value: 'hybrid', writeIn: false, conditions: true }
      ]
    }],
    bikeType: [{
      label: 'Bicycle Type',
      visualization: 'select',
      conditions: { field: 'transport', operator: 'equals', value: 'bicycle' },
      disabled: false,
      locked: false,
      config: { placeholder: 'Select bike type' },
      options: [
        { id: '10', label: 'Road Bike', value: 'road', writeIn: false, conditions: true },
        { id: '11', label: 'Mountain Bike', value: 'mountain', writeIn: false, conditions: true },
        { id: '12', label: 'E-Bike', value: 'ebike', writeIn: false, conditions: true }
      ]
    }],
    publicType: [{
      label: 'Public Transport Type',
      visualization: 'radio',
      conditions: { field: 'transport', operator: 'equals', value: 'public' },
      disabled: false,
      locked: false,
      options: [
        { id: '13', label: 'Bus', value: 'bus', writeIn: false, conditions: true },
        { id: '14', label: 'Train', value: 'train', writeIn: false, conditions: true },
        { id: '15', label: 'Subway', value: 'subway', writeIn: false, conditions: true }
      ]
    }],
    trainClass: [{
      label: 'Train Class',
      visualization: 'select',
      conditions: {
        and: [
          { field: 'transport', operator: 'equals', value: 'public' },
          { field: 'publicType', operator: 'equals', value: 'train' }
        ]
      },
      disabled: false,
      locked: false,
      defaultValue: 'economy',
      config: { placeholder: 'Select class' },
      options: [
        { id: '16', label: 'Economy', value: 'economy', writeIn: false, conditions: true },
        { id: '17', label: 'Business', value: 'business', writeIn: false, conditions: true },
        { id: '18', label: 'First Class', value: 'first', writeIn: false, conditions: true }
      ]
    }]
  }
};

function ComplexTest() {
  const [values, setValues] = useState({})

  return (
    <div className="test-page">
      <h1>Complex Dependencies</h1>
      <p className="test-description">
        This test demonstrates complex conditional logic with multiple dependencies.
        Fields can depend on multiple other fields using AND/OR conditions.
        Try selecting Car → Sedan/SUV to see the fuel type options, or Public Transport → Train to see class options.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={complexSchema}
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

export default ComplexTest