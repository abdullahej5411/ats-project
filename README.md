# ATS — Multi-Branch Recruitment & Applicant Tracking System

## Tech Stack
- Frontend: React.js (Vercel/Netlify)
- Backend: Node.js + Express.js (Render)
- Database: MongoDB Atlas
- Files: Cloudinary
- Email: Gmail SMTP
- Auth: JWT

---

## Project Structure

```
ats-project/
├── backend/
│   ├── config/         (db.js, cloudinary.js)
│   ├── controllers/    (auth, branch, job, application, interview)
│   ├── middleware/     (auth.js)
│   ├── models/         (User, Branch, Job, Application, Interview)
│   ├── routes/         (auth, branches, jobs, applications, interviews)
│   ├── utils/          (sendEmail.js)
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/ (Navbar, StatusBadge)
    │   ├── context/    (AuthContext)
    │   ├── pages/      (auth, public, candidate, hr)
    │   └── utils/      (api.js)
    └── package.json
```

---

## Setup Instructions

### Backend

1. Go into backend folder:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create `.env` file (copy from `.env.example`):
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_google_app_password
CLIENT_URL=http://localhost:3000
HR_SECRET_CODE=hr123
```

4. Run in development:
```
npm run dev
```

---

### Frontend

1. Go into frontend folder:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Run:
```
npm start
```

---

## GitHub Workflow — For Group Members

### First time (clone and setup):
```bash
git clone https://github.com/yourusername/ats-project.git
cd ats-project
```

### Member 1 — Backend Foundation:
```bash
git checkout -b feature/backend-foundation
# Add: server.js, config/, middleware/, models/, routes/auth.js, routes/branches.js
git add .
git commit -m "Add: backend foundation - auth, models, branches"
git push origin feature/backend-foundation
# Create Pull Request on GitHub → merge to main
```

### Member 2 — Backend Features:
```bash
git checkout -b feature/backend-features
# Add: routes/jobs.js, routes/applications.js, routes/interviews.js
# Add: controllers/jobController.js, applicationController.js, interviewController.js
# Add: utils/sendEmail.js, config/cloudinary.js
git add .
git commit -m "Add: jobs, applications, interviews, email, cloudinary"
git push origin feature/backend-features
# Create Pull Request → merge to main
```

### Member 3 — Frontend:
```bash
git checkout -b feature/frontend
# Add: entire frontend/src folder
git add .
git commit -m "Add: complete React frontend - all pages and components"
git push origin feature/frontend
# Create Pull Request → merge to main
```

---

## Deployment

### Backend → Render
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect GitHub repo → set Root Directory to `backend`
4. Add all environment variables
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend → Vercel
1. Go to vercel.com → Import Project
2. Connect GitHub repo → set Root Directory to `frontend`
3. Add env variable: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## Default Test Accounts

After seeding or manually registering:
- Candidate: register at /register (role = candidate)
- HR Admin: register at /register (role = hr, HR code = hr123)

---

## API Endpoints Summary

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |
| GET | /api/jobs | Public |
| POST | /api/jobs | HR only |
| GET | /api/branches | Public |
| POST | /api/applications | Candidate |
| GET | /api/applications/my | Candidate |
| GET | /api/applications | HR |
| PUT | /api/applications/:id/status | HR |
| POST | /api/interviews | HR |
| GET | /api/interviews/my | Candidate |
