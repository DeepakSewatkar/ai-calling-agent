AI Calling Agent (Node.js + React.js)

A simple AI-assisted calling agent built using Node.js (Express) for backend and React.js (Vite) for frontend.
This app uses dummy customer data, applies basic AI-like rules, and triggers demo calls using a calling API (Twilio mock mode).

📌 Features
✅ Backend (Node.js + Express)

REST APIs:

GET /customers → Return all customers

GET /customers/:id → Return a single customer

POST /call → Triggers a test call (Twilio/Exotel integration-ready)

Uses JSON file (customers.json) as a small database.

Saves call logs into call_logs.json.

CORS enabled for frontend communication.

✅ Frontend (React.js + Vite)

Displays customer list in a clean table.

Shows:

Name

Phone Number

Order Status

“Call” button for each customer:

Allowed only if order_status = pending OR delayed

Displays confirmation message when a call is triggered.

Fetches live backend data using deployed API URL.

Shows call logs in a separate table.

🧠 AI-Like Logic

The system automatically checks:

Status	Call Allowed?
pending	✔ Yes
delayed	✔ Yes
delivered	❌ No (Button disabled)
🚀 Deployment

Backend deployed on Railway

Frontend deployed on Vercel

Frontend uses environment variable:
VITE_API_BASE = https://YOUR_BACKEND_URL

📂 Project Structure
ai-calling-agent/
│
├── backend/
│   ├── index.js
│   ├── customers.json
│   ├── call_logs.json
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/CallLogs.jsx
│   ├── vite.config.js
│   ├── package.json
│
└── README.md

🔗 Live Demo Links
Component	URL
Frontend Live URL	https://ai-calling-agent-teal.vercel.app

Backend API URL	https://ai-calling-agent-production-fca2.up.railway.app/customers

GitHub Repo	(your repo link here)
📞 How Call Trigger Works

User clicks Call on frontend

Frontend sends POST → /call

Backend checks:

Order status (pending/delayed only)

If allowed:

Backend returns a demo SID

Frontend shows confirmation popup

Backend saves the log into call_logs.json

🧪 Example API Responses
✔ GET /customers
[
  {
    "id": "1",
    "name": "Amit Sharma",
    "number": "+919876543210",
    "order_status": "pending",
    "order_id": "ORD-1001",
    "notes": "urgent"
  }
]

✔ POST /call
{
  "success": true,
  "sid": "DEMO-1765566621546",
  "source": "demo"
}

🛠 Installation Guide
Backend Setup
cd backend
npm install
node index.js


Runs on:

http://localhost:4000

Frontend Setup
cd frontend
npm install
npm run dev


Runs on:

http://localhost:5173

🎯 Bonus Features Implemented

Call Logs Page (/logs)

Search by customer name

Filter by order status

Live logs from backend

📝 Screenshots
✔ Call Trigger Popup

(Add screenshot here)

✔ Customer Table

(Add screenshot here)

✔ Call Logs

(Add screenshot here)

🏁 Conclusion

This project demonstrates:

Full-stack development (Node.js + React)

REST API design

Environment variables & deployment

Basic AI decision-making logic

Frontend + backend integration

Real-time call simulation workflow
