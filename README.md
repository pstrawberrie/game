# Web MMORPG Game

This is a browser-based MMORPG game project, following a modular monorepo structure.

## Structure

- `client/` – Frontend game client (TypeScript, PixiJS, Vite)
- `server/` – Backend game server (Node.js, TypeScript, Express, Socket.io, MongoDB)
- `shared/` – Shared types and constants (TypeScript)
- `docs/` – Documentation
- `_planning/` – Planning documents (not part of the codebase)

## Getting Started

1. Install dependencies (from the root):
   ```bash
   npm install
   ```
2. Start the client:
   ```bash
   cd client && npm run dev
   ```
3. Start the server:
   ```bash
   cd server && npm run dev
   ```

## Development

- Uses TypeScript, ESLint, Prettier, and Jest for best practices.
- See `_planning/` for design docs.
