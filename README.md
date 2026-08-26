# 🤝 DevLink — Find Teammates. Build Together.

DevLink is a full-stack collaboration platform designed to solve a common student problem: the difficulty of finding the right teammates for hackathons, group projects, and developer events. 

Whether you are a first-year student without a massive network of coding friends, or an experienced developer looking for peers who will push your boundaries, DevLink acts as a "job application portal" specifically built for hackathon teams.

---

## 💡 The Problem & The Solution

During hackathons and team-based events, you might be full of ideas and motivation but lack access to developers who complement your skill set. Traditional professional networking platforms (like LinkedIn) are too general, while messaging apps (like Discord or WhatsApp) lack structure.

**DevLink** solves this by providing:
1. **Team-First Discovery**: Search teams by the specific hackathon event name or target stack.
2. **Role-Based Applications (Positions)**: Teams list exact roles they need (e.g., *"Backend Developer"* or *"UI/UX Designer"*), outlining specific required skills.
3. **Application & Pitch Workflow**: Instead of instant public joining, candidates submit a personal pitch outlining their interest and skills. Team owners can then accept or reject applicants to curate their ideal squad.

---

## 🧠 Core Features

- 👥 **Team Recruiting Hub**: Create teams for specific hackathons and manage open positions.
- 📝 **Role-Based Positions**: Open-role listings within teams, tracking status (`Open` or `Filled`) and required skills.
- ✉️ **Join Requests & Pitching**: Job-board-style join applications with reviewable candidate messages for team owners.
- 👤 **Developer Profiles & Portfolios**: Showcases skills, location, GitHub/LinkedIn links, and active team counts.
- 📝 **Community Feed**: A social updates feed where users can share progress, seek suggestions, and comment/hash-tag.
- 🔐 **Secure Session Auth**: Stateless authentication using JWTs and protected client/server routing.

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)** — Optimized build toolchain and fast development.
- **React Router DOM** — Client-side SPA routing.
- **Zustand & Context API** — Global state management for authentication, community posts, and team listings.
- **Tailwind CSS (v3)** — Modern utility-first styling with dark/light mode configurations.
- **Axios & Fetch API** — Centralized request wrapper with integrated JWT token management.

### Backend
- **Node.js & Express.js** — Modular and clean RESTful API framework.
- **MongoDB & Mongoose** — NoSQL database storage with structured schema validations.
- **JSON Web Tokens (JWT)** — Stateless user session management.
- **Bcrypt.js** — Secure password hashing middleware.

---

## 🗃 Database Schema & Relationships

The database consists of **6 primary collections** designed with clear relational schemas:

1. **User** (`users`): Renders basic authentication credentials, email, hashed passwords, and system roles.
2. **Profile** (`profiles`): Contains rich developer portfolios, biographies, locations, skills, avatars, and social links.
3. **Post** (`posts`): Manages social feed updates, author references, tags, and likes.
4. **Team** (`teams`): Manages team profiles, unique URL-friendly slugs, target hackathons, repositories, and active members.
5. **Position** (`positions`): Tracks open roles created by team owners, details required skills, and keeps track of the accepted applicant.
6. **JoinRequest** (`joinrequests`): Functions as a join table linking candidates to teams, storing their custom cover letter/pitch and request status (`pending`/`accepted`/`rejected`).

---

## 📁 Project Structure

```
DevLink/
├── devlink-frontend/ ← React (Vite) client application
│   ├── src/
│   │   ├── components/  ← Global UI elements (Navbar, Layout)
│   │   ├── pages/       ← Route layouts (Auth, Profile, Posts, Teams, Users)
│   │   ├── store/       ← State handlers (Zustand & Context Providers)
│   │   ├── utils/       ← Universal API fetching helpers
│   │   ├── App.jsx      ← Core routing and layout mapping
│   │   └── main.jsx
│   ├── .env             ← Client environments (VITE_API_URL)
│   └── package.json
│
├── devlink-backend/  ← Express API server
│   ├── middleware/      ← Authentication validation checks
│   ├── models/          ← Mongoose schemas (User, Profile, Teams, Post, Position, JoinRequest)
│   ├── routes/          ← API route endpoints
│   ├── server.js        ← Core server entry point
│   ├── .env             ← Server configurations (PORT, MONGO_URI, JWT_SECRET)
│   └── package.json
│
└── README.md
```

---

## 🧩 Running the App Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas Connection String)

### 1. Setup Backend
1. Go to the backend directory:
   ```bash
   cd devlink-backend
   ```
2. Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 2. Setup Frontend
1. Go to the frontend directory:
   ```bash
   cd devlink-frontend
   ```
2. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.
