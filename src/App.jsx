import React from 'react'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import { SidebarProvider } from './context/SidebarContext'
import { FilterProvider } from './context/FilterContext'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Historial from './pages/Historial'
import Reportes from './pages/Reportes'
import Ayuda from './pages/Ayuda'

function AppContent() {
  return (
    <div className="app">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </SidebarProvider>
  )
}

export default App
