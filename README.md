# LinkKeeper - Bookmark Manager

A full-stack bookmark management application built with React (frontend) and Node.js/Express (backend) with MongoDB.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Bookmark Management**: Add, edit, delete, and organize bookmarks
- **Tag System**: Categorize bookmarks with custom tags
- **Search & Filter**: Search bookmarks by title, description, or URL, and filter by tags
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── link.controller.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Link.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── links.js
│   ├── index.js
│   ├── package.json
│   └── .env (create this file)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── LinkCard.js
│   │   │   └── AddLinkForm.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/linkkeeper
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=3000
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login

### Links (Protected routes)
- `GET /api/v1/links` - Get all links (with optional `?tag=js&search=react` filters)
- `GET /api/v1/links/tags` - Get all unique tags
- `POST /api/v1/links` - Create a new link
- `PATCH /api/v1/links/:id` - Update a link
- `DELETE /api/v1/links/:id` - Delete a link

## Usage

1. **Sign Up**: Create a new account or sign in if you already have one
2. **Add Links**: Click "Add Link" to bookmark websites
3. **Organize**: Add tags to categorize your bookmarks
4. **Search**: Use the search bar to find specific bookmarks
5. **Filter**: Use the tag dropdown to filter by categories
6. **Edit/Delete**: Click the edit/delete icons on each bookmark card

## Features Overview

### Dashboard
- Clean, modern interface
- Search functionality across title, description, and URL
- Tag-based filtering
- Responsive grid layout

### Link Management
- Add new bookmarks with URL, title, description, and tags
- Edit existing bookmarks
- Delete bookmarks with confirmation
- Automatic favicon fetching for better visual organization

### Authentication
- Secure user registration and login
- JWT-based session management
- Protected routes
- Automatic logout on token expiration

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
