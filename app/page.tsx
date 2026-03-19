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
  recipeSteps?: string[]
  prepTime?: number
  mealType?: string
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
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  const meals = Object.values(mealsData.meals) as Meal[]

  const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']

  const categoryNames = {
    all: 'Sve',
    breakfast: 'Doručak',
    lunch: 'Ručak',
    dinner: 'Večera',
    snack: 'Užina'
  }

  const mealTypeLabels = {
    riba: { emoji: '🐟', label: 'RIBA' },
    piletina: { emoji: '🍗', label: 'PILETINA' },
    curetina: { emoji: '🦃', label: 'ĆURETINA' },
    junetina: { emoji: '🥩', label: 'JUNETINA' },
    jaja: { emoji: '🥚', label: 'JAJA' },
    povrce: { emoji: '🥬', label: 'POVRĆE' }
  }

  useEffect(() => {
    const today = new Date().getDay()
    setTodayDay(dayNames[today])
  }, [])

  useEffect(() => {
    const mealOverride = localStorage.getItem('mealOverride')
    const mealId = mealOverride || currentMealData.mealId
    const meal = meals.find(m => m.id === mealId)
    if (meal) {
      setCurrentMeal(meal)
      // Load checked ingredients for this meal
      const savedChecks = localStorage.getItem(`checks_${mealId}`)
      if (savedChecks) {
        setCheckedIngredients(new Set(JSON.parse(savedChecks)))
      } else {
        setCheckedIngredients(new Set())
      }
    }

    const storedHistory = localStorage.getItem('lunchHistory')
    if (storedHistory) {
      const history: LunchHistory = JSON.parse(storedHistory)
      const today = new Date().toISOString().split('T')[0]

      if (history.mealId === mealId) {
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(history.startDate).getTime()) / (1000 * 60 * 60 * 24))
        history.daysCount = daysDiff + 1
        setLunchHistory(history)
        localStorage.setItem('lunchHistory', JSON.stringify(history))
      } else {
        const newHistory = {
          mealId,
          startDate: today,
          daysCount: 1
        }
        setLunchHistory(newHistory)
        localStorage.setItem('lunchHistory', JSON.stringify(newHistory))
      }
    } else {
      const newHistory = {
        mealId,
        startDate: new Date().toISOString().split('T')[0],
        daysCount: 1
      }
      setLunchHistory(newHistory)
      localStorage.setItem('lunchHistory', JSON.stringify(newHistory))
    }

    const storedMealHistory = localStorage.getItem('mealHistory')
    if (storedMealHistory) {
      setMealHistory(JSON.parse(storedMealHistory))
    }
  }, [])

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)

    // Save to localStorage
    if (currentMeal) {
      localStorage.setItem(`checks_${currentMeal.id}`, JSON.stringify(Array.from(newChecked)))
    }
  }

  const getRandomLunch = () => {
    const lunchMeals = meals.filter(m => m.category === 'lunch')
    const availableLunches = lunchMeals.filter(m => !mealHistory.slice(-5).includes(m.id))

    if (availableLunches.length === 0) {
      return lunchMeals[Math.floor(Math.random() * lunchMeals.length)]
    }

    return availableLunches[Math.floor(Math.random() * availableLunches.length)]
  }

  const handleNewLunch = () => {
    // Always show confirmation
    setShowConfirm(true)
  }

  const changeLunch = () => {
    const newLunch = getRandomLunch()
    setCurrentMeal(newLunch)
    setCheckedIngredients(new Set())

    const today = new Date().toISOString().split('T')[0]
    const newHistory = {
      mealId: newLunch.id,
      startDate: today,
      daysCount: 1
    }
    setLunchHistory(newHistory)
    localStorage.setItem('lunchHistory', JSON.stringify(newHistory))

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

  const allIngredientsChecked = currentMeal
    ? checkedIngredients.size === currentMeal.ingredients.length
    : false

  const missingCount = currentMeal
    ? currentMeal.ingredients.length - checkedIngredients.size
    : 0

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
            <h2 className="meal-title-big">{currentMeal.name}</h2>

            <div className="meal-badges">
              <div className="category-badge">
                {currentMeal.category === 'lunch' && '🍽️ RUČAK'}
                {currentMeal.category === 'breakfast' && '🥐 DORUČAK'}
                {currentMeal.category === 'dinner' && '🌙 VEČERA'}
                {currentMeal.category === 'snack' && '🍎 UŽINA'}
              </div>

              {currentMeal.mealType && mealTypeLabels[currentMeal.mealType as keyof typeof mealTypeLabels] && (
                <div className="type-badge">
                  {mealTypeLabels[currentMeal.mealType as keyof typeof mealTypeLabels].emoji}{' '}
                  {mealTypeLabels[currentMeal.mealType as keyof typeof mealTypeLabels].label}
                </div>
              )}

              {currentMeal.prepTime && (
                <div className="time-badge">
                  ⏱️ {currentMeal.prepTime} min
                </div>
              )}
            </div>

            {currentMeal.category === 'lunch' && lunchHistory && (
              <div className="lunch-day-counter">
                Dan {lunchHistory.daysCount}/2
              </div>
            )}

            <div className="ingredients-section">
              <h3 className="section-title-big">Sastojci:</h3>

              <div className="ingredient-checklist">
                {currentMeal.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`ingredient-item ${checkedIngredients.has(index) ? 'checked' : ''}`}
                    onClick={() => toggleIngredient(index)}
                  >
                    <div className="checkbox">
                      {checkedIngredients.has(index) ? '✓' : '○'}
                    </div>
                    <div className="ingredient-text">{ingredient}</div>
                  </div>
                ))}
              </div>

              <div className={`ingredients-status ${allIngredientsChecked ? 'complete' : 'incomplete'}`}>
                {allIngredientsChecked ? (
                  <span className="status-complete">✓ Imate sve!</span>
                ) : (
                  <span className="status-incomplete">Nedostaje: {missingCount} {missingCount === 1 ? 'sastojak' : 'sastojaka'}</span>
                )}
              </div>
            </div>

            {currentMeal.recipeSteps && currentMeal.recipeSteps.length > 0 && (
              <div className="recipe-section">
                <h3 className="section-title-big">Priprema:</h3>
                <ol className="recipe-steps">
                  {currentMeal.recipeSteps.map((step, index) => (
                    <li key={index} className="recipe-step">{step}</li>
                  ))}
                </ol>
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
                <div className="meal-card-header">
                  <h3 className="meal-card-title">{meal.name}</h3>
                  {meal.prepTime && (
                    <div className="meal-card-time">⏱️ {meal.prepTime}min</div>
                  )}
                </div>
                <div className="meal-card-badges">
                  <span className="meal-card-category">
                    {categoryNames[meal.category as keyof typeof categoryNames]}
                  </span>
                  {meal.mealType && mealTypeLabels[meal.mealType as keyof typeof mealTypeLabels] && (
                    <span className="meal-card-type">
                      {mealTypeLabels[meal.mealType as keyof typeof mealTypeLabels].emoji}
                    </span>
                  )}
                </div>
                <div className="meal-card-ingredients">
                  {meal.ingredients.slice(0, 4).join(', ')}
                  {meal.ingredients.length > 4 && '...'}
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

            <div className="modal-badges">
              {selectedMeal.mealType && mealTypeLabels[selectedMeal.mealType as keyof typeof mealTypeLabels] && (
                <div className="type-badge">
                  {mealTypeLabels[selectedMeal.mealType as keyof typeof mealTypeLabels].emoji}{' '}
                  {mealTypeLabels[selectedMeal.mealType as keyof typeof mealTypeLabels].label}
                </div>
              )}
              {selectedMeal.prepTime && (
                <div className="time-badge">
                  ⏱️ {selectedMeal.prepTime} min
                </div>
              )}
            </div>

            <div>
              <h3 className="ingredients-title">Sastojci:</h3>
              <ul className="ingredients-list">
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {selectedMeal.recipeSteps && selectedMeal.recipeSteps.length > 0 && (
              <div className="recipe-section">
                <h3 className="recipe-title">Priprema:</h3>
                <ol className="recipe-steps-modal">
                  {selectedMeal.recipeSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            {lunchHistory && lunchHistory.daysCount >= 2 ? (
              <>
                <div className="confirm-icon">✓</div>
                <h3 className="confirm-title">
                  Odlično! Završili ste 2 dana zaredom sa ovim obrokom.
                </h3>
                <p className="confirm-subtitle">
                  Da li želite da promenite ručak ili da nastavite sa istim?
                </p>
              </>
            ) : (
              <>
                <div className="confirm-icon">🤔</div>
                <h3 className="confirm-title">
                  Da li ne želite ovaj obrok danas?
                </h3>
                <p className="confirm-subtitle">
                  Možete izabrati drugi ručak ako vam ovaj ne odgovara.
                </p>
              </>
            )}
            <div className="confirm-buttons">
              <button className="confirm-btn confirm-yes" onClick={changeLunch}>
                {lunchHistory && lunchHistory.daysCount >= 2 ? 'Promeni Ručak' : 'Da, Drugi Obrok'}
              </button>
              <button className="confirm-btn confirm-no" onClick={() => setShowConfirm(false)}>
                {lunchHistory && lunchHistory.daysCount >= 2 ? 'Nastavi Sa Ovim' : 'Ne, Ovaj je OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
