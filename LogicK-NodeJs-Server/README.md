## LogiK Backend (Node.js + Express + MongoDB)

Production-ready backend for the LogiK SaaS logging platform.

### Tech Stack

- **Node.js**, **Express**
- **MongoDB** with **Mongoose**
- **JWT** authentication
- **bcrypt** for password hashing
- **dotenv** for environment variables

### Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env` file in the project root**

```bash
MONGODB_URI=mongodb://localhost:27017/logik
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1d
PORT=4000
```

3. **Run in development**

```bash
npm run dev
```

4. **Production build (same for now)**

```bash
npm start
```

### Deploy to Vercel

1. **Install Vercel CLI** (optional, can also use GitHub integration)

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

3. **Set Environment Variables in Vercel Dashboard**

Go to your project settings → Environment Variables and add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=production
```

**Note**: The `PORT` variable is not needed for Vercel (it's handled automatically).

4. **MongoDB Connection for Serverless**

The app is optimized for serverless deployment:
- Connection pooling and reuse across invocations
- Automatic connection handling on cold starts
- No process exit on connection errors in production

### API Overview

- **POST** `/api/auth/register` – Register a new user (public)
- **POST** `/api/auth/login` – Login user (public)
- **POST** `/api/auth/client-auth` – Get JWT token using clientId & clientSecret (public)
- **GET** `/api/client/details` – Get clientId & clientSecret (protected)
- **POST** `/api/client/refresh-secret` – Refresh clientSecret (protected)
- **POST** `/api/logs/ingest` – Bulk ingest logs (protected – SDK use)
- **GET** `/api/logs/analysis` – Get log analysis stats for the authenticated user (protected)
- **GET** `/api/logs` – Get paginated logs for the authenticated user (protected, query: `pageNo`, `pageSize`)

All responses follow:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

