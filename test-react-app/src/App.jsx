import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import BasicTest from './pages/BasicTest'
import ComplexTest from './pages/ComplexTest'
import FieldTypesTest from './pages/FieldTypesTest'
import ValidationTest from './pages/ValidationTest'
import DefaultsTest from './pages/DefaultsTest'
import DynamicOptionsTest from './pages/DynamicOptionsTest'
import './App.css'
import './shadcn-defaults.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BasicTest />} />
          <Route path="complex" element={<ComplexTest />} />
          <Route path="field-types" element={<FieldTypesTest />} />
          <Route path="validation" element={<ValidationTest />} />
          <Route path="defaults" element={<DefaultsTest />} />
          <Route path="dynamic-options" element={<DynamicOptionsTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App