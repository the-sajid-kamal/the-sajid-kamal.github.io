import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import Contact from './components/Contact'
import XPTracker from './components/XPTracker'
import BadgeSystem from './components/BadgeSystem'

// Context
import { GameProvider } from './context/GameContext'

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-light-gray font-inter">
          <XPTracker />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <About />
                  <Portfolio />
                  <Services />
                  <Contact />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <BadgeSystem />
        </div>
      </Router>
    </GameProvider>
  )
}

export default App

