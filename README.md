# 🤖 AI Financial Advisor

> An advanced, AI-powered personal finance dashboard featuring real-time market prediction, news sentiment analysis, and intelligent portfolio insights.

![Dashboard Preview](https://via.placeholder.com/800x400?text=AI+Financial+Advisor+Dashboard)

## ✨ Key Features

### 1. Neural Market Predictor
- **Tech**: TensorFlow.js (LSTM Neural Network) + Gemini 2.5 Flash
- **Function**: Trains a neural network *in your browser* on real-time stock data.
- **Sentiment Engine**: Analyzes recent news headlines to generate a "Sentiment Score" (-1.0 to +1.0) which influences the prediction model's trend.

### 2. AI & Financial News
- **Tech**: NewsAPI + Gemini 2.5 Flash
- **Function**: Aggregates global financial news and uses AI to read every article, determining if it is **Bullish**, **Bearish**, or **Neutral** for the market.

### 3. AI Insights Chat
- **Tech**: Gemini 2.5 Flash + RAG (Retrieval Augmented Generation)
- **Function**: a context-aware financial assistant that remembers your conversation history (persisted in a local database). It can analyze raw financial documents or answer complex investment queries.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **AI & ML**: TensorFlow.js, Google Gemini API
- **Backend**: Node.js, Express
- **Database**: SQLite (local persistence for chat & user settings)
- **APIs**: Twelve Data (Stock History), NewsAPI (Headlines)

---

## 🚀 Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **API Keys**: You need free keys from:
  - [Google AI Studio](https://aistudio.google.com/) (Gemini)
  - [NewsAPI](https://newsapi.org/)
  - [Twelve Data](https://twelvedata.com/)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/Fimo0N/Financial_Advisior.git
cd Financial_Advisior
```

Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configuration (Critical Step) 🔑

For security, the API keys file is **not included** in the repository. You must create it manually.

1. Create a new file: `src/config/apiKeys.js`
2. Paste the following code and fill in your keys:

```javascript
// src/config/apiKeys.js

// 1. Gemini API Key (for Chat & Insights)
export const geminiApiKey1 = "YOUR_GOOGLE_AI_KEY_HERE";

// 2. Gemini API Key (Secondary, for News Analysis / Prediction)
export const geminiApiKey2 = "YOUR_GOOGLE_AI_KEY_HERE";

// 3. NewsAPI Key (for Market Headlines)
export const newsApiKey = "YOUR_NEWSAPI_KEY_HERE";

// 4. Twelve Data API Key (for Stock Prices)
export const twelveDataApiKey = "YOUR_TWELV DATA_KEY_HERE";
```

### 4. Running the App

You need to run **both** the backend server and the frontend client.

**Terminal 1 (Backend):**
```bash
node server/index.js
```
*Server runs on port 3000.*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Frontend runs on http://localhost:5173.*

---

## 🛡️ Troubleshooting

- **White Screen on Launch?**
  - Check your browser console (F12). If you see errors about "apiKeys", ensure you created `src/config/apiKeys.js` correctly as shown above.
  
- **Predictions taking too long?**
  - The LSTM model trains inside your browser. This depends on your device's speed. Give it 5-10 seconds to process 60 days of data.

---

## 📄 License
MIT License.
