# React + Vite + Express Student Scaffold

This is a small beginner-friendly full-stack web app scaffold.

## Project Structure

- `client/` = React frontend created with Vite
- `server/` = Node.js + Express backend

## What it demonstrates

- A React frontend calling backend API routes
- A Node.js + Express backend with two sample routes:
  - `GET /api/hello`
  - `GET /api/status`
- Development mode with the Vite dev server proxying API requests to Express
- Production mode where Express serves both the API and the built frontend from one port

## 1. Install dependencies

Open two terminals.

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

## 2. Set the server port

Inside `server/` copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and set the port.

The intended production port is `41xx`, where `xx` is the last two digits of the student ID.

Example:

```env
PORT=4127
```

## 3. Run locally in development

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

### How development works

- React runs on the Vite dev server
- Express runs separately on its own port
- Vite forwards requests that start with `/api` to the backend

That proxy is configured in `client/vite.config.js`.

## 4. Build for production

First build the frontend:

```bash
cd client
npm run build
```

This creates:

```text
client/dist/
```

## 5. Run in production

Start the Express server:

```bash
cd server
NODE_ENV=production npm start
```

In production:

- Express serves the API routes
- Express also serves the built React frontend from `client/dist`
- Everything runs from one port, the port in `server/.env`

## 6. Run on a remote Ubuntu server at 10.192.145.179

Copy the project to the server, or clone it there.

### Example steps on the remote server

```bash
git clone <your-repo-url>
cd <your-project-folder>/client
npm install
npm run build

cd ../server
npm install
cp .env.example .env
nano .env
```

Set the port in `.env` to something like:

```env
PORT=41xx
```

Then start the server:

```bash
NODE_ENV=production npm start
```

If the machine firewall is enabled, open the chosen port:

```bash
sudo ufw allow 41xx
```

Then visit:

```text
http://10.192.145.179:41xx
```

Replace `41xx` with the actual student port.

## Beginner Notes

### Frontend

The React app lives in `client/src/App.jsx`.
It uses `fetch()` to call the backend routes.

### Backend

The Express server lives in `server/index.js`.
It reads `PORT` from `.env` using `dotenv`.

### Why this is useful

This scaffold gives you a clean starting point for building a full-stack web app while keeping the architecture easy to understand.

Adding CI