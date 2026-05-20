# 🚀 Deployment Guide - Flashcard Learning App

Complete step-by-step guide to deploy your Flashcard Learning app to GitHub Pages for free hosting.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js and npm installed

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `flashcard-learning`
3. Choose "Public" (required for free GitHub Pages)
4. Click "Create repository"

### Step 2: Initialize Git and Push Code

```bash
cd d:\Documents\Source\FlashCard

# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/flashcard-learning.git

# Create initial commit
git add .
git commit -m "Initial commit: Flashcard learning app"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - Click **Save**

### Step 4: Create GitHub Actions Workflow

1. In your repository, create folder: `.github/workflows/`
2. Create file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: # Leave empty unless you have a custom domain
```

3. Commit and push:

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push
```

4. GitHub Actions will automatically build and deploy!
5. Your app will be live at: `https://YOUR_USERNAME.github.io/flashcard-learning/`

---

## Option 2: Manual Deployment with gh-pages

### Step 1: Create Repository (Same as above)

### Step 2: Install gh-pages Package

The package is already in `package.json`. Install it:

```bash
npm install
```

### Step 3: Deploy

```bash
npm run deploy
```

This will:
- Build the project
- Create a `gh-pages` branch
- Push the `dist` folder to GitHub Pages

### Step 4: Verify Deployment

1. Go to repository **Settings** → **Pages**
2. Check that source is set to `gh-pages` branch
3. Your app is live at: `https://YOUR_USERNAME.github.io/flashcard-learning/`

---

## Option 3: Deploy to Custom Domain

### Using Netlify (Free, Easy)

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Using Vercel (Free, Fast)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add new..." → "Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Your app will automatically deploy on every push!

---

## Troubleshooting

### App shows 404 after deployment

**Problem**: App works locally but shows 404 on GitHub Pages

**Solution**: Check the `base` path in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/flashcard-learning/', // Make sure this matches your repo name
  // ...
})
```

If repo name is different, update this path:

```bash
# Check your repo name
# If it's 'my-flashcards', then:
base: '/my-flashcards/',
```

### Data not persisting

**Problem**: Cards disappear after page reload

**Solution**: This is normal for GitHub Pages. localStorage works, but:
- Make sure browser allows localStorage (not in private/incognito)
- Check browser storage quota
- Export and re-import cards if needed

### Assets not loading

**Problem**: CSS and images not loading

**Solution**: Usually caused by wrong `base` path. Check:

1. `vite.config.ts` has correct base path
2. Rebuild and redeploy:

```bash
npm run build
npm run deploy
```

### Custom domain not working

**Problem**: Custom domain shows GitHub's 404

**Solution**: 

1. Go to repository Settings → Pages
2. Under "Custom domain", enter your domain
3. Add CNAME record to your domain registrar:
   - Type: CNAME
   - Name: www (or subdomain)
   - Value: `YOUR_USERNAME.github.io`

4. Wait 5-15 minutes for DNS to propagate

---

## Performance Optimization

### Reduce Build Size

1. The warning about chunk size is normal
2. To minimize further, disable source maps in production:

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    sourcemap: false,
  }
})
```

### Caching

All assets are automatically cached by browser.To clear cache:

1. Do a hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or clear browser cache manually

---

## Updating Your App

After making changes:

### With GitHub Actions

```bash
git add .
git commit -m "Update feature"
git push
```

GitHub Actions automatically builds and deploys!

### With gh-pages

```bash
git add .
git commit -m "Update feature"
git push
npm run deploy
```

---

## Monitoring

### View Deployment Status

**GitHub Actions**: Go to Actions tab → Check workflow runs

**GitHub Pages**: Settings → Pages → View deployment

### View Errors

1. Go to repository → Actions
2. Click on failed workflow
3. Scroll down to see error details

---

## Backup and Recovery

### Backup Your Data

**Cách 1: Dùng browser DevTools**
1. Mở DevTools (F12) → tab **Application** → **Local Storage**
2. Tìm key `flashcard_cards`
3. Copy value và lưu vào file `.json`

**Cách 2: Dùng script nhanh**
```javascript
// Chạy trong Console (F12)
const data = localStorage.getItem('flashcard_cards');
const blob = new Blob([data], {type: 'application/json'});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'flashcards-backup.json';
a.click();
```

### Restore Data

1. Click **Import** ở header của app
2. Chọn file JSON đã backup
3. Cards sẽ được restore!

---

## Tips & Tricks

### Faster Development

```bash
# Start dev server with hot reload
npm run dev

# Preview production build locally
npm run build
npm run preview
```

### Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=https://api.example.com
```

Access in code:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

### Analytics

Add Google Analytics:

1. Create account at analytics.google.com
2. Add this to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Support

- Check [GitHub Pages docs](https://docs.github.com/en/pages)
- See [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
- Review build logs in GitHub Actions

---

**Deployed and ready to learn! 🎉**
