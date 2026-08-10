import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Calendrier from './pages/Calendrier.jsx'
import Journal from './pages/Journal.jsx'
import Statistiques from './pages/Statistiques.jsx'
import Parametres from './pages/Parametres.jsx'
import PullToRefresh from './components/PullToRefresh.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>Mon Cycle</h1>
      </header>

      <PullToRefresh className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/stats" element={<Statistiques />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
      </PullToRefresh>

      <nav className="tabbar">
        <NavLink to="/" end className="tab">
          <span className="tab-icon">●</span>
          <span>Accueil</span>
        </NavLink>
        <NavLink to="/calendrier" className="tab">
          <span className="tab-icon">▦</span>
          <span>Calendrier</span>
        </NavLink>
        <NavLink to="/journal" className="tab">
          <span className="tab-icon">✎</span>
          <span>Journal</span>
        </NavLink>
        <NavLink to="/stats" className="tab">
          <span className="tab-icon">▲</span>
          <span>Stats</span>
        </NavLink>
        <NavLink to="/parametres" className="tab">
          <span className="tab-icon">♥</span>
          <span>Santé</span>
        </NavLink>
      </nav>
    </div>
  )
}
