# [Promotion Site](https://fileure.netlify.app/)

# ✨ Key Features

**File Management**
* 📂 **Full File Access:** Complete control over your local file system — browse, open, copy, move, rename, and delete.
* 👁️ **Show Hidden Files:** Toggle visibility for system and hidden files.
* 🖼️ **Flexible Layouts:** Switch between **List** and **Grid** views.
* 📥 **Download Files:** Quick one-click file download.
* 🔍 **Preview Support:** Instant preview for images, `JS`, `Python`, `Markdown`, `JSON`, and more.
* 📡 **Live Activity Log:** Real-time feedback panel for every action.
* 🔗 **Drag & Drop:** Move files by dragging onto folders; drag onto Quick Access entries to copy there.

**Navigation**
* ⭐ **Quick Access:** Pinned shortcuts for Desktop, Downloads, Documents, Pictures, Music, and Videos — plus custom folders.
* 🔖 **Bookmarks:** Save any folder with a custom name and icon (Lucide icon name or emoji). Right-click to rename, change icon, or delete.
* 💾 **Drive Browser:** Jump to any drive letter detected on your system.
* 🍞 **Breadcrumb Path Bar:** Click any crumb to navigate, or click the bar to type a path directly.

**Workspace (built-in Notion alternative)**
* 📋 **Board View:** Kanban-style project board — *Not Started*, *In Progress*, *Done*. Drag cards between columns.
* 📊 **Table View:** Spreadsheet-style overview of all projects with Status, Dates, Priority, Customer, Start/End Values, and Progress.
* 📄 **Notes View:** Rich block-based note editor per page. Type `/` for the command menu (Heading 1–3, Text, Task, Quote, Divider, File Link, Page Link).
* ✅ **Tasks & Checklists:** Task blocks with checkboxes; filter by All / Open / Done. Project detail panels include a full action-item checklist.
* 🗂️ **File Linking:** Right-click any file → *Link to Workspace* to embed it as a clickable block in your current note or project.
* 💾 **Auto-Save:** All Workspace data is written to `notes.json` on every change and flushed via `sendBeacon` even when the tab is closed.

**Customization**
* 🎨 **Accent Color:** 8 presets plus a custom color picker.
* 🌑 **Background Color:** 6 dark theme presets from pure black to midnight blue/purple.
* 📝 **Font:** Inter, JetBrains Mono, System UI, Segoe UI, or Georgia.
* 📏 **Size Adjustments:** Sliders for font size (11–18 px), icon size (12–28 px), row height (24–52 px), and border radius (0–16 px).
* 🔆 **Light / Dark Mode:** Toggle at any time; preference is saved.
* 💾 **Persistent Settings:** All preferences, bookmarks, and Quick Access entries survive browser restarts — stored in `settings.json`.

---

# 🚀 Fileure Setup Guide

Follow these simple steps to get **Fileure** up and running — your practical, attractive, and innovative alternative to Windows Explorer.

---

### 1. Download the Files
Download the **`fileure`** folder. Inside you will find the two core files:
* `index.html`
* `server.js`

Two data files are created automatically on first launch in the same folder:
* `settings.json` — stores your preferences, bookmarks, and Quick Access entries
* `notes.json` — stores all Workspace pages and projects

### 2. Prerequisites
Make sure **Node.js** is installed. If not, download it here:

> [!TIP]
> **Download Link:** [Click here to download Node.js](https://nodejs.org/en/download)

---

### 3. Installation & Launch

1. **Open Explorer:** Navigate to your `fileure` folder.
2. **Open Command Prompt:** Click into the **address bar** at the top, type `cmd`, and press **Enter**.
3. **Run the server:**

```bash
node server.js
```

### 4. Access & Enjoy
Open your browser and navigate to:

```
http://localhost:3000
```

<img width="365" height="114" alt="image" src="https://github.com/user-attachments/assets/7d418bfb-ef7f-453d-bf80-8d493453c5fc" />

---

# 🗂️ Workspace — Board, Table & Notes

Click the **Workspace** button in the top-right toolbar to open the productivity layer.

### Board View
Projects are grouped into three status columns. Click **+ Create Project** under any column to add one. Each card shows an emoji, project name, progress bar with percentage, priority badge (Low / Medium / High), optional end date, and customer label. Drag cards between columns to update their status.

Click any card to open the **Project Detail Panel** on the right:
- Edit title, emoji, status, priority, start/end dates, customer
- Large progress bar with editable Start / Current / Target values
- Free-text project description
- Action item checklist (add, check off, delete items)
- File attachments from the current Explorer directory (click to open)

### Table View
All projects in a table — Status, Start Date, End Date, Priority, Customer, Start Value, End Value, and Progress bar. Click any row to open its detail panel.

### Notes View
A page-based rich text editor. Each page has an emoji icon (click to change) and a title. Add unlimited content blocks:

| Block Type | Description |
|---|---|
| Text | Standard paragraph |
| Heading 1 / 2 / 3 | Large, medium, small headings |
| Task | Checkbox with text — filterable by status |
| Quote | Highlighted indented quote |
| Divider | Horizontal separator line |
| File Link | Clickable link to a local file |
| Page Link | Link to another Workspace page |

Type `/` on any line to open the block command menu. Press **Enter** to add a new block below, **Backspace** on an empty block to delete it. Drag the grip handle to reorder blocks.

### Linking Files from the Explorer
Right-click any file in the Explorer → **Link to Workspace** — the file is instantly embedded as a clickable File Link block in your currently open note.

---

# 🖥️ Never Open Windows Explorer Again?

Create a desktop shortcut to launch Fileure with one double-click:

1. **Open Notepad** and paste this script:

```bat
@echo off
cd /d "C:\path\to\your\fileure\folder"
start http://localhost:3000
node server.js
pause
```

2. **Save it as `fileure.bat`.**
3. **Right-click your desktop** → New → Shortcut.
4. **Point the shortcut to `fileure.bat`** and save.

---

# 🎨 Custom Icon

1. Go to [Lucide Icons](https://lucide.dev/) and find an icon (the Fileure icon is `folder-tree`).
2. Download it as **SVG**.
3. Convert it to `.ico` using [Convertio](https://convertio.co/svg-ico/).
4. Right-click your shortcut → **Properties** → **Change Icon** → select your `.ico` file.

---

## ✅ Done — Fileure is your new home base!
