<br/>
<div align="center">
  <h1 align="center">SkillSync 🚀</h1>
  <p align="center">
    <strong>An AI-powered Career & Job Portal connecting talent with opportunity.</strong>
    <br />
    <br />
    <a href="#key-features">Features</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#getting-started">Getting Started</a>
  </p>
</div>
---
## 📖 Overview
**SkillSync** is a modern, full-stack career platform designed to streamline the hiring process for both candidates and employers. It features unified authentication, state-of-the-art Role-Based Access Control (RBAC), real-time bidirectional messaging, and deeply integrated AI capabilities.
The core highlight of SkillSync is its **AI Resume Scorer**, which instantly evaluates uploaded PDFs against target job descriptions using large language models, providing candidates with Fit Scores, Strengths, Actionable Suggestions, and missing keywords to beat modern ATS systems.
## ✨ Key Features
- **🧠 AI-Powered Resume Scoring**: Instantly extracts text from PDF resumes and leverages the HuggingFace Inference API (Llama 3.1) to return structured JSON analytics and a Fit Score.
- **💬 Real-Time Chat**: Integrated WebSockets (Socket.io) to facilitate instantaneous, secure messaging between approved candidates and hiring admins.
- **🔐 Secure Architecture**: Implements unified JWT-based authentication, password hashing (bcrypt), robust CORS, and API Rate Limiting to prevent brute-force attacks.
- **💼 Smart Job Matching**: Dedicated dashboards for users to browse, track, and apply for roles, while admins can manage job postings via comprehensive CRUD operations.
- **🎨 State-of-the-Art UI/UX**: Designed with a premium "Glassmorphic" aesthetic, featuring carefully crafted micro-animations, high-end typography (DM Sans & Instrument Serif), and robust Dark Mode support.
## 🛠️ Tech Stack
### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons & UI**: [Lucide React](https://lucide.dev/), Sonner (Toasts)
- **Forms**: React Hook Form, Zod
### Backend (Server)
- **Core**: Node.js, [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Authentication**: JSON Web Tokens (JWT), Bcrypt, Passport.js
- **Real-Time**: [Socket.io](https://socket.io/)
- **AI Integration**: [Hugging Face API](https://huggingface.co/) via Axios, `unpdf` for fast PDF buffer parsing
---
## 🚀 Getting Started
Follow these steps to set up the project locally on your machine.
### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- A free [HuggingFace Account](https://huggingface.co/) for the Inference API token.
### 1. Clone the Repository
```bash
git clone https://github.com/your-username/skillsync.git
cd skillsync
```
### 2. Setup the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```
Create a `.env` file in the root of the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
HF_API_KEY=your_huggingface_access_token
CLIENT_ORIGINS=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```
*The server should now be running on `http://localhost:5000`.*
### 3. Setup the Frontend
Open a new terminal window and navigate to the `client` directory:
```bash
cd client
npm install
```
*(Optional)* Create a `.env` file in the `client` directory if you have prefixed Vite variables like `VITE_API_URL`.
Start the Vite development server:
```bash
npm run dev
```
*The client should now be running on `http://localhost:5173`.*
---
## 📁 Project Structure
```text
skillsync/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static Assets
│   └── src/
│       ├── Component/      # Reusable UI Blocks & ResumeScorer
│       ├── context/        # React Context API setup
│       ├── JobCrud/        # Admin Job Management Components
│       ├── Layouts/        # Dashboard & Auth Layout Wrappers
│       ├── pages/          # Full Page Views (Landing, Login, Signup)
│       └── utils/          # Axios Interceptors, Helpers
└── server/                 # Express Backend
    ├── Auth/               # Auth middlewares
    ├── config/             # DB & Environment configuration
    ├── controllers/        # Route logic (AI Scoring, CRUD, Profile)
    ├── models/             # Mongoose Schemas (User, Admin, Job, Message, App)
    ├── routes/             # Express API Routers
    └── utils/              # Helper functions, Logger
```
---
## 🔒 Security Measures
- **Rate Limiting**: `express-rate-limit` utilized to cap requests on auth endpoints.
- **Cross-Origin Resource Sharing**: Specific `CLIENT_ORIGINS` bound via CORS.
- **Token Security**: Standardized 7-day expiration cycles on encoded JWTs.
<div align="center">
  <p>Built with ❤️</p>
</div>
