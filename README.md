# 📚 Flashcard Learning - Spaced Repetition App

A modern, production-ready flashcard learning application built with **React + Vite + TailwindCSS**. Features spaced repetition algorithm (SM-2), beautiful 3D card animations, and full localStorage support for offline learning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![Vite](https://img.shields.io/badge/vite-4.4-purple.svg)

## ✨ Features

### Core Learning Features
- **Spaced Repetition Algorithm (SM-2)** - Similar to Anki/Quizlet
- **Multiple Learning Modes**
  - Learn Mode: for new cards
  - Daily Review: cards due for review
  - Quiz Mode: multiple-choice questions
  - Browse Mode: view all cards
- **3D Card Flip Animation** - Smooth Framer Motion animations
- **Web Speech API** - Pronunciation audio for each word
- **Keyboard Shortcuts** - Fast navigation and card rating

### Data & Management
- **LocalStorage Persistence** - All data saved locally
- **Import/Export JSON** - Full backup and restore
- **Advanced Search & Filter** - Find cards by word, meaning, or tags
- **Card Status Tracking** - New, Learning, Remembered
- **Phonetic Support** - IPA pronunciation for each word

### Statistics & Progress
- **Real-time Statistics**
  - Cards due today
  - Daily accuracy
  - Learning streak
  - Progress charts
- **Session History** - Track daily learning sessions
- **Visual Analytics**
  - Weekly activity chart
  - Card status distribution
  - Accuracy trends

### UI/UX
- **Dark Mode** - Eye-friendly dark theme
- **Responsive Design** - Works perfectly on mobile, tablet, desktop
- **Toast Notifications** - Instant feedback on actions
- **Loading States** - Smooth loading indicators
- **Beautiful UI** - Modern, minimal, premium design

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flashcard-learning

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── UI.tsx          # Button, Input, Modal, Toast
│   ├── FlashcardCard.tsx # 3D flip card component
│   ├── ReviewCard.tsx   # Review and Quiz cards
│   ├── Dashboard.tsx    # Statistics dashboard
│   ├── Header.tsx       # Navigation header
│   └── index.ts         # Component exports
├── pages/               # Page components
│   ├── HomePage.tsx     # Dashboard page
│   ├── LearnPage.tsx    # Learn mode
│   ├── ReviewPage.tsx   # Daily review
│   ├── QuizPage.tsx     # Quiz mode
│   ├── CardsPage.tsx    # Card browser
│   ├── StatsPage.tsx    # Statistics
│   └── index.ts         # Page exports
├── context/             # React Context
│   └── FlashcardContext.tsx # Global state management
├── services/            # Business logic
│   ├── cardService.ts   # Card operations
│   ├── statsService.ts  # Statistics logic
│   └── index.ts
├── utils/               # Utility functions
│   ├── spacedRepetition.ts # SM-2 algorithm
│   ├── localStorage.ts  # Storage management
│   ├── formatters.ts    # Date/number formatting
│   └── index.ts
├── types/               # TypeScript types
│   └── index.ts
├── constants/           # Constants and mock data
│   ├── index.ts
│   └── mockData.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 📋 Data Format

### Flashcard Schema

```json
{
  "id": 1,
  "word": "facilitate",
  "meaning": "hỗ trợ, tạo điều kiện",
  "example": "The new software facilitates communication.",
  "phonetic": "/fəˈsɪlɪteɪt/",
  "type": "verb",
  "status": "new",
  "tags": ["business", "advanced"],
  "createdAt": "2026-05-20T10:00:00Z",
  "review": {
    "lastReviewed": "2026-05-20T10:00:00Z",
    "nextReview": "2026-05-21T10:00:00Z",
    "interval": 1,
    "easeFactor": 2.5,
    "repetition": 0
  }
}
```

### Card Status
- `new` - Never reviewed
- `learning` - In progress (0-2 consecutive correct)
- `remembered` - Mastered (3+ consecutive correct)

### Review Fields
- `lastReviewed` - Last review timestamp
- `nextReview` - Next due review date
- `interval` - Days until next review
- `easeFactor` - Difficulty multiplier (1.3-2.5+)
- `repetition` - Consecutive correct answers

## 🧠 Spaced Repetition Algorithm

The app uses the **SM-2 algorithm** (used by Anki):

### Correct Answer (quality ≥ 3)
- Increase interval based on repetition count
- Increase ease factor slightly
- Schedule next review after interval days

### Incorrect Answer (quality < 3)
- Reset repetition counter to 0
- Reset interval to 1 day
- Decrease ease factor
- Schedule immediate review

```typescript
// Example: Rate a card as "Correct"
reviewCard(cardId, 5); // Quality 5 = correct and easy

// Interval increases based on repetition:
// Rep 1: interval = 1 day
// Rep 2: interval = 3 days  
// Rep 3+: interval = prev_interval * easeFactor
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite 4** - Build tool & dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Web Speech API** - Pronunciation

## 🌐 Deploy on GitHub Pages

### Step 1: Prepare GitHub Repository

```bash
# Create new repository on GitHub (e.g., flashcard-learning)
# Add remote and push

git remote add origin https://github.com/YOUR_USERNAME/flashcard-learning.git
git branch -M main
git push -u origin main
```

### Step 2: Update vite.config.ts

The `base` path is already set correctly in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/flashcard-learning/', // Replace with your repo name
})
```

### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4: Update package.json

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 5: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Select `Source: Deploy from a branch`
4. Select `Branch: gh-pages` and `Folder: / (root)`
5. Click **Save**

### Step 6: Deploy

```bash
# Build and deploy to GitHub Pages
npm run deploy

# Deployed at: https://YOUR_USERNAME.github.io/flashcard-learning/
```

## 📥 Import/Export

### Export Flashcards

1. Click **Export** button in header
2. JSON file downloads automatically with format: `flashcards-YYYY-MM-DD.json`

### Import Flashcards

1. Click **Import** button in header
2. Select JSON file with card data
3. Cards are merged with existing cards

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Flip card |
| `C` | Mark correct |
| `I` | Mark incorrect |
| `N` | Next card |
| `P` | Previous card |
| `D` | Toggle dark mode |

## 🎯 Quality Ratings

Rate each card during review (0-5):

| Rating | Meaning |
|--------|---------|
| 0 | Blackout - complete failure |
| 1 | Incorrect - serious difficulty |
| 2 | Incorrect - but easy |
| 3 | Correct - but difficult |
| 4 | Correct - right answer |
| 5 | Correct - perfect response |

*Ratings 3+ are considered correct*

## 📊 Statistics Explained

- **Due Today** - Cards scheduled for review today
- **Learned Today** - New cards learned this session
- **Accuracy** - Percentage of cards answered correctly
- **Current Streak** - Consecutive days with reviews
- **Longest Streak** - Best streak ever
- **Overall Accuracy** - All-time accuracy percentage

## 🔧 Customization

### Add Sample Cards

Edit `src/constants/mockData.ts`:

```typescript
export const MOCK_CARDS: Flashcard[] = [
  {
    id: 1,
    word: "your-word",
    meaning: "your meaning",
    // ... other fields
  }
]
```

### Customize Colors

Edit `tailwind.config.js` - modify the `primary` color palette

### Modify Learning Rules

Edit `src/utils/spacedRepetition.ts` to adjust:
- Initial ease factor
- Min/max ease factors
- Interval calculation

## 🐛 Troubleshooting

### Data Not Persisting
- Check browser's localStorage is enabled
- Check storage quota: `localStorage` has ~5-10MB limit
- Clear browser cache and try again

### Cards Not Showing
- Click "Import" and load sample data
- Check console for errors (F12)
- Ensure localStorage has data

### Dark Mode Not Working
- Hard refresh page (Ctrl+Shift+R)
- Check browser dark mode preference

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please feel free to submit PRs or issues.

## 🎓 Learning Resources

- [SM-2 Algorithm](https://en.wikipedia.org/wiki/Spaced_repetition#Leitner_system)
- [Anki Documentation](https://docs.ankiweb.net/)
- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- Open an issue on GitHub for bugs
- Check documentation in README
- Review code comments in components

---

Built with ❤️ using React + Vite + TailwindCSS
