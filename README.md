# WhatTo WebApp

A modern, minimalist note-taking web application focused on clean design, intuitive UX, and Markdown compatibility. Built with HTML, CSS (Tailwind), and vanilla JavaScript.

![screenshot](src/assets/Header2.svg)

---

## ✨ Features

- **Multi-Page Notes**: Switch between up to 3 separate note pages with animated transitions.
- **Dynamic Note Creation**: Instantly create, edit, and manage notes in a distraction-free interface.
- **Markdown Support**: Import and export notes in Markdown format, including checklists, separators, and formatting.
- **Checklist & Separator Shortcuts**: Type `- ` for checklists, `---` for separators, and press Enter to convert.
- **Text Formatting**: Use toolbar or Markdown-like shortcuts for **bold**, *italic*, and _underline_ (including combinations).
- **Title Management**: Click to edit the note title, press Enter to confirm.
- **Drag & Drop Import**: Drop a `.md` file to instantly load its content.
- **Export/Import**: Download your notes as Markdown or import from Markdown files.
- **Search**: Powerful search with highlighting and navigation across all pages.
- **Theme Toggle**: Switch between light and dark mode instantly.
- **Clear Cache**: One-click option to clear all notes and settings.
- **Responsive & Accessible**: Works on desktop and mobile, keyboard accessible.
- **Beautiful UI**: Powered by Tailwind CSS and DaisyUI for a modern look.
- **Compact Empty State**: Widget shrinks to a minimal height when empty for a cleaner look.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/WhatTo-WebApp-Port.git
cd WhatTo-WebApp-Port
```

### 2. Open in Your Browser

Just open `src/index.html` in your favorite browser.  
No build step or server required!

---

## 📝 Usage

- **Create a Note**: Click the "What to..." placeholder, type your title, and press Enter.
- **Add Checklist Items**: Type `- ` at the start of a line, type your item, and press Enter.
- **Add Separators**: Type `---` on a line and press Enter.
- **Text Formatting**: Select text and use the toolbar for **bold**, *italic*, or _underline_, or use Markdown-style shortcuts (e.g. `**bold**`, `*italic*`, `_underline_`).
- **Switch Pages**: Use the page buttons at the top to switch between notes.
- **Edit**: Click the title or any note content to edit.
- **Export**: Click the settings (logo) and choose "Export to Markdown".
- **Import**: Click the settings (logo) and choose "Import from Markdown" or drag a `.md` file onto the app.
- **Search**: Use the search bar (top right) to find and highlight text across all pages, with navigation.
- **Theme**: Toggle light/dark mode from the settings dropdown.
- **Clear Cache**: Use the settings dropdown to clear all notes and settings instantly.

### Markdown Syntax

| Syntax   | Description                | Example                |
|----------|----------------------------|------------------------|
| `- [ ]`  | Checklist (unchecked)      | `- [ ] Buy groceries`  |
| `- [x]`  | Checklist (checked)        | `- [x] Done item`      |
| `---`    | Horizontal separator       | `---`                  |
| `##`     | Heading                    | `## Subheading`        |
| `**text**` | Bold                     | `**bold**`             |
| `*text*`  | Italic                    | `*italic*`             |
| `_text_`  | Underline                 | `_underline_`          |
| Combinations | Bold/Italic/Underline   | `***_combo_***`        |

---

## 🛠️ Built With

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📦 Project Structure

```
src/
  ├── assets/         # Images and icons
  ├── index.html      # Main HTML file
  ├── styles.css      # Custom styles
  └── script.js       # App logic
```

---

## 💡 Future Enhancements

- [x] Local storage for note persistence
- [x] Multi-page support
- [x] More Markdown formatting options (bold, italic, underline)
- [x] Theme customization (dark mode)
- [x] Search across notes
- [x] Clear cache/reset option
- [x] Compact/empty state UI
- [ ] Mobile UX improvements
- [ ] More export/import options
- [ ] Richer formatting (code, links, etc.)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request.

---

## 📄 License

[MIT](LICENSE)

---

## 🙏 Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Favicon & UI inspiration](https://undraw.co/)

---

> Made with ❤️ by Syn3
