'use client'

import { useState, useEffect } from 'react'
import mealsData from '@/data/meals.json'

interface Meal {
  id: string
  name: string
  category: string
  ingredients: string[]
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentLunch, setCurrentLunch] = useState<Meal | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'lunch'>('lunch')

  const meals = Object.values(mealsData.meals) as Meal[]
  const ADMIN_PASSWORD = 'teki2026'

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }

    // Load current lunch
    const storedOverride = localStorage.getItem('mealOverride')
    if (storedOverride) {
      const meal = meals.find(m => m.id === storedOverride)
      if (meal) {
        setCurrentLunch(meal)
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Pogrešna lozinka')
    }
  }

  const handleSelectLunch = (meal: Meal) => {
    // Save to localStorage - this will override the default meal
    localStorage.setItem('mealOverride', meal.id)

    // Reset lunch history to start fresh with new lunch
    const today = new Date().toISOString().split('T')[0]
    const newHistory = {
      mealId: meal.id,
      startDate: today,
      daysCount: 1
    }
    localStorage.setItem('lunchHistory', JSON.stringify(newHistory))

    setCurrentLunch(meal)
    setMessage(`✓ Obrok postavljen: ${meal.name}`)

    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const lunchMeals = meals.filter(m => m.category === 'lunch')
  const displayMeals = filter === 'lunch' ? lunchMeals : meals

  const categoryNames = {
    breakfast: 'Doručak',
    lunch: 'Ručak',
    dinner: 'Večera',
    snack: 'Užina'
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h1 className="admin-title">Admin Login</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Lozinka</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Unesi lozinku"
                autoFocus
              />
            </div>
            <button type="submit" className="btn">
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-main-title">Admin Panel</h1>
        <a href="/" className="back-link">← Nazad</a>
      </div>

      {message && <div className="success-message-floating">{message}</div>}

      <div className="current-lunch-display">
        <h2 className="section-title">Trenutni Ručak:</h2>
        {currentLunch ? (
          <div className="current-lunch-card">
            <h3>{currentLunch.name}</h3>
            <div className="ingredients-preview">
              {currentLunch.ingredients.slice(0, 4).join(', ')}
              {currentLunch.ingredients.length > 4 && '...'}
            </div>
          </div>
        ) : (
          <p className="no-lunch-text">Nema postavljenog ručka</p>
        )}
      </div>

      <div className="filter-section">
        <h2 className="section-title">Izaberi Novi Ručak:</h2>
        <div className="filter-buttons">
          <button
            className={`filter-toggle ${filter === 'lunch' ? 'active' : ''}`}
            onClick={() => setFilter('lunch')}
          >
            Samo Ručkovi ({lunchMeals.length})
          </button>
          <button
            className={`filter-toggle ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Svi Obroci ({meals.length})
          </button>
        </div>
      </div>

      <div className="meals-admin-grid">
        {displayMeals.map((meal) => (
          <div
            key={meal.id}
            className={`admin-meal-card ${currentLunch?.id === meal.id ? 'selected' : ''}`}
            onClick={() => handleSelectLunch(meal)}
          >
            {currentLunch?.id === meal.id && (
              <div className="selected-badge">✓ Trenutno</div>
            )}
            <h3 className="admin-meal-title">{meal.name}</h3>
            <div className="admin-meal-category">
              {meal.category === 'lunch' && '🍽️ Ručak'}
              {meal.category === 'breakfast' && '🥐 Doručak'}
              {meal.category === 'dinner' && '🌙 Večera'}
              {meal.category === 'snack' && '🍎 Užina'}
            </div>
            <div className="admin-ingredients">
              {meal.ingredients.slice(0, 3).map((ing, i) => (
                <span key={i} className="ingredient-tag">{ing}</span>
              ))}
              {meal.ingredients.length > 3 && (
                <span className="more-tag">+{meal.ingredients.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
