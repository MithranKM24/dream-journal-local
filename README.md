# Sleepsphere — local edition

This version uses a local SQLite database. It has no cloud account, cloud database, or environment variables.

## Run it

1. Install Node.js 22.5 or later (Node.js 24 is recommended).
2. In this folder, run `corepack enable` once, then `pnpm install --frozen-lockfile`.
3. Run `pnpm dev` and open the local address it prints (normally `http://localhost:3000`).

Create an account in the app to begin. The application creates `data/sleepsphere.db` on first use. This is your local database file, containing the accounts and dream entries. Back up this file to keep a copy of your journal; do not share it because it contains your private data.
