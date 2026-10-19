# Shopping List App

A responsive React + TypeScript shopping list application built to support user authentication, protected routing, profile management, and full shopping list CRUD operations. The project follows the requirements in the task brief and is designed to work with Redux for state management and JSON server for persistence.

## Overview

This application allows users to:

- Register and log in securely
- View and update their profile
- Create, read, update, and delete shopping lists
- Add items with details such as name, quantity, category, notes, and image
- Search and sort items by name, category, and date added
- Navigate across protected pages with role-aware access control
- Use the app across different screen sizes with a mobile-friendly layout

## Features

### User management
- Registration with email, password, name, surname, and cell number
- Login with saved user credentials
- Encrypted password handling for sign-up and login flow
- Profile page that allows users to view and edit personal details
- Account credential update support
- Protected routing so guests cannot access authenticated pages

### Shopping list management
- Add shopping list items with:
  - name
  - quantity
  - optional notes
  - category
  - image
- View existing shopping lists
- Edit current items and list details
- Delete items or entire shopping lists
- Search by item name
- Sort lists by name, category, and date added
- Maintain persistent records through JSON server

### User experience
- Clean and intuitive interface
- Responsive layout for common breakpoints
- Reusable components and structured app architecture
- URL-based search and sorting state for better usability
- Clear navigation between login, registration, home, and profile pages

## Tech stack

- React
- TypeScript
- Vite
- Redux
- React Router
- JSON Server
- CSS / component styling

## Project structure

```text
shopping-list/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── routes/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── instructions.md
├── README.md
└── index.html
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm

## Installation

1. Clone the repository
2. Navigate to the project folder
3. Install dependencies:

```bash
npm install
```

## Running the app

Start the frontend development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

To build the app for production:

```bash
npm run build
```

## JSON server setup

This project is intended to use JSON server for persistent data storage. In a full implementation, a local JSON database and server script would be used to handle user and shopping list records. The app is designed around this data flow so that CRUD operations remain consistent and state-driven.

## Requirements mapping

This project addresses the task requirements for:

- Login page
- Registration page
- Home page
- Profile page
- Protected routing
- User profile management
- Shopping list CRUD functionality
- Search and sorting by URL query parameters
- Responsive UI
- Redux-based state architecture
- Documentation through the GitHub README

## Notes

This repository is structured as a task-based React application following the instruction brief. The app can be extended further with real API integration, stronger authentication handling, and polished styling as needed.

## License

This project is for educational and portfolio use.
