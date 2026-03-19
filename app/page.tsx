'use client'

import { useState, useEffect } from 'react'
import mealsData from '@/data/meals.json'
import currentMealData from '@/data/current-meal.json'

type Tab = 'today' | 'all'
type Category = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface Meal {
  id: string
  name: string
  category: string
  ingredients: string[]
  recipe?: string
}

interface LunchHistory {
  mealId: string
  startDate: string
  daysCount: number
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('today')
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null)
  const [category, setCategory] = useState<Category>('all')
  const [lunchHistory, setLunchHistory] = useState<LunchHistory | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [todayDay, setTodayDay] = useState('')
  const [mealHistory, setMealHistory] = useState<string[]>([])

  const meals = Object.values(mealsData.meals) as Meal[]

  const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']

  const categoryNames = {
    all: 'Sve',
    breakfast: 'Doručak',
    lunch: 'Ručak',
    dinner: 'Večera',
    snack: 'Užina'
  }

  // Get today's day name
  useEffect(() => {
    const today = new Date().getDay()
    setTodayDay(dayNames[today])
  }, [])

  useEffect(() => {
    // Check for admin override first, then fall back to default
    const mealOverride = localStorage.getItem('mealOverride')
    const mealId = mealOverride || currentMealData.mealId
    const meal = meals.find(m => m.id === mealId)
    if (meal) {
      setCurrentMeal(meal)
    }

    // Load lunch history from localStorage
    const storedHistory = localStorage.getItem('lunchHistory')
    if (storedHistory) {
      const history: LunchHistory = JSON.parse(storedHistory)
      const today = new Date().toISOString().split('T')[0]

      // Check if we need to increment day count
      if (history.mealId === mealId) {
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(history.startDate).getTime()) / (1000 * 60 * 60 * 24))
        history.daysCount = daysDiff + 1
        setLunchHistory(history)
        localStorage.setItem('lunchHistory', JSON.stringify(history))
      } else {
        // New lunch started
        const newHistory = {
          mealId,
          startDate: today,
          daysCount: 1
        }
        setLunchHistory(newHistory)
        localStorage.setItem('lunchHistory', JSON.stringify(newHistory))
      }
    } else {
      // First time - initialize
      const newHistory = {
        mealId,
        startDate: new Date().toISOString().split('T')[0],
        daysCount: 1
      }
      setLunchHistory(newHistory)
      localStorage.setItem('lunchHistory', JSON.stringify(newHistory))
    }

    // Load meal history
    const storedMealHistory = localStorage.getItem('mealHistory')
    if (storedMealHistory) {
      setMealHistory(JSON.parse(storedMealHistory))
    }
  }, [])

  const getRandomLunch = () => {
    const lunchMeals = meals.filter(m => m.category === 'lunch')
    // Filter out recently used meals (last 5)
    const availableLunches = lunchMeals.filter(m => !mealHistory.slice(-5).includes(m.id))

    if (availableLunches.length === 0) {
      // If all meals have been used, reset and use all lunches
      return lunchMeals[Math.floor(Math.random() * lunchMeals.length)]
    }

    return availableLunches[Math.floor(Math.random() * availableLunches.length)]
  }

  const handleNewLunch = () => {
    if (lunchHistory && lunchHistory.daysCount >= 2) {
      setShowConfirm(true)
    } else {
      changeLunch()
    }
  }

  const changeLunch = () => {
    const newLunch = getRandomLunch()
    setCurrentMeal(newLunch)

    const today = new Date().toISOString().split('T')[0]
    const newHistory = {
      mealId: newLunch.id,
      startDate: today,
      daysCount: 1
    }
    setLunchHistory(newHistory)
    localStorage.setItem('lunchHistory', JSON.stringify(newHistory))

    // Update meal history
    const updatedMealHistory = [...mealHistory, newLunch.id]
    setMealHistory(updatedMealHistory)
    localStorage.setItem('mealHistory', JSON.stringify(updatedMealHistory))

    setShowConfirm(false)
  }

  const filteredMeals = category === 'all'
    ? meals
    : meals.filter(m => m.category === category)

  const sortedMeals = [...filteredMeals].sort((a, b) => {
    const categoryOrder = { breakfast: 1, snack: 2, lunch: 3, dinner: 4 }
    return (categoryOrder[a.category as keyof typeof categoryOrder] || 99) -
           (categoryOrder[b.category as keyof typeof categoryOrder] || 99)
  })

  return (
    <div className="container">
      <div className="header">
        <h1>Teki Obroci</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'today' ? 'active' : ''}`}
          onClick={() => setTab('today')}
        >
          Danas
        </button>
        <button
          className={`tab ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          Svi Obroci
        </button>
      </div>

      {tab === 'today' && currentMeal && (
        <>
          <div className="today-info">
            {todayDay && (
              <div className="today-day">
                {todayDay}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="meal-title">{currentMeal.name}</h2>

            {currentMeal.category === 'lunch' && lunchHistory && (
              <div className="lunch-day-counter">
                Dan {lunchHistory.daysCount}/2
              </div>
            )}

            <div>
              <h3 className="ingredients-title">Sastojci:</h3>
              <ul className="ingredients-list">
                {currentMeal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {currentMeal.recipe && (
              <div className="recipe-section">
                <h3 className="recipe-title">Recept:</h3>
                <p className="recipe-text">{currentMeal.recipe}</p>
              </div>
            )}
          </div>

          {currentMeal.category === 'lunch' && (
            <button className="new-lunch-btn" onClick={handleNewLunch}>
              Novi Ručak
            </button>
          )}
        </>
      )}

      {tab === 'all' && (
        <>
          <div className="category-filter">
            {Object.keys(categoryNames).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat as Category)}
              >
                {categoryNames[cat as keyof typeof categoryNames]}
              </button>
            ))}
          </div>

          <div className="meals-grid">
            {sortedMeals.map((meal) => (
              <div
                key={meal.id}
                className="meal-card"
                onClick={() => setSelectedMeal(meal)}
              >
                <h3 className="meal-card-title">{meal.name}</h3>
                <span className="meal-card-category">
                  {categoryNames[meal.category as keyof typeof categoryNames]}
                </span>
                <div className="meal-card-ingredients">
                  {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)}>
              ×
            </button>
            <h2 className="meal-title">{selectedMeal.name}</h2>

            <div>
              <h3 className="ingredients-title">Sastojci:</h3>
              <ul className="ingredients-list">
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {selectedMeal.recipe && (
              <div className="recipe-section">
                <h3 className="recipe-title">Recept:</h3>
                <p className="recipe-text">{selectedMeal.recipe}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">
              Da li ste sigurni da želite novi ručak? Već ste završili dva dana zaredom sa ovim obrokom.
            </h3>
            <div className="confirm-buttons">
              <button className="confirm-btn confirm-yes" onClick={changeLunch}>
                Da
              </button>
              <button className="confirm-btn confirm-no" onClick={() => setShowConfirm(false)}>
                Ne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
