'use client'

import { useState, useEffect } from 'react'
import mealsData from '@/data/meals.json'

interface Meal {
  id: string
  name: { sr: string; en: string }
  category: string
  ingredients: { sr: string[]; en: string[] }
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
      setError('Pogrešna lozinka / Wrong password')
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
    setMessage(`✓ Obrok postavljen: ${meal.name.sr} / Meal set: ${meal.name.en}`)

    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const lunchMeals = meals.filter(m => m.category === 'lunch')
  const displayMeals = filter === 'lunch' ? lunchMeals : meals

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h1 className="admin-title">Admin Login</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Password / Lozinka</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button type="submit" className="btn">
              Login
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
        <a href="/" className="back-link">← Nazad / Back</a>
      </div>

      {message && <div className="success-message-floating">{message}</div>}

      <div className="current-lunch-display">
        <h2 className="section-title">Trenutni Ručak / Current Lunch:</h2>
        {currentLunch ? (
          <div className="current-lunch-card">
            <h3>{currentLunch.name.sr}</h3>
            <p className="en-name">{currentLunch.name.en}</p>
            <div className="ingredients-preview">
              {currentLunch.ingredients.sr.slice(0, 4).join(', ')}
              {currentLunch.ingredients.sr.length > 4 && '...'}
            </div>
          </div>
        ) : (
          <p className="no-lunch-text">Nema postavljenog ručka / No lunch set</p>
        )}
      </div>

      <div className="filter-section">
        <h2 className="section-title">Izaberi Novi Ručak / Select New Lunch:</h2>
        <div className="filter-buttons">
          <button
            className={`filter-toggle ${filter === 'lunch' ? 'active' : ''}`}
            onClick={() => setFilter('lunch')}
          >
            Samo Ručkovi / Lunches Only ({lunchMeals.length})
          </button>
          <button
            className={`filter-toggle ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Svi Obroci / All Meals ({meals.length})
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
              <div className="selected-badge">✓ Trenutno / Current</div>
            )}
            <h3 className="admin-meal-title">{meal.name.sr}</h3>
            <p className="admin-meal-subtitle">{meal.name.en}</p>
            <div className="admin-meal-category">
              {meal.category === 'lunch' && '🍽️ Ručak / Lunch'}
              {meal.category === 'breakfast' && '🥐 Doručak / Breakfast'}
              {meal.category === 'dinner' && '🌙 Večera / Dinner'}
              {meal.category === 'snack' && '🍎 Užina / Snack'}
            </div>
            <div className="admin-ingredients">
              {meal.ingredients.sr.slice(0, 3).map((ing, i) => (
                <span key={i} className="ingredient-tag">{ing}</span>
              ))}
              {meal.ingredients.sr.length > 3 && (
                <span className="more-tag">+{meal.ingredients.sr.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
