import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { mealId } = await request.json()

    if (!mealId) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'data', 'current-meal.json')
    const data = {
      mealId,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating meal:', error)
    return NextResponse.json(
      { error: 'Failed to update meal' },
      { status: 500 }
    )
  }
}
