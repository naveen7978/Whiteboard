
Whiteboard App

This is a full-stack collaborative whiteboard application that allows users to draw, erase, add text, and share canvases in real time. The project is split into a React frontend and a Node.js/Express backend, with MongoDB for data storage and Socket.IO for real-time updates.

Table of Contents

- Features
- Project Structure
- Tech Stack
- Getting Started (Local Development)
- Environment Variables
- Deployment
- Usage
- Contributing
- License

Features

- Real-time collaborative drawing and erasing
- Add and edit text on the canvas
- Multiple canvases per user
- Canvas sharing with other users by email
- Canvas renaming and deletion (owner only)
- User registration and authentication (JWT)
- Responsive, modern UI
- Live updates for all users on a shared canvas

Project Structure

whiteboard-app/
  backend/
    config/
      db.js
    controllers/
      canvasController.js
      userController.js
    middlewares/
      authMiddleware.js
    models/
      canvasModel.js
      userModel.js
    package-lock.json
    package.json
    routes/
      canvasRoutes.js
      userRoutes.js
    server.js
  frontend/
    jsconfig.json
    package-lock.json
    package.json
    postcss.config.js
    public/
      favicon.ico
      index.html
      logo192.png
      logo512.png
      manifest.json
      robots.txt
    README.md
    src/
      App.js
      components/
        Board/
          index.js
          index.module.css
        Login/
          index.js
          index.module.css
        Register/
          index.js
          index.module.css
        Sidebar/
          index.js
          index.min.css
        Toolbar/
          index.js
          index.module.css
        Toolbox/
          index.js
          index.module.css
      constants.js
      index.css
      index.js
      store/
        board-context.js
        BoardProvider.js
        toolbox-context.js
        ToolboxProvider.js
      utils/
        api.js
        element.js
        math.js
        socket.js
    tailwind.config.js

Tech Stack

- Frontend: React, Axios, Socket.IO Client, CSS Modules, Tailwind CSS
- Backend: Node.js, Express, Socket.IO, Mongoose, JWT, bcrypt
- Database: MongoDB (Atlas)
- Deployment: Vercel (frontend), Render (backend)

Getting Started (Local Development)

1. Clone the repository

   git clone https://github.com/yourusername/whiteboard-app.git
   cd whiteboard-app

2. Set up the backend

   cd backend
   npm install

   Create a .env file in the backend/ directory with the following variables:

   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000

   Start the backend server:

   npm start

3. Set up the frontend

   Open a new terminal window/tab:

   cd frontend
   npm install

   Create a .env file in the frontend/ directory with the following variable:

   REACT_APP_API_URL=http://localhost:5000

   Start the frontend development server:

   npm start

   The app will be available at http://localhost:3000.

Environment Variables

Backend (backend/.env)

- PORT: Port for the backend server (default: 5000)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT authentication
- CLIENT_URL: URL of the frontend (for CORS)

Frontend (frontend/.env)

- REACT_APP_API_URL: URL of the backend API (e.g., http://localhost:5000 for local development, or your Render URL in production)

Deployment

Backend (Render)

1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Set the root directory to backend.
4. Set the start command to npm start.
5. Add your environment variables in the Render dashboard.
6. Deploy!

Frontend (Vercel)

1. Push your code to GitHub.
2. Create a new project on Vercel.
3. Set the root directory to frontend.
4. Set the build command to npm run build and output directory to build.
5. Add your environment variable REACT_APP_API_URL (pointing to your Render backend URL).
6. Deploy!

Note:  
After deployment, update your backend’s CLIENT_URL to your Vercel frontend URL, and your frontend’s REACT_APP_API_URL to your Render backend URL.

Usage

- Register a new account or log in.
- Create new canvases, draw, erase, and add text.
- Share canvases with other users by email.
- Only the owner can rename or delete a canvas.
- All changes are synced in real time for all users on the same canvas.

Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

License

This project is licensed under the MIT License.

