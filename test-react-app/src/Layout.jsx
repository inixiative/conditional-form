import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const navigation = [
  { name: 'Basic Conditional Form', path: '/' },
  { name: 'Complex Dependencies', path: '/complex' },
  { name: 'All Field Types', path: '/field-types' },
  { name: 'Form Validation', path: '/validation' },
  { name: 'Default Values', path: '/defaults' },
  { name: 'Dynamic Options', path: '/dynamic-options' },
]

function Layout() {
  return (
    <div className="layout">
      <aside className="sidenav">
        <div className="sidenav-header">
          <h2>Conditional Form Tests</h2>
          <p>Test different scenarios</p>
        </div>
        <nav className="sidenav-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidenav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout