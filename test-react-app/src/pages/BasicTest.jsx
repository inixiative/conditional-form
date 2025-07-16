import React, { useState, useEffect } from 'react'
import { DynamicForm, defaultShadcnComponents } from '@inixiative/conditional-form/react'

const basicSchema = {
  order: ['game', 'difficulty', 'playerCount'],
  fields: {
    game: [{
      label: 'Select Game',
      visualization: 'radio',
      conditions: true,
      disabled: false,
      locked: false,
      isModel: true,
      options: [
        { 
          id: '1', 
          label: 'Chess', 
          value: 'chess', 
          writeIn: false, 
          conditions: true 
        },
        { 
          id: '2', 
          label: 'Checkers', 
          value: 'checkers', 
          writeIn: false, 
          conditions: true 
        }
      ]
    }],
    difficulty: [{
      label: 'Difficulty Level',
      visualization: 'select',
      conditions: { field: 'game', operator: 'equals', value: 'chess' },
      disabled: false,
      locked: false,
      config: {
        placeholder: 'Choose difficulty'
      },
      options: [
        { 
          id: '3', 
          label: 'Easy', 
          value: 'easy', 
          writeIn: false, 
          conditions: true 
        },
        { 
          id: '4', 
          label: 'Medium', 
          value: 'medium', 
          writeIn: false, 
          conditions: true 
        },
        { 
          id: '5', 
          label: 'Hard', 
          value: 'hard', 
          writeIn: false, 
          conditions: true 
        }
      ]
    }],
    playerCount: [{
      label: 'Number of Players',
      visualization: 'number',
      conditions: { field: 'game', operator: 'equals', value: 'checkers' },
      disabled: false,
      locked: false,
      defaultValue: 2,
      config: {
        min: 2,
        max: 4,
        placeholder: 'Enter number of players'
      }
    }]
  }
};

function BasicTest() {
  const [values, setValues] = useState({})
  
  useEffect(() => {
    console.log('Form values updated:', values)
  }, [values])

  return (
    <div className="test-page">
      <h1>Basic Conditional Form</h1>
      <p className="test-description">
        This demonstrates the most basic conditional form functionality. 
        Select "Chess" to see difficulty options, or "Checkers" to see player count input.
        Notice how default values are set and fields are cleaned up when hidden.
      </p>
      
      <div className="form-container">
        <DynamicForm
          schema={basicSchema}
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

export default BasicTest