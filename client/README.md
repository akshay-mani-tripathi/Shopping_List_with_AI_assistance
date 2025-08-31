<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Voice Shopping Assistant

A voice-controlled shopping assistant built using React, Firebase, Gemini AI, and Express.js. It allows users to add, remove, and search for grocery items using natural language voice commands — with intelligent suggestions and personalized recommendations.

## Live Demo

Frontend: [https://voice-shopping-assistant.web.app](https://voice-shopping-assistant.web.app)  
Backend: [https://shopping-list-with-ai-assistance.onrender.com/]

---

## Tech Stack

### Frontend (`client/`)
- React with Vite
- `react-speech-recognition` for voice input
- Live recommendations via Gemini AI
- Firebase Hosting for deployment

### Backend (`server/`)
- Node.js + Express
- Gemini 1.5 Pro API for intent extraction & recommendations
- Firebase Firestore for storage
  - `live_shopping_list` → current items
  - `shopping_history` → all-time log
- Hosted on Render

---

## Features

- Voice input support (microphone)
- Gemini AI extracts user intent (add, remove, search)
- Real-time shopping list management
- Personalized item recommendations
- Search by brand, size, price
- Data persists via Firebase

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/voice-shopping-assistant.git
cd voice-shopping-assistant



# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install



GEMINI_API_KEY=AIzaSyD9_OeuKHXTK4L3XEqbQC_SoHyyhKDBLa4


# Start backend
cd server
node app.js

# Start frontend
cd ../client
npm run dev

cd client
npm run build
firebase deploy --only hosting
>>>>>>> 547aaa108a5c70a075e1302f9d996bebc0877dd4
