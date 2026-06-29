# 🛰️ KFON BSS Home

A modern React application for the **KFON BSS Home ** project.  
This frontend app is built using [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for high performance and modern development workflows.


## 📦 Project Information

| Key               | Value              |
|------------------ |--------------------|
| Project           | KFON BSS Home      |
| React Version     | 19.1               |
| Node.js Version   | 22.17.0            |
| Package Manager   | PNPM               |
| Build Tool        | Vite               |
|

## ⚙️ Setup Instructions

### 1. 📁 Clone the Repository

```bash
git clone git@github.com:kfonbss/bss-home-frontend.git

```

### 2. 📦 Install Dependencies

```bash
cd bss-home-frontend
pnpm i
```
### 3. 🛠️ Create a .env.local File

Before running the project, you **must create a `.env.local` file** in the root directory.
`.env.local` is ignored by version control (e.g., Git) and is meant for **developer-specific or sensitive config**, such as:

```env
# .env.local (example)
VITE_API_BASE_URL=http://localhost:3000
```
🔐 All variables must begin with VITE_ to be exposed in the client (per Vite’s requirements).

## 🚀 Start the Development Server

```bash
pnpm dev
```
Visit http://localhost:5173 to view the app in your browser.

## 👉 Developers Guide
[Route Guidelines](./documentation/ROUTE_GUIDELINES_README.md)

## 👥 Contributors
 - KFON BSS Project Team