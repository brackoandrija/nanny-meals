# ⚡ Quick Start Guide

## What You Have

✅ A beautiful, mobile-friendly meal planner app
✅ Serbian & English language support
✅ 50+ meals with ingredients and recipes
✅ Password-protected admin panel
✅ Ready to deploy to GitHub Pages (free!)

## 3-Minute Setup

### Step 1: Create GitHub Repository (Private)

1. Go to https://github.com/new
2. Name: `nanny-meals`
3. **Check: ✓ Private**
4. Click "Create repository"

### Step 2: Deploy

Open terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nanny-meals.git
git push -u origin main
```

*Replace YOUR_USERNAME with your GitHub username*

### Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: Select **"GitHub Actions"**
3. Wait 2-3 minutes

### Step 4: Share with Your Nanny!

Your app will be at:
```
https://YOUR_USERNAME.github.io/nanny-meals/
```

**That's it!** 🎉

---

## 📱 How It Works

**For Nanny:**
- Opens link on phone
- Sees today's meal + ingredients
- Can switch to English if needed
- Can browse all meals

**For You:**
- Go to `/admin`
- Password: `teki2026`
- Select today's meal
- *(On GitHub Pages, you'll need to edit `data/current-meal.json` manually or use Vercel)*

---

## 🔧 To Change Password

Edit `app/admin/page.tsx` line 19:
```typescript
const ADMIN_PASSWORD = 'your-new-password'
```

Then:
```bash
npm run build
git add .
git commit -m "Update password"
git push
```

---

## ➕ To Add/Edit Meals

Edit `data/meals.json` - it's straightforward JSON format.

After changes:
```bash
npm run build
git add .
git commit -m "Update meals"
git push
```

GitHub will auto-deploy in ~2 minutes.

---

## 🚀 Pro Option: Use Vercel (Recommended)

For working admin panel:

```bash
npm i -g vercel
vercel
```

Follow prompts. Your app gets:
- Working admin panel ✅
- Auto HTTPS ✅
- Free hosting ✅
- Faster than GitHub Pages ✅

---

## Need Help?

See `DEPLOYMENT.md` for detailed instructions!
