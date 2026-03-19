'use client'

import { useState } from 'react'
import mealsData from '@/data/meals.json'

interface Meal {
  id: string
  name: { sr: string; en: string }
  category: string
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const meals = Object.values(mealsData.meals) as Meal[]
  const ADMIN_PASSWORD = 'teki2026' // Change this to your desired password

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Pogrešna lozinka / Wrong password')
    }
  }

  const handleUpdateMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!selectedMeal) {
      setError('Molim izaberite obrok / Please select a meal')
      return
    }

    // In a real app, this would make an API call to update the JSON file
    // For now, we'll show a success message
    // You'll need to implement an API route to actually update the file

    try {
      const response = await fetch('/api/update-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealId: selectedMeal }),
      })

      if (response.ok) {
        setMessage('Obrok uspešno ažuriran! / Meal updated successfully!')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        throw new Error('Failed to update')
      }
    } catch (err) {
      setError('Greška pri ažuriranju / Error updating. Please update manually in data/current-meal.json')
    }
  }

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
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Izaberi Današnji Obrok<br />Select Today's Meal</h1>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleUpdateMeal}>
          <div className="form-group">
            <label className="form-label">Obrok / Meal</label>
            <select
              className="form-select"
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
            >
              <option value="">-- Izaberi / Select --</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.name.sr} / {meal.name.en}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Ažuriraj Obrok / Update Meal
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← Nazad / Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
