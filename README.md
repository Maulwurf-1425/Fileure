# ✨ Key Features

**Management & Access**
* 📂 **Full File Access:** Complete control over your local directory.
* 👁️ **Show Hidden Files:** Toggle visibility for system and hidden files.
* 📡 **Live Log:** Real-time feedback of all activities.
* 🔍 **Preview Support:** Instant preview for `JS`, `Python`, `MD`, `JSON`, `PNG`, and more.

**Navigation & Interaction**
* 🌐 **Browse Files:** Smooth and intuitive file navigation.
* 📥 **Download Files:** Quick access to your data.
* 🖼️ **Flexible Layouts:** Choose between **List** and **Grid** views.

**Customization**
* 🖌️ **Change colors:** Change the background and accent colors.
* 📝 **Customize font:** Choose your favorite font from a variety of options.
* 📏 **Size adjustments:** Adjust the spacing and size of icons and text.

---

# 🚀 Fileure Setup Guide

Follow these simple steps to get **Fileure** up and running—your practical, attractive, and innovative alternative to Windows Explorer.

---

### 1. Download the Files
Start by downloading the **"fileure"** folder. Inside, you will find the two core files required to run the application:
* `index.html`
* `server.js`

### 2. Prerequisites
Before launching, ensure you have **node.js** installed on your system. If you haven't done this yet, you can download it here:

> [!TIP]
> **Download Link:** [Click here to download node.js](https://nodejs.org/en/download)

---

### 3. Installation & Launch
Once the folder is ready and node.js is installed, follow these steps to start the server:

1.  **Open Explorer:** Navigate to your `fileure` folder.
2.  **Open Command Prompt:** Click into the **address bar** at the top of the window, type `cmd`, and press **Enter**.
3.  **Run the Server:** In the terminal window that appears, enter the following command:

```bash
node server.js
```


### 4. Access & Enjoy
If the command was successful, you should see a confirmation message in the terminal.

<img width="365" height="114" alt="image" src="https://github.com/user-attachments/assets/7d418bfb-ef7f-453d-bf80-8d493453c5fc" />

Now, open your web browser and navigate to the specified localhost address. Enjoy your practical, attractive, and innovative alternative to Microsoft Explorer!

# Never touch the Explorer again?

To avoid ever having to open Windows Explorer again, you can create a shortcut on your desktop.

1. **Open Notepad** and enter this code:

```bash
@echo off
cd /d "path where you saved the fileure.bat file"
start http://localhost:3000
node server.js
pause
```

2. Then **save it as a .bat** file (fileure.bat).

Next, 3. **go to your desktop**, 4. **right-click, and select "New"** and 5. **then "Shortcut".** 

6. **Link the shortcut to your .bat** file and save it.

# Standard Icon too boring?

If you'd like a nicer icon, you can download one. We use [Lucide Icons](https://lucide.dev/) (The icon of Fliegere is called "folder-tree"). You can download an icon there (preferably as an SVG) and then convert it to an .ico file. We used [Convertio](https://convertio.co/svg-ico/) for this.

Once you've downloaded it, go to Properties and select "Change Icon" (if a message appears, click OK). Now you can find and select the icon.

## DONE - Never again Microsoft Explorer!
