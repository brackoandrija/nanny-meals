# Nanny Meals App

A simple, mobile-friendly meal planning app for your nanny to see daily meals for your child.

## Features

- 📱 Mobile-first, clean design
- 🇷🇸 / 🇬🇧 Serbian/English language toggle
- 📅 "Today's Meal" tab - shows current meal with ingredients
- 📚 "All Meals" tab - browse all available meals
- 🔐 Password-protected admin page to set today's meal
- 🎨 Beautiful gradient design with smooth animations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment to GitHub Pages

1. Create a new **private** repository on GitHub
2. Push this code to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nanny-meals.git
git push -u origin main
```

3. Go to repository Settings → Pages
4. Source: Select "GitHub Actions"
5. The app will automatically deploy on every push to main branch

6. Access your app at: `https://YOUR_USERNAME.github.io/nanny-meals/`

## Admin Access

- URL: `https://YOUR_USERNAME.github.io/nanny-meals/admin`
- Default password: `teki2026`
- To change password: Edit `app/admin/page.tsx` line 19

## Updating Meals

### Option 1: Use Admin Panel (Recommended)
1. Go to `/admin`
2. Login with password
3. Select today's meal from dropdown
4. Click "Update Meal"

### Option 2: Manual Update
Edit `data/current-meal.json`:
```json
{
  "mealId": "musaka",
  "lastUpdated": "2026-03-19"
}
```

## Adding New Meals

Edit `data/meals.json` and add new meal object following the existing structure.

## Important Notes

⚠️ **API Route Limitation**: The admin panel update feature requires a server. Since GitHub Pages only hosts static files, you'll need to:
- Manually update `data/current-meal.json` and push to GitHub, OR
- Deploy to Vercel/Netlify instead (free and supports API routes)

## Deploying to Vercel (Alternative - Recommended)

Vercel supports API routes and makes the admin panel fully functional:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts and your app will be live!

For Vercel deployment, update `next.config.js` to remove `basePath`.
# Trigger deploy
