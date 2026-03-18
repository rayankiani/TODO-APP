# 🚀 ProMinder - Premium Productivity App

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/prominder?style=social)](https://github.com/YOUR_USERNAME/prominder)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/prominder?style=social)](https://github.com/YOUR_USERNAME/prominder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-100%25-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Fully-green.svg)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

<div align="center">
  <img src="https://via.placeholder.com/1200x600/3b82f6/ffffff?text=ProMinder+-+Premium+Todo+App+%F0%9F%93%8A" alt="ProMinder Hero" width="100%">
  <br><br>
  <strong>A beautiful, feature-rich todo app built with Vanilla JavaScript. No frameworks needed – just open `index.html`!</strong>
  <br><br>
  <a href="https://yourusername.github.io/prominder/" target="_blank">
    <b>🚀 Live Demo</b>
  </a> • 
  <a href="#features"><b>✨ Features</b></a> • 
  <a href="#quick-start"><b>⚡ Quick Start</b></a>
</div>

## ✨ Features

### 🎯 Core Task Management
- ✅ **Add/Edit/Delete Tasks** – Titles, descriptions, due dates
- 📅 **Due Dates & Overdue Detection** – Never miss deadlines
- ⭐ **Priorities** – None/Low/Medium/High/Urgent (color-coded badges)
- 🏷️ **Custom Categories** – Create colored categories, delete them
- ✅ **Mark Complete** – One-click completion tracking

### 🔍 Smart Filtering & Sorting
| Filter | Description |
|--------|-------------|
| 📥 **Inbox** | All tasks |
| 📅 **Today** | Tasks due today |
| ⏳ **Upcoming** | Future due dates |
| ⚡ **Active** | Incomplete tasks |
| ✅ **Completed** | Finished tasks |
| 🏷️ **Categories** | Filter by custom categories |

- 🔤 **Search** – Instant search titles/descriptions (Ctrl+F)
- 📊 **Sorting** – Created/Due/Priority/Alphabetical

### 🎨 Premium UI/UX
- 🌙 **Dark/Light Theme** – Auto-toggle
- 📱 **Fully Responsive** – Mobile/Desktop/Tablet
- ✨ **Glassmorphism Design** – Modern blurred backgrounds
- 🎛️ **Drag & Drop** – Reorder tasks (sortable)
- 📈 **Productivity Ring** – Daily completion %
- 🔔 **Toast Notifications** – Success/error feedback
- ⌨️ **Keyboard Shortcuts** – `N` = New Task, `Ctrl+F` = Search

### ⚙️ Advanced
- 💾 **LocalStorage Persistence** – Data survives browser close
- 🔄 **Bulk Actions** – Select multiple (coming soon)
- 🛠️ **Empty States** – Beautiful no-tasks screen
- 📴 **PWA Ready** – Add to home screen friendly

## 📱 Screenshots

### Desktop Light Mode
<div align="center">
  ![Desktop Light](screenshots/desktop-light.png)
</div>

### Desktop Dark Mode
<div align="center">
  ![Desktop Dark](screenshots/desktop-dark.png)
</div>

### Mobile View
<div align="center">
  ![Mobile](screenshots/mobile.png)
</div>

### Task Modal & Categories
<div align="center">
  ![Modal](screenshots/modal.png)
</div>

## ⚡ Quick Start

1. **Download/Clone** this repo
2. **Open** `TODO-APP/index.html` in any modern browser
3. **Start adding tasks!** (Data auto-saves)

```bash
# No installation needed!
open TODO-APP/index.html  # Mac
start TODO-APP/index.html  # Windows
xdg-open TODO-APP/index.html  # Linux
```

**Works on**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+

## 🎯 Usage Guide

### Create Your First Task
<details>
<summary>Click to expand</summary>

1. Press `N` or click **+ New Task**
2. Enter title, optional description/due date/priority/category
3. Hit **Enter** or **Save Task**

```javascript
// Example task object (auto-generated)
{
  id: 'task-123',
  title: 'Finish README',
  desc: 'Make it beautiful!',
  dueDate: '2024-12-31',
  priority: 'high',
  categoryId: 'cat-work',
  completed: false,
  createdAt: '2024-...',
  updatedAt: '2024-...'
}
```

</details>

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `N` | New Task |
| `Ctrl+F` | Search |
| `Enter` | Save Task (modal) |

### Productivity Stats
- **Ring Chart**: Shows today's completion % (due tasks)
- **Badges**: Live counts (Inbox/Today)

## 🛠️ Tech Stack

| Category | Tech |
|----------|------|
| **Frontend** | Vanilla HTML5, CSS3, ES6+ JS |
| **Styling** | CSS Grid/Flexbox, Custom Properties, Animations, Backdrop-filter |
| **Icons** | [Lucide](https://lucide.dev) (CDN) |
| **Drag-Drop** | [SortableJS](https://sortablejs.github.io/Sortable/) (CDN) |
| **Fonts** | [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter) |
| **Storage** | LocalStorage API |
| **Responsive** | Mobile-First CSS Media Queries |

**Zero Dependencies** – Pure vanilla! ~2KB gzipped.

## 🔧 Customization

### Change Theme
```javascript
// In script.js, default: 'light'
AppState.settings.theme = 'dark'; // or 'light'
```

### Add Default Categories
Edit `script.js` → `AppState.categories` array.

### Clear Data
```javascript
localStorage.clear(); // Reset everything
// Or selectively: localStorage.removeItem('pm_tasks');
```

### PWA Support
Add `manifest.json` + service worker for offline/full PWA.

## 🚀 Deployment

1. Push to GitHub
2. Enable **GitHub Pages** (Settings → Pages → Deploy from `main`)
3. Access: `https://yourusername.github.io/prominder`

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-task`)
3. Commit changes (`git commit -m 'Add amazing-task'`)
4. Push & Open PR!

**Issues?** Open one – I'll respond quickly! 🎉

## 📄 License

This project is [MIT](LICENSE) licensed – use freely!

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev) – Beautiful icons
- [SortableJS](https://sortablejs.github.io/Sortable/) – Drag & drop magic
- [Inter Font](https://rsms.me/inter/) – Perfect typography
- UI Inspiration: Linear.app, Superhuman, Notion

<div align="center">
  Built with ❤️ using Vanilla JS<br>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <sub>Made by @yourusername</sub>
</div>

---
⭐ **Star on GitHub** if you like it! **Fork & Deploy** your own in 30 seconds!
