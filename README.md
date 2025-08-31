# Voice Shopping Assistant

A voice-controlled shopping assistant built using React, Firebase, Gemini AI, and Express.js. It allows users to add, remove, and search for grocery items using natural language voice commands — with intelligent suggestions and personalized recommendations.

## Live Demo

Frontend: [https://shopping-list-with-ai-assistance.vercel.app/]  
Backend: [https://shopping-list-with-ai-assistance.onrender.com]

---

## Tech Stack

### Frontend (`client/`)
- React with Vite
- `react-speech-recognition` for voice input
- Live recommendations via Gemini AI
- Vercel for deployment

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
git clone https://github.com/yourusername/Shopping_List_with_AI_assistance.git
cd Shopping_List_with_AI_assistance



# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install



GEMINI_API_KEY=your_api_key


# Start backend
cd server
node app.js

# Start frontend
cd ../client
npm run dev
