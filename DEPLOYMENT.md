# 🚀 Deployment Instructions

## GitHub Pages Setup

### 1. Create Private GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `nanny-meals` (or any name you prefer)
3. **✓ Make it Private**
4. Click "Create repository"

### 2. Push Your Code

```bash
cd C:/projects/claudecode/nanny-meals
git init
git add .
git commit -m "Initial commit: Nanny meals app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nanny-meals.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. Wait a few minutes for the deployment to complete

### 4. Access Your App

Your app will be available at:
```
https://YOUR_USERNAME.github.io/nanny-meals/
```

Admin panel:
```
https://YOUR_USERNAME.github.io/nanny-meals/admin
```

**Default Password**: `teki2026`

---

## 📱 How to Use

### For the Nanny:

1. Open the app link on mobile
2. She'll see today's meal immediately
3. Can toggle between Serbian and English
4. Can browse all meals if needed

### For You (Admin):

1. Go to `/admin`
2. Enter password: `teki2026`
3. Select today's meal from dropdown
4. Click "Update Meal"

**⚠️ IMPORTANT NOTE**:
The admin panel won't work on GitHub Pages (it only hosts static files). To update the meal:

**Option A - Recommended: Use Vercel Instead**
```bash
npm i -g vercel
vercel
```
Follow the prompts - admin panel will work perfectly!

**Option B - Manual Update on GitHub Pages**
1. Edit `data/current-meal.json` in your repo
2. Change `mealId` to the desired meal ID
3. Commit and push changes
4. GitHub Actions will auto-deploy

---

## 🔒 Change Admin Password

Edit `app/admin/page.tsx`, line 19:
```typescript
const ADMIN_PASSWORD = 'teki2026' // Change this
```

Then rebuild and redeploy.

---

## ➕ Add New Meals

Edit `data/meals.json` and add new meal following this structure:

```json
"meal_id": {
  "id": "meal_id",
  "name": {
    "sr": "Serbian Name",
    "en": "English Name"
  },
  "category": "breakfast|lunch|dinner|snack",
  "ingredients": {
    "sr": ["Sastojak 1", "Sastojak 2"],
    "en": ["Ingredient 1", "Ingredient 2"]
  },
  "recipe": {
    "sr": "Serbian recipe...",
    "en": "English recipe..."
  }
}
```

---

## 🔄 Update Deployed App

Whenever you make changes:
```bash
git add .
git commit -m "Update meals"
git push
```

GitHub Actions will automatically rebuild and deploy!

---

## 💡 Pro Tip: Vercel (Recommended)

For full functionality including the admin panel:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Update `next.config.js` - remove the basePath:
```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove: basePath: process.env.NODE_ENV === 'production' ? '/nanny-meals' : '',
}
```

3. Deploy:
```bash
vercel
```

4. Your app will be at: `https://your-app.vercel.app`

Benefits:
- ✅ Admin panel works perfectly
- ✅ Automatic HTTPS
- ✅ Free for private repos
- ✅ Super fast global CDN
- ✅ Auto-deploy on git push

---

## 📞 Support

If you encounter any issues, check the GitHub Actions tab in your repository to see deployment logs.
