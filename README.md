# React TypeScript Authentication Frontend

A modern React application built with TypeScript, Vite, and TailwindCSS that implements JWT authentication.

## Features

- React with TypeScript and Vite for fast development
- TailwindCSS for responsive styling
- JWT-based authentication
- Login and signup forms
- Protected routes
- User dashboard
- Toast notifications using react-hot-toast
- React Icons for enhanced UI elements

## Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher

## Setup

1. Clone this repository

```bash
git clone https://github.com/yourusername/react-ts-auth-frontend.git
cd react-ts-auth-frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure the backend API URL

Create or edit the `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3001
```

4. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Usage

### Authentication Flow

1. **Sign Up**: Create a new account using the signup form
2. **Log In**: Access your account using the login form
3. **Dashboard**: After successful authentication, you'll be redirected to the dashboard
4. **Log Out**: Click the logout button to end your session

### Components

- **Login Form**: Email and password authentication
- **Signup Form**: New user registration
- **Dashboard**: Protected area showing user information
- **Protected Routes**: Routes that require authentication

### UI Libraries

The frontend uses several libraries to enhance the user experience:

- **TailwindCSS** for utility-first styling
- **React Hot Toast** for user-friendly notifications
- **React Icons** for access to popular icon libraries including:
  - Font Awesome
  - Material Design
  - Heroicons
  - And many more

Example of using icons:

```jsx
import { FiMail, FiLock } from "react-icons/fi";

function LoginForm() {
  return (
    <form>
      <div className="flex items-center">
        <FiMail className="mr-2 text-gray-500" />
        <input type="email" placeholder="Email" />
      </div>
      <div className="flex items-center">
        <FiLock className="mr-2 text-gray-500" />
        <input type="password" placeholder="Password" />
      </div>
    </form>
  );
}
```

## Project Structure

```
src/
├── components/       # UI components
│   ├── auth/         # Authentication-related components
│   └── ...           # Other components
├── context/          # React context providers
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx          # Entry point
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## Deployment

1. Build the project

```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting provider

Remember to update the API URL in the production environment.

## License

This project is open source and available under the [MIT License](LICENSE).
