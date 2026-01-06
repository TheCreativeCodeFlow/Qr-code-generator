# QR Master - Production Ready QR Generator

A modern, scalable web application for generating static QR codes, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Running Development Server

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠 Features

### Supported QR Types
- **URL**: Standard web links.
- **WIFI**: Join networks automatically (WPA/WEP/None).
- **vCard**: Contact details (Phone, Email, Org).
- **Text**, **Email**, **SMS**.

### Toggle Theme
Switch between Light and Dark mode using the button in the header.

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main Generator Page
│   │   ├── layout.tsx          # Wrapper with ThemeProvider
│   ├── components/
│   │   ├── qr-params-form.tsx  # Form Logic
│   │   ├── qr-preview.tsx      # Canvas Rendering
│   │   ├── mode-toggle.tsx     # Theme Switcher
│   └── lib/                    # Utilities
```

## ⚠️ Troubleshooting

### "Unable to acquire lock" / Port already in use
If `npm run dev` fails with "Unable to acquire lock", it means a previous Next.js process is still running in the background.

**Solution (Windows PowerShell):**
```powershell
# Stop all Node.js processes
Get-Process node | Stop-Process -Force
```

