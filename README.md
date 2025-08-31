# Voice Shopping Assistant

A voice-controlled shopping assistant built using React, Firebase, Gemini AI, and Express.js. It allows users to add, remove, and search for grocery items using natural language voice commands — with intelligent suggestions and personalized recommendations.

## Live Demo

Frontend: [https://voice-shopping-assistant.web.app](https://voice-shopping-assistant.web.app)  
Backend: [https://unthinkable-solutions-technical-assesment.onrender.com](https://unthinkable-solutions-technical-assesment.onrender.com)

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
