# Leaf & Spine – Online Book Store (MERN, role-based)

## Run it
Prerequisites: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed              # creates demo admin, user and 5 books
npm run dev               # API on http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev               # App on http://localhost:5173
```

Demo logins (after seeding):
- Admin: admin@bookstore.com / Admin@123
- User:  user@bookstore.com / User@1234

Choosing "Admin" on the sign-up page needs the code in `ADMIN_SIGNUP_CODE` (server/.env), so random visitors cannot make themselves admins.

## Structure
- server/models: User, Book, Activity (recent-activity feed)
- server/middleware/auth.js: JWT check (`protect`) and role check (`adminOnly`)
- server/routes: auth, books, users, stats
- client/src/components/Splash.jsx: opening book animation (skipped visually if the device prefers reduced motion)
- client/src/components/ProtectedRoute.jsx: role-based routing
