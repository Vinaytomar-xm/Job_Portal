# 🚀 QUICK START - Vite + React Job Portal

## Step 1: Start Backend

```bash
cd backend
npm install
npm run seed    # Creates test users and jobs
npm run dev     # Starts on port 5000
```

**You should see:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Step 2: Start Frontend

Open a **NEW terminal** window:

```bash
cd frontend
npm install
npm run dev     # Starts on port 3000
```

**You should see:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

## Step 3: Open Browser

Go to: `http://localhost:3000`

## Step 4: Login

### Test as User:
- Email: `user@test.com`
- Password: `123456`

**You can:**
- Browse jobs
- Search jobs
- Apply to jobs
- Track applications

### Test as Admin:
- Email: `admin@test.com`
- Password: `admin123`

**You can:**
- Create new jobs
- Edit jobs
- Delete jobs
- View all applications
- Update application status

---

## 🎯 Key Features to Test

### As User:
1. Click "Browse Jobs" → See all available jobs
2. Click "View Details" on any job → Opens modal with full details
3. Click "Apply Now" → Submits application
4. Click "My Applications" → See all your applications with status

### As Admin:
1. Click "Manage Jobs" → See all posted jobs
2. Click "+ Post New Job" → Create a new job posting
3. Click edit icon on job → Modify job details
4. Click "Applications" → See all applications from users
5. Change status dropdown → Update application status

---

## 🔥 React Features to Notice

### 1. **React Router** - URL changes without page reload
- `/login` → Login page
- `/user/dashboard` → User dashboard
- `/admin/dashboard` → Admin dashboard

### 2. **Protected Routes** - Try accessing admin dashboard as user
- Automatically redirects to appropriate dashboard

### 3. **Context API** - Auth state available everywhere
- No prop drilling
- Global user state

### 4. **Component Reusability**
- Same `JobCard` component used in user and admin views
- Different behavior based on props

### 5. **Real-time Updates**
- Apply to job → Application count updates instantly
- Create job → Job appears in list immediately

---

## 📊 File Structure Overview

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── JobCard.jsx     # Job display card
│   ├── JobModal.jsx    # Job details popup
│   └── Toast.jsx       # Notification system
├── context/
│   └── AuthContext.jsx # Global auth state
├── pages/
│   ├── Login.jsx       # Login page
│   ├── UserDashboard.jsx   # User interface
│   └── AdminDashboard.jsx  # Admin interface
├── services/
│   └── api.js          # Axios + API calls
└── App.jsx             # Routes + App structure
```

---

## 🎓 What You're Learning

### React Concepts:
✅ Functional components
✅ React Hooks (useState, useEffect, useContext)
✅ Context API for state management
✅ React Router for navigation
✅ Protected routes
✅ Conditional rendering
✅ Component composition
✅ Props and prop drilling

### Modern JavaScript:
✅ ES6+ features (arrow functions, destructuring, spread)
✅ Async/await
✅ Promises
✅ Module imports/exports

### Full-Stack Integration:
✅ API calls with Axios
✅ JWT authentication flow
✅ Request/response interceptors
✅ Error handling
✅ Loading states

---

## 🚨 Troubleshooting

### Frontend won't start:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection error:
- Make sure MongoDB is running: `mongod`
- Check backend is on port 5000
- Check .env file has correct MONGODB_URI

### "Cannot find module":
```bash
# In the directory with the error:
npm install
```

---

## 🎯 Next Steps

Once you've tested both dashboards:

1. **Explore the code:**
   - Open `frontend/src/pages/UserDashboard.jsx`
   - See how jobs are fetched and displayed
   - Check how state is managed

2. **Make changes:**
   - Try changing the accent color in `index.css`
   - Add a new field to job form
   - Modify the dashboard layout

3. **Add features:**
   - Add job bookmarking
   - Implement advanced filters
   - Add user profile page

---

**Ready to dive deeper? Check the full README.md!**
