# 🚀 EduMERN: Implementation & Setup Guide

This guide explains how to set up, run, and extend the EduMERN educational platform.

## 🛠️ Prerequisites
- **Node.js**: v18+ recommended.
- **MongoDB**: Local instance running at `mongodb://localhost:27017` or a MongoDB Atlas URI.
- **npm**: Installed with Node.js.

---

## ⚡ Setup Instructions

### 1. Backend Setup
1. Navigate to the folder: `cd Backend`
2. Install dependencies: `npm install`
3. Configure `.env` (copy from `.env.example` if available).
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the folder: `cd Frontend`
2. Install dependencies: `npm install`
3. Configure `.env` (ensure `VITE_API_URL` points to your backend).
4. Start the app: `npm run dev`
5. Open `http://localhost:5173`

---

## 🏗️ Key Architecture
- **API Utility**: Use `src/utils/api.js` for all requests. It handles tokens and error toasts automatically.
- **Role Control**: Use `checkRole` middleware on the backend to restrict access (e.g., instructors only).
- **Toasts**: Use `useToast()` for global notifications.
