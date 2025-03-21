# React TypeScript Frontend with Admin Role Management

A modern React application built with TypeScript, Vite, and TailwindCSS that implements JWT authentication with admin role management.

## Features

- React with TypeScript and Vite for fast development
- TailwindCSS for responsive styling
- JWT-based authentication with role management
- Protected routes for both regular and admin users
- Admin dashboard for user management
- Toast notifications using react-hot-toast
- Role-based UI components

## Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

## Setup

1. Clone this repository

```bash
git clone https://github.com/your-username/your-frontend-repo.git
cd your-frontend-repo
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Application Structure

```
src/
├── components/           # UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   └── ...               # Other components
├── context/              # React context providers
│   └── AuthContext.tsx   # Authentication context
├── pages/                # Page components
├── services/             # API service classes
│   └── AdminService.ts   # Admin API interactions
├── types/                # TypeScript type definitions
├── App.tsx               # Main application component
└── main.tsx              # Entry point
```

## User Roles

The application supports two user roles:

1. **Regular Users**
   - Can access the user dashboard
   - Can view and edit their own profile
2. **Admin Users**
   - Can access all regular user functionality
   - Can access the admin portal at `/admin-portal`
   - Can view all users in the system
   - Can promote/demote users to/from admin status

## Authentication Flow

1. **Registration**: Create a new account via `/signup`
2. **Login**: Access your account via `/login`
3. **JWT Token**: Upon successful login, a JWT token is stored in localStorage
4. **Authorization**: The token is sent with all API requests in the Authorization header
5. **Admin Check**: The admin status is included in the JWT token payload and user object

## Route Protection

The application uses two types of route guards:

1. **ProtectedRoute**: Ensures the user is authenticated
2. **AdminRoute**: Ensures the user is both authenticated and has admin privileges

## Admin Portal

The admin portal allows admin users to:

1. View a list of all users in the system
2. See each user's email and admin status
3. Toggle admin status for any user except themselves
4. Navigate between admin portal and regular dashboard

## Development

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## Testing Admin Functionality

To test the admin functionality:

1. Create an admin user on the backend (see backend README)
2. Log in with the admin credentials
3. You'll see an "Go to Admin Portal" button on your dashboard
4. Click the button to access the admin dashboard
5. From there, you can manage users and toggle their admin status

## Security Considerations

- JWT tokens are stored in localStorage and included in all API requests
- Admin-only routes are protected on both frontend and backend
- UI elements adapt based on the user's role
- Error handling provides user-friendly notifications
- Admin users cannot revoke their own admin privileges
