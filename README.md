# 🚀 JobBoard – Full-Stack Job Platform

An Internshala/LinkedIn-style job portal with:
- Public job browsing (no login required)
- Job seeker registration + application tracking
- Company registration + job posting + application management
- **Automatic email notifications** when company approves/rejects/shortlists

---

## 📁 Project Structure

```
jobplatform/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js          # Supports user / company / admin roles
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js          # /api/auth/*
│   │   ├── jobs.js          # /api/jobs/*
│   │   └── applications.js  # /api/applications/*
│   ├── utils/email.js       # Nodemailer email sender
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx   # JWT auth state
        │   └── ToastContext.jsx  # Notification toasts
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── JobCard.jsx
        │   ├── ApplyModal.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Home.jsx            # Public landing page
            ├── Jobs.jsx            # Browse + filter jobs
            ├── JobDetail.jsx       # Single job view
            ├── Login.jsx
            ├── Register.jsx        # Job seeker signup
            ├── CompanyRegister.jsx # Company signup
            ├── UserDashboard.jsx   # Applicant's applications
            ├── CompanyDashboard.jsx# Company: manage jobs & apps
            └── PostJob.jsx         # Create job listing
```

---

## ⚙️ Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 .env Configuration

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-platform
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Gmail (for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password       # Use Gmail App Password, NOT your real password
EMAIL_FROM=JobBoard <your-email@gmail.com>
```

### 📧 Gmail App Password Setup
1. Go to your Google Account → Security
2. Enable 2-Factor Authentication
3. Search for "App Passwords"
4. Create a new App Password → select "Mail"
5. Copy the 16-character password into `EMAIL_PASS`

> If email is not configured, the app still works — it just logs to console instead of sending.

---

## 🎯 How It Works

### For Job Seekers
1. Visit `/` → browse featured jobs without logging in
2. Click "Apply Now" → redirected to login/signup
3. After login → apply with cover letter & resume link
4. Track applications in `/dashboard` with real-time status

### For Companies
1. Register at `/company/register`
2. Post jobs at `/company/post-job`
3. View applications in `/company/dashboard`
4. Change application status (Reviewed → Shortlisted → Accepted / Rejected)
5. **Candidate automatically receives an email when status changes!**

---

## 🛣️ API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Job seeker signup |
| POST | /api/auth/company-register | Public | Company signup |
| POST | /api/auth/login | Public | Login (all roles) |
| GET | /api/jobs | Public | Browse jobs (filterable) |
| GET | /api/jobs/featured | Public | Latest 6 jobs for homepage |
| GET | /api/jobs/:id | Public | Single job detail |
| POST | /api/jobs | Company | Post new job |
| DELETE | /api/jobs/:id | Company | Delete own job |
| POST | /api/applications/:jobId/apply | User | Apply to a job |
| GET | /api/applications/my-applications | User | My applications |
| GET | /api/applications/company-applications | Company | All incoming apps |
| PUT | /api/applications/:id/status | Company | **Update status → triggers email** |

---

## 📧 Email Notification Flow

```
Company changes status
        ↓
PUT /api/applications/:id/status
        ↓
utils/email.js → sendStatusUpdateEmail()
        ↓
Nodemailer → Gmail SMTP
        ↓
Candidate's inbox ✉️
```

Statuses that trigger emails: `reviewed`, `shortlisted`, `accepted`, `rejected`

Each status sends only once (tracked via `emailSentFor` field on Application).

---

## 🔒 Security — httpOnly Cookies + GDPR

### Why httpOnly Cookies instead of localStorage?

| | localStorage | httpOnly Cookie |
|---|---|---|
| XSS Attack | ❌ JS can steal the token | ✅ JS can't read it at all |
| CSRF Attack | ✅ Not sent automatically | ⚠️ Use SameSite=lax/none |
| Storage | Browser JS | Secure browser cookie jar |
| Our choice | ❌ Old approach | ✅ Current approach |

### How it works in this project

```
LOGIN
  POST /api/auth/login
  → Server signs JWT
  → Server calls res.cookie('jb_token', token, { httpOnly: true })
  → Response body contains only { user: {...} }  ← NO token!
  → Browser stores cookie automatically (not accessible by JS)

EVERY REQUEST
  axios: withCredentials: true
  → Cookie is sent automatically with every API request
  → Server reads it via req.cookies.jb_token

LOGOUT
  POST /api/auth/logout
  → Server calls res.clearCookie('jb_token')
  → Cookie is gone
```

### Cookie settings by environment

| Setting | Development | Production |
|---|---|---|
| `secure` | false (HTTP ok) | true (HTTPS only) |
| `sameSite` | lax | none (for cross-origin) |
| `httpOnly` | true | true |
| `maxAge` | 7 days | 7 days |

### GDPR Cookie Banner

The banner appears on first visit and offers:
- **Necessary cookies** — always on (auth session, cannot refuse)
- **Analytics cookies** — optional toggle
- **Preference cookies** — optional toggle

User choice is saved in `localStorage` as `jb_cookie_consent`.
Users can reopen the banner anytime via **Footer → Cookie Preferences**.
