# Malleability - Study Dashboard

A minimalistic study dashboard with task management, XP tracking, and motivational quotes.

## Features

### 🏠 Home Dashboard
- Clean, modern interface with sidebar navigation
- Widget-based layout for easy overview

### 📅 Task Management & Calendar
- **Daily Tasks**: Add, complete, and delete tasks for any day
- **Interactive Calendar**: Click on any date to view/manage tasks for that day
- **Task Indicators**: Days with tasks show a green indicator dot
- **Local Storage**: All tasks are saved automatically in your browser

### 🎯 XP & Level System
- **Level Progression**: Start at Level 1 and progress by earning XP
- **XP Activities**: 
  - "Read Today's Chapter" - 10 XP
  - "Watched a Documentary" - 15 XP
  - "Completed a Quiz" - 20 XP
- **Dynamic Leveling**: Each level requires 100 XP more than the previous level
- **Progress Tracking**: Visual progress bar and level notifications
- **Reset Option**: Reset your progress if needed

### 💬 Motivational Quotes
- **Default Quotes**: Comes with 10 inspiring quotes
- **Add Custom Quotes**: Add your own motivational quotes
- **Random Display**: Get a new random quote anytime
- **Persistent Storage**: Custom quotes are saved in local storage

### 📚 Subject Navigation
- Sidebar menu with links to different study subjects:
  - Biology, Chemistry, Physics, Maths
  - Latin, Music Theory, Psychology
  - Politics, Programming

## Getting Started

1. Open `index.html` in your web browser
2. Start adding tasks for today or any other day
3. Earn XP by clicking the activity buttons
4. Get motivated with inspirational quotes
5. Navigate between subjects using the sidebar menu

## Browser Compatibility

Works in all modern browsers that support:
- Local Storage
- CSS Grid
- ES6 JavaScript

## Data Storage

All your data (tasks, XP, level, custom quotes) is stored locally in your browser using Local Storage. This means:
- ✅ Your data persists between sessions
- ✅ No internet connection required
- ⚠️ Data is specific to the browser and device you're using
- ⚠️ Clearing browser data will reset everything

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

You can easily customize the website by:
- Editing the subjects in the sidebar (index.html)
- Modifying XP values for different activities (script.js)
- Adding more default quotes (script.js)
- Adjusting the styling (styles.css)

Enjoy your study journey! 🚀 