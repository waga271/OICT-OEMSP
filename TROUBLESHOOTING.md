# 🩺 EduMERN Troubleshooting & Fixes

If you encounter issues running the project, follow this guide to identify and fix common problems.

---

## 1. ❌ PROBLEM: `MongooseServerSelectionError` or "Could not connect to MongoDB"
**Why?** This happens if your MongoDB service isn't running or the URI is wrong.

### ✅ THE FIX:
1.  **Check Service**: 
    - **Windows**: Open Task Manager -> Services -> Check if `MongoDB` is "Running".
    - **Commands**: Run `services.msc` and start "MongoDB Server".
2.  **Verify URI**: In `Backend/.env`, ensure `MONGO_URI` is correct. If using local, it's usually `mongodb://localhost:27017/educational_platform`.
3.  **Use Atlas**: If you don't have MongoDB installed locally, create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and paste that URI into your `.env`.

---

## 2. ❌ PROBLEM: `sh: vite: command not found` or `Error: Cannot find module`
**Why?** Dependencies are not installed.

### ✅ THE FIX:
Run these commands in order:
```bash
# For Backend
cd Backend
npm install

# For Frontend
cd Frontend
npm install
```

---

## 3. ❌ PROBLEM: Stripe Payments are failing
**Why?** You are using placeholder keys.

### ✅ THE FIX:
1.  Get your keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
2.  Update `Backend/.env`: `STRIPE_SECRET_KEY=sk_test_...`
3.  Update `Frontend/.env`: `VITE_STRIPE_PUBLIC_KEY=pk_test_...`

---

## 4. ❌ PROBLEM: "Port 5000 is already in use"
**Why?** Another process (or a previous crash) is still using the port.

### ✅ THE FIX:
- **Windows (Command Prompt as Admin)**:
  ```cmd
  netstat -ano | findstr :5000
  taskkill /PID <LISTED_PID> /F
  ```
- **Alternative**: Change `PORT=5000` to `PORT=5001` in `Backend/.env` and update `VITE_API_URL` to `http://localhost:5001` in `Frontend/.env`.

---

## 5. ❌ PROBLEM: Toast messages show "Server Error"
**Why?** The Backend is likely off, or there is a database validation error.

### ✅ THE FIX:
1.  Check the **Control Panel** or **Terminal** where the server is running.
2.  Look for `console.error` logs—they will tell you exactly which field failed (e.g., "Email is required").
