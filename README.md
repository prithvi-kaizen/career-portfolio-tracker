# Career Portfolio Tracker

A modern, production-ready web application to track internships, certifications, and skills in a clean, professional CRM-style dashboard.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwindcss)

## ✨ Features

- **Dashboard** — Overview with stats strip and recent activity
- **Internship Tracking** — Company, role, duration, status, skills used
- **Skill Management** — Proficiency levels (1-5), categories, learning status
- **Certification Logging** — Platform, dates, credential links
- **Authentication** — Secure email/password login with JWT
- **Responsive Design** — Works on desktop, tablet, and mobile

## 🎨 Design Philosophy

- Clean, minimalist CRM-style UI
- White/off-white backgrounds with dark neutral text
- Subtle indigo accent color
- Inter font for modern typography
- Tables for structured data (not cards)
- No unnecessary animations or decorations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/prithvirajsangramsinhpatil/career-portfolio-tracker.git
cd career-portfolio-tracker

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/career-portfolio
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Running the Application

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📁 Project Structure

```
career-portfolio-tracker/
├── server/                     # Backend API
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/auth.js     # JWT authentication
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Internship.js
│   │   ├── Skill.js
│   │   └── Certification.js
│   ├── routes/                # REST API endpoints
│   │   ├── auth.js
│   │   ├── internships.js
│   │   ├── skills.js
│   │   └── certifications.js
│   └── index.js               # Express server
│
└── client/                     # React frontend
    └── src/
        ├── components/        # Reusable UI components
        │   ├── NavigationBar.jsx
        │   ├── PageHeader.jsx
        │   ├── StatCard.jsx
        │   ├── DataTable.jsx
        │   ├── PrimaryButton.jsx
        │   └── ModalForm.jsx
        ├── pages/             # Page components
        │   ├── Dashboard.jsx
        │   ├── Internships.jsx
        │   ├── Skills.jsx
        │   ├── Certifications.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── context/           # React context
        │   └── AuthContext.jsx
        └── utils/
            └── api.js         # Axios instance
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/me` | Get current user |

### Resources (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internships` | List all internships |
| POST | `/api/internships` | Create internship |
| PUT | `/api/internships/:id` | Update internship |
| DELETE | `/api/internships/:id` | Delete internship |

Same pattern applies for `/api/skills` and `/api/certifications`.

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📱 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Prithviraj Sangramsinhpatil**
- GitHub: [@prithvirajsangramsinhpatil](https://github.com/prithvi-kaizen)
- LinkedIn: [Prithviraj Sangramsinhpatil](www.linkedin.com/in/prithviraj6544)

---

⭐ Star this repo if you find it helpful!
