# FinWise

A household financial management mobile app built with React Native and Expo.

## Overview

FinWise helps families manage their finances together. Parents can track expenses, approve children's spending requests, and get AI-powered budget recommendations. Children can track their allowance, request expenses, and see their spending.

## Features

### Parent Features
- 📊 Financial dashboard with income/expense overview
- 💰 Expense tracking and categorization
- ✅ Approve/reject children's expense requests
- 📈 AI-powered budget recommendations
- 👨‍👩‍👧‍👦 Family management and settings

### Child Features
- 💵 Track personal spending and allowance
- 📝 Request upcoming expenses
- 🔔 Notification center for approvals/warnings
- 📱 Simple, child-friendly interface

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
# Edit .env and set your API URL
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Project Structure

See `PROJECT_STRUCTURE.md` for detailed documentation.

```
/src
  /screens      - Screen components (auth, parent, child, shared)
  /components   - Reusable UI components
  /navigation   - Navigation configuration
  /services     - API client and external services
  /store        - State management (Zustand)
  /types        - TypeScript type definitions
  /utils        - Utility functions and helpers
  /theme        - Theme configuration and colors
```

## Tech Stack

- **React Native** 0.74.5 (Expo)
- **TypeScript** 5.1.3
- **React Navigation** 6.x - Navigation
- **Zustand** 4.4.7 - State management
- **Axios** 1.6.2 - API client
- **date-fns** 3.0.6 - Date utilities
- **expo-secure-store** - Secure token storage

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Development

### Code Style

- TypeScript with strict mode
- ESLint/Prettier configured
- Consistent 2-space indentation
- Single quotes for strings

### Git Workflow

This project follows a clean Git branching strategy. See `COMMITS.md` for the detailed commit roadmap and branching guidelines.

**Branch Structure:**
- `main` - Production-ready code
- `dev` - Integration branch
- `feature/*` - Feature branches

## API Integration

The app expects a REST API with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/dashboard/summary` - Dashboard data
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/upcoming-expenses` - List upcoming expenses
- `PUT /api/upcoming-expenses/:id/approve` - Approve request
- `PUT /api/upcoming-expenses/:id/reject` - Reject request
- `GET /api/budget/recommendations` - Budget recommendations
- `GET /api/notifications` - List notifications
- And more...

See individual service files for complete API contract.

## License

Private project - All rights reserved

