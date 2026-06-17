# DevConnect

DevConnect is a full-stack developer networking platform where developers can create profiles, share posts, like/comment on posts, search other developers by skills, and connect through GitHub/LinkedIn links.

## Live Demo

Frontend: https://devconnect-phi-two.vercel.app  
Backend: https://devconnect-backend-kgte.onrender.com

## Features

- User registration and login
- JWT authentication using httpOnly cookies
- Protected backend routes
- Developer profile with bio, skills, GitHub, LinkedIn, and avatar
- Create, view, like, and delete posts
- Add and view comments on posts
- Search developers by skills
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend

- Next.js 14
- React
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors
- Multer

## Folder Structure

```text
devconnect/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    └── middleware.js
```

## Environment Variables

### Backend `.env`

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

For production on Render:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production on Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/vishalrai05/devconnect.git
cd devconnect
```

### 2. Setup backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```text

```https://your-render-backend-url.onrender.com

### 3. Setup frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
https://devconnect-phi-two.vercel.app
```

## Deployment

### Backend on Render

Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add backend environment variables in Render.

### Frontend on Vercel

Use these settings:

```text
Root Directory: frontend
Framework: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: leave empty
```

Add this environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

## Important Production Notes

Because the frontend and backend are deployed on different domains, auth cookies must use:

```js
sameSite: "none"
secure: true
```

The backend CORS setup must also allow the deployed frontend URL:

```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

## API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Users

```text
GET  /api/users
GET  /api/users/:id
PUT  /api/users/:id
POST /api/users/:id/avatar
```

### Posts

```text
GET    /api/posts
POST   /api/posts
DELETE /api/posts/:id
PUT    /api/posts/:id/like
POST   /api/posts/:id/comment
GET    /api/posts/:id/comments
```

## Author

Vishal Rai

