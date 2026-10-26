# Pantry List

A responsive shopping-list app built with React, TypeScript, Redux Toolkit, React Router, Vite, and JSON Server. Users can create separate shopping lists, manage items, track what they have bought, and share lists with other registered users.

## Hosted app

Try Pantry List: [shopping-list-phemelo.vercel.app](https://shopping-list-phemelo.vercel.app/)

## Features

- Register and log in with an email address and password.
- Edit profile details and update login email/password.
- Create, rename, and delete multiple shopping lists.
- Add, edit, delete, and mark items as bought. Items can include a quantity, category, optional notes, and an image.
- Share a list with another registered user by email and remove access later.
- Search items by name, filter by category, and sort by name, category, or date added.
- Keep the active list and view filters in the URL, so browser navigation and copied URLs retain the current view.
- Responsive layouts and reusable UI components.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm

## Install and run

Install the dependencies once:

```bash
npm install
```

Start JSON Server in one terminal from the project root:

```bash
npx json-server --watch db.json --port 3001
```

Start the Vite development server in a second terminal:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The frontend uses `http://localhost:3001` for its API by default. To use a different API URL, set `VITE_API_URL` in a `.env` file in the project root, for example:

```env
VITE_API_URL=http://localhost:3001
```

Keep JSON Server running while using the app; user accounts, lists, and items are stored in `db.json`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

JSON Server is started separately with the command above; there is not currently an npm script that starts both servers together.

## URL filters

The home page stores the active list and view options in query parameters. For example:

```text
/?list=1&q=milk&category=Produce&sort=name
```

- `list`: active shopping-list ID
- `q`: item-name search
- `category`: selected category
- `sort`: `date`, `name`, or `category`

Changing a valid query parameter updates the displayed items. The default sort is newest first.

## Project structure

```text
.
├── public/                         # Static public assets
├── src/
│   ├── app/
│   │   ├── components/             # Shared UI components and dialogs
│   │   ├── pages/                  # Home, login, registration, and profile screens
│   │   ├── routes/                 # Public and protected route guards
│   │   ├── utils/                  # API client, validation, sorting, and helpers
│   │   ├── hooks.ts                # Typed Redux hooks
│   │   ├── store.ts                # Redux store configuration
│   │   └── toast.ts                # Toast notification context
│   ├── assets/                     # Imported images and graphics
│   ├── features/
│   │   ├── auth/                   # Authentication and profile state/API actions
│   │   └── lists/                  # Shopping-list and item state/API actions
│   ├── App.tsx                     # Application routes
│   ├── main.tsx                    # React entry point
│   ├── App.css
│   └── index.css
├── db.json                         # JSON Server data
├── instructions.md                 # Original task brief
├── algo.md                         # Algorithm outline
├── pseudocode.pseudo               # Application pseudocode
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Data and security notes

JSON Server is a lightweight development data store, not a production backend. Its API does not enforce authentication or per-user authorization, so client-side route guards and list filtering should not be considered security controls. Do not use this setup with real or sensitive personal data or expose the JSON Server API publicly.

Passwords are hashed with bcryptjs before being stored; they are not encrypted for later decryption. Authentication and password checks currently happen in the client against the JSON Server API. A production deployment needs a trusted backend that handles authentication, authorization, validation, and protected data access.

## Project documents

- [instructions.md](./instructions.md) contains the task requirements.
- [algo.md](./algo.md) describes the intended application algorithms.
- [pseudocode.pseudo](./pseudocode.pseudo) outlines the main flows.

## Design reference

- [Figma design](https://www.figma.com/design/HyTp4BG8pUIaUEKxDPG0sg/Untitled?node-id=0-1&t=tvHY6OeC4iLBM5z7-1)
