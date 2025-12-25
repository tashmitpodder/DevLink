# 🤝 DevLink — Find Teammates. Build Together.

Welcome to DevLink, a full stack social networking site that I've developed based on my personal experience of having difficulty in finding good team members to work on projects during college hackathons.

In hackathons, I was often full of ideas and motivation but could not easily connect with developers who could complement me or share the same goal. The platforms available were too general and not geared towards students, hackathons, or networking for collaboration purposes.

DevLink is my solution for this problem and provides a specifically targeted forum for connecting and teaming up with fellow developers in a clean and professional environment.

---

## 🧠 What does DevLink do?

DevLink allows developers to communicate effectively.

It offers:

- 📝 **A social news feed** to share posts and updates  
- 👥 **Team formation and searching** for hackathons & projects  
- 🔍 **Searchable teams** by tags and keywords  
- 👤 **Developer profiles** with skills and links  
- 🔐 **Secure authentication** and protected routes  

The system was intended to be **scalable, modular, and extensible**.

---

## 🛠 Tech Stack (Detailed)

### Frontend
- **React (Vite)** — fast development environment and optimized builds  
- **React Router DOM** — simplified client-side routing  
- **Context API / Zustand** — global state management (auth, posts, teams)  
- **Axios / Fetch** — API communication layer  
- **Reusable component architecture** — clear separation of pages and UI components  
- **Clean, minimal UI** — inspired by LinkedIn & GitHub  

### Backend
- **Node.js** — JavaScript runtime  
- **Express.js** — REST API framework  
- **MongoDB** — NoSQL database with flexible data modeling  
- **Mongoose** — schema-based models and validation  
- **JWT (JSON Web Tokens)** — stateless authentication  
- **Middleware-based auth protection** — route-level security  
- **Slug-based routing** — clean and readable team URLs  

---

## 🗃 Database Models

- **User** — authentication, profile data, skills, social links  
- **Post** — content, author reference, timestamps  
- **Team** — name, description, tags, members, unique slug  

---

## 📁 Project Structure (Simplified)
DevLink/
├── client/ ← React (Vite) frontend
│ ├── pages/ ← Page-level components
│ ├── components/ ← Reusable UI components
│ ├── store/ ← Global state (auth, posts, teams)
│ ├── utils/ ← API helpers and utilities
│ └── main.jsx
│
├── server/ ← Node.js + Express backend
│ ├── routes/ ← API routes
│ ├── controllers/ ← Business logic
│ ├── models/ ← Mongoose schemas
│ ├── middleware/ ← Auth & error handling
│ └── server.js
│
├── .env ← Environment variables
├── package.json
└── README.md

---

## 🧰 Development & Tooling

- RESTful API design  
- Environment-based configuration (`.env`)  
- Modular backend structure (routes, controllers, middleware)  
- Git & GitHub — version control  
- Clean code practices — readable, maintainable, scalable  

---

## 🧩 How It Works

1. Users register or log in using **JWT-based authentication**  
2. Authenticated users gain access to a **protected feed**  
3. Users can create posts or browse others’ posts  
4. Teams are created for **hackathons or projects**  
5. Teams are discoverable via **tags, search, and clean URLs**  
6. Developer profiles centralize **skills and social links**  

The architecture supports **incremental feature additions without major refactors**.

---

## 📚 What I Learned

- Designing a scalable **MERN architecture**  
- Implementing secure **JWT authentication**  
- Structuring clean and maintainable backend APIs  
- Managing global frontend state across features  
- Building products around **real user problems**

---

## 🚀 Future Plans

- Real-time chat between teammates  
- Hackathon-specific team discovery  
- Notifications & activity tracking  
- Advanced profile customization  
- Deployment with CI/CD  
- Mobile-friendly & PWA support  

---

If you're a **student developer**, **hackathon enthusiast**, or someone who enjoys building collaborative platforms, I hope **DevLink** gives you ideas or inspiration.

Feel free to fork, explore, and contribute 🚀

