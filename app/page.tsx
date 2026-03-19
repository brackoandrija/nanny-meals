'use client'

import { useState, useEffect } from 'react'
import mealsData from '@/data/meals.json'
import currentMealData from '@/data/current-meal.json'

type Language = 'sr' | 'en'
type Tab = 'today' | 'all'
type Category = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface Meal {
  id: string
  name: { sr: string; en: string }
  category: string
  ingredients: { sr: string[]; en: string[] }
  recipe?: { sr: string; en: string }
}

const translations = {
  sr: {
    title: 'Teki Obroci',
    todayTab: 'Danas',
    allTab: 'Svi Obroci',
    todayMeal: 'Današnji Obrok',
    ingredients: 'Sastojci',
    recipe: 'Recept',
    allMeals: 'Svi Obroci',
    categories: {
      all: 'Sve',
      breakfast: 'Doručak',
      lunch: 'Ručak',
      dinner: 'Večera',
      snack: 'Užina'
    }
  },
  en: {
    title: 'Teki Meals',
    todayTab: 'Today',
    allTab: 'All Meals',
    todayMeal: "Today's Meal",
    ingredients: 'Ingredients',
    recipe: 'Recipe',
    allMeals: 'All Meals',
    categories: {
      all: 'All',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    }
  }
}

export default function Home() {
  const [lang, setLang] = useState<Language>('sr')
  const [tab, setTab] = useState<Tab>('today')
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null)
  const [category, setCategory] = useState<Category>('all')

  const t = translations[lang]
  const meals = Object.values(mealsData.meals) as Meal[]

  useEffect(() => {
    // Load current meal
    const mealId = currentMealData.mealId
    const meal = meals.find(m => m.id === mealId)
    if (meal) {
      setCurrentMeal(meal)
    }
  }, [])

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
        <h1>{t.title}</h1>
        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === 'sr' ? 'active' : ''}`}
            onClick={() => setLang('sr')}
          >
            Srpski
          </button>
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'today' ? 'active' : ''}`}
          onClick={() => setTab('today')}
        >
          {t.todayTab}
        </button>
        <button
          className={`tab ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          {t.allTab}
        </button>
      </div>

      {tab === 'today' && currentMeal && (
        <div className="card">
          <h2 className="meal-title">{currentMeal.name[lang]}</h2>

          <div>
            <h3 className="ingredients-title">{t.ingredients}:</h3>
            <ul className="ingredients-list">
              {currentMeal.ingredients[lang].map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {currentMeal.recipe && (
            <div className="recipe-section">
              <h3 className="recipe-title">{t.recipe}:</h3>
              <p className="recipe-text">{currentMeal.recipe[lang]}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'all' && (
        <>
          <div className="category-filter">
            {Object.keys(t.categories).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat as Category)}
              >
                {t.categories[cat as keyof typeof t.categories]}
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
                <h3 className="meal-card-title">{meal.name[lang]}</h3>
                <span className="meal-card-category">
                  {t.categories[meal.category as keyof typeof t.categories]}
                </span>
                <div className="meal-card-ingredients">
                  {meal.ingredients[lang].join(', ')}
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
            <h2 className="meal-title">{selectedMeal.name[lang]}</h2>

            <div>
              <h3 className="ingredients-title">{t.ingredients}:</h3>
              <ul className="ingredients-list">
                {selectedMeal.ingredients[lang].map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {selectedMeal.recipe && (
              <div className="recipe-section">
                <h3 className="recipe-title">{t.recipe}:</h3>
                <p className="recipe-text">{selectedMeal.recipe[lang]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
