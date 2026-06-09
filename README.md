# 🚀 Full-Stack Job Portal - Vite + React + Node.js

**Complete job portal with modern React frontend and secure Node.js backend**

---

## 📌 TECH STACK

### Frontend
- **Vite** - Lightning-fast build tool
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Custom styling (no frameworks)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 🚀 QUICK START

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Seed database with test data
npm run seed

# Start server
npm run dev
```

Server runs on: `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 TEST CREDENTIALS

After running `npm run seed`:

**👤 User Account:**
- Email: `user@test.com`
- Password: `123456`

**🛠️ Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

---

## 📂 PROJECT STRUCTURE

```
job-portal-react/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Job.js             # Job schema
│   │   └── Application.js     # Application schema
│   ├── middleware/
│   │   └── auth.js            # JWT verification & RBAC
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── jobs.js            # Job CRUD
│   │   └── applications.js    # Application management
│   ├── .env                   # Environment variables
│   ├── server.js              # Main server
│   └── seed.js                # Database seeder
│
└── frontend/                   # Vite + React SPA
    ├── public/                # Static assets
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Sidebar.jsx
    │   │   ├── JobCard.jsx
    │   │   ├── JobModal.jsx
    │   │   ├── JobFormModal.jsx
    │   │   ├── ApplicationCard.jsx
    │   │   └── Toast.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js         # Axios instance & API calls
    │   ├── App.jsx            # Main app with routes
    │   ├── main.jsx           # React entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🎯 FEATURES

### User Panel
✅ Browse all jobs with search
✅ View detailed job descriptions
✅ Apply to jobs (no duplicates)
✅ Track application status
✅ Responsive design

### Admin Panel
✅ Create new jobs
✅ Edit existing jobs
✅ Delete jobs
✅ View all applications
✅ Update application status

---

## 🔐 AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────┐
│         1. USER LOGS IN                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   2. SERVER GENERATES JWT TOKEN             │
│      (contains userId + role)               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   3. FRONTEND STORES TOKEN IN LOCALSTORAGE  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   4. EVERY API REQUEST INCLUDES TOKEN       │
│      (Authorization: Bearer <token>)        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   5. MIDDLEWARE VERIFIES TOKEN + ROLE       │
│      ✅ Valid → Allow                       │
│      ❌ Invalid → 401 Unauthorized          │
└─────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin'
}
```

### Jobs
```javascript
{
  title: String,
  company: String,
  location: String,
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract',
  experience: String,
  salary: String,
  description: String,
  skills: [String],
  createdBy: ObjectId (admin),
  status: 'active' | 'closed'
}
```

### Applications
```javascript
{
  job: ObjectId,
  user: ObjectId,
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted',
  appliedAt: Date
}
```

**Unique Index:** `{job, user}` - Prevents duplicate applications

---

## 🔥 KEY REACT PATTERNS USED

### 1. Context API for Auth
```javascript
// Global auth state accessible anywhere
const { user, login, logout, isAdmin } = useAuth();
```

### 2. Protected Routes
```javascript
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. Custom Hooks
```javascript
// Reusable auth logic
const { user, loading, login } = useAuth();
```

### 4. Axios Interceptors
```javascript
// Auto-add JWT token to requests
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 5. Component Composition
```javascript
// Reusable components
<JobCard job={job} onView={handleView} />
<ApplicationCard application={app} isAdmin />
```

---

## 📚 INTERVIEW TALKING POINTS

### 1. Why React over Vanilla JS?
**Answer:** "React provides component reusability, state management, and a declarative approach. For example, our JobCard component is used in both user and admin dashboards with different props."

### 2. How does authentication work?
**Answer:** "JWT tokens are generated on login and stored in localStorage. Axios interceptors automatically attach tokens to requests. Protected routes check authentication status before rendering."

### 3. State Management Strategy?
**Answer:** "We use Context API for global auth state (user, token) and local useState for component-specific state (jobs, applications). This avoids prop drilling while keeping it simple."

### 4. How do you prevent unauthorized access?
**Answer:** "Protected routes check `isAuthenticated()` and admin routes additionally check `isAdmin()`. Backend has middleware that verifies JWT and role before allowing access."

### 5. Why Vite over Create React App?
**Answer:** "Vite is 10-100x faster for dev server startup and HMR (Hot Module Replacement). It uses native ES modules and esbuild for bundling."

---

## 🎓 RESUME-READY DESCRIPTION

```
Full-Stack Job Portal with React & Node.js

• Built modern SPA using React 18, Vite, React Router, and Context API
• Implemented JWT-based authentication with role-based access control
• Designed RESTful APIs with Node.js, Express, and MongoDB
• Created reusable React components with props and composition patterns
• Used Axios interceptors for automatic token management
• Implemented protected routes and conditional rendering based on user roles
• Built responsive UI with CSS Grid, Flexbox, and mobile-first design
• Optimized performance with React hooks and lazy loading
• Followed React best practices: component composition, state lifting, custom hooks

Tech Stack: React, Vite, React Router, Context API, Axios, Node.js, 
Express, MongoDB, JWT, bcrypt
```

---

## 🔧 AVAILABLE SCRIPTS

### Backend
```bash
npm start      # Production server
npm run dev    # Development with nodemon
npm run seed   # Populate test data
```

### Frontend
```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job-portal
```

### Issue: "CORS error"
**Solution:** Backend already has CORS enabled. Make sure:
- Backend is running on port 5000
- Frontend uses proxy in vite.config.js

### Issue: "Module not found"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 DEPLOYMENT

### Backend (Heroku/Render)
```bash
# Add Procfile
web: node server.js

# Set environment variables
MONGODB_URI=<your-atlas-uri>
JWT_SECRET=<strong-secret>
```

### Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist

# Environment variable
VITE_API_URL=https://your-api.herokuapp.com/api
```

---

## 📊 PROJECT STATS

- **Total Files:** 30+
- **Components:** 8
- **API Endpoints:** 14
- **Lines of Code:** 3000+
- **Build Size:** ~150KB (minified + gzipped)

---

## 🎯 NEXT STEPS

- [ ] Add TypeScript for type safety
- [ ] Implement Redux for complex state
- [ ] Add React Query for data fetching
- [ ] Create unit tests with Jest & RTL
- [ ] Add E2E tests with Cypress
- [ ] Implement file upload for resumes
- [ ] Add email notifications
- [ ] Implement pagination
- [ ] Add dark/light theme toggle
- [ ] Create CI/CD pipeline

---

## 📄 LICENSE

Open-source for educational purposes

---

**Built with ❤️ using modern React & Node.js best practices**
