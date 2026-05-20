# ⚡ Quick Start Guide

Get your Flashcard Learning app up and running in 2 minutes!

## 🚀 Start Development Server

```bash
cd d:\Documents\Source\FlashCard
npm install    # Only needed first time
npm run dev
```

Open your browser to: **http://localhost:5173/flashcard-learning/**

## 📚 What You Get

### ✨ Pre-loaded Features
- **10 Sample Flashcards** - Ready to learn English vocabulary
- **3 Learning Modes**:
  - Learn Mode - for new cards
  - Daily Review - for cards due
  - Quiz Mode - multiple choice questions
- **Complete Dashboard** - Statistics and progress tracking
- **Dark Mode** - Built-in and working
- **3D Card Animations** - Beautiful flip animations with Framer Motion

### 📊 Data Included
- Sample cards with Vietnamese meanings
- IPA pronunciations
- Example sentences
- Card difficulty tracking
- Spaced repetition algorithm (SM-2) ready to use

## 🎮 Try These First

1. **Start Learning**: Click "Start Learning" to learn 6 cards
2. **Flip Cards**: Click cards to reveal answers
3. **Rate Responses**: Rate your memory (0-5 scale)
4. **Watch Stats Update**: Dashboard updates in real-time
5. **Export**: Click Export in header to save as JSON

## 📁 File Structure

```
src/
├── components/     # UI components (FlashcardCard, ReviewCard, etc.)
├── pages/          # Learn, Review, Quiz, Stats pages
├── context/        # React Context for global state
├── services/       # Business logic (card operations, stats)
├── utils/          # Spaced repetition algorithm, localStorage
├── types/          # TypeScript type definitions
├── constants/      # Mock data and constants
└── App.tsx         # Main app component
```

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `src/utils/spacedRepetition.ts` | SM-2 algorithm implementation |
| `src/context/FlashcardContext.tsx` | State management with localStorage |
| `src/components/FlashcardCard.tsx` | 3D flip card component |
| `src/constants/mockData.ts` | Sample cards to load |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | How to deploy on GitHub Pages |

## 📥 Import Your Own Cards

### Format (JSON)

```json
[
  {
    "id": 1,
    "word": "example",
    "meaning": "ví dụ",
    "example": "This is an example.",
    "phonetic": "/ɪɡˈzɑːmpəl/",
    "type": "noun",
    "status": "new",
    "review": {
      "lastReviewed": "2026-05-20T10:00:00Z",
      "nextReview": "2026-05-21T10:00:00Z",
      "interval": 1,
      "easeFactor": 2.5,
      "repetition": 0
    }
  }
]
```

### How to Import

1. Prepare JSON file with cards
2. Click **Import** button in header
3. Select your JSON file
4. Cards load instantly!

## 🌐 Deploy to GitHub Pages

### One-Command Deploy

```bash
# Install gh-pages (if not already installed)
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

Live at: `https://YOUR_USERNAME.github.io/flashcard-learning/`

Or use GitHub Actions (auto-deploys on every push) - see `DEPLOYMENT.md`

## ⚙️ Available Scripts

```bash
npm run dev        # Start dev server (hot reload)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run deploy     # Build and deploy to GitHub Pages
```

## 🎓 How Spaced Repetition Works

1. **New Card**: Set to appear tomorrow
2. **Correct**: Interval increases (1 → 3 → 7 → 14 → 30 days...)
3. **Incorrect**: Interval resets to 1 day, goes back to learning
4. **Ease Factor**: Adjusts based on performance (harder cards = longer reviews)
5. **Auto-Schedule**: Shows cards when due

## 🔐 Data Storage

- ✅ All data saved to **localStorage** (browser)
- ✅ Works **offline** - no internet needed
- ✅ **No backend** - pure static app
- ✅ **Privacy** - your data never leaves your device
- ⚠️ **Browser dependency** - data lost if you clear cache (always export!)

## 🎨 Customize

### Change Sample Cards

Edit `src/constants/mockData.ts`:

```typescript
export const MOCK_CARDS: Flashcard[] = [
  {
    id: 1,
    word: "YOUR_WORD",
    meaning: "YOUR_MEANING",
    // ... other fields
  }
]
```

### Change Colors

Edit `tailwind.config.js` - modify `primary` color palette

### Change Learning Rules

Edit `src/utils/spacedRepetition.ts` - adjust interval calculation

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cards not showing | Click "Import" to load sample data |
| Data lost after refresh | Always export before closing browser |
| Page shows 404 after deploy | Check `base` path in `vite.config.ts` |
| Cards not saving | Check localStorage is enabled in browser |
| Dev server won't start | Run `npm install` and try again |

## 📚 Learn More

- **Full Docs**: See [README.md](./README.md)
- **Deploy Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **SM-2 Algorithm**: See [spacedRepetition.ts](./src/utils/spacedRepetition.ts)
- **React Docs**: [react.dev](https://react.dev)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

## 💡 Pro Tips

1. **Export regularly** - Save your cards as JSON backup
2. **Use tags** - Organize cards by topic (edit mock data)
3. **Set daily goals** - Review cards at same time each day
4. **Adjust difficulty** - Cards adapt based on your responses
5. **Use keyboard** - Space to flip, C for correct, I for incorrect

## 🎉 You're Ready!

Start learning now:

```bash
npm run dev
```

Then visit: **http://localhost:5173/flashcard-learning/**

---

**Happy learning! 📚✨**
