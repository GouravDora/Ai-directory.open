<<<<<<< HEAD
# AI Directory

AI Directory is an open-source frontend UI for discovering, upvoting, and organizing AI tools — MCP servers, IDE plugins, prompts, AI assistants, web builders, and more. It's built as a modern, community-driven directory where builders can submit assets, track upvotes, and curate personal collections with the Stack Builder feature.

> **Note:** This is the open-source frontend UI. The hosted production version is available at https://ai-directory-in.vercel.app/.

## Features

- **AI Tool Directory** — Browse MCP servers, prompts, IDE extensions, AI assistants, web builders, commerce tools, and infrastructure platforms.
- **Submissions & Plugins** — Community-published assets with system prompts, framework rules, MCP connection strings, and install commands.
- **Secure Upvotes** — Authenticated, per-user upvote tracking with Supabase Row Level Security. A user can upvote each asset only once.
- **Activity Timeline** — View a personal timeline of recently upvoted assets on your profile.
- **Stack Builder** — Create named collections (like GitHub Collections) of your favorite assets, add/remove items, and manage stacks from your profile.
- **Profiles** — Public profiles with username, bio, account type (personal/business), followers, following, and published assets.
- **Open / Closed Source Filtering** — Filter assets by open-source status.
- **Asset Detail Modal** — Copy system prompts, framework rules, and MCP configs as JSON/Markdown; download assets; visit official sites.
- **Real-time Stats** — Live indexed asset and AI tool counts powered by Supabase.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Supabase** — Backend, database, authentication, and Realtime
- **Lucide React** — Icons
- **TypeScript** — Type safety

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase account and project ([supabase.com](https://supabase.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-directory.git
cd ai-directory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase project URL and anon key (found in your Supabase project settings under API):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the database migrations

Apply the Supabase migrations in the `supabase/migrations/` folder to your project (in filename order) to create the required tables, RLS policies, and helper functions.

### 5. Start the development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
ai-directory/
├── supabase/                 # Database migrations (SQL)
├── src/
│   ├── components/           # React components (profile, directory, header)
│   ├── context/              # React context providers (auth, bookmarks, assets, etc.)
│   ├── data/                 # Mock asset data and integrations catalog
│   ├── lib/                  # Supabase client, API helpers (assets, submissions, plugins, profiles, upvotes, stacks)
│   └── App.tsx               # Application entry point
├── .env.example              # Example environment variables (copy to .env)
├── .gitignore                # Git ignore rules (excludes .env and node_modules)
├── LICENSE                   # MIT License
├── README.md                 # This file
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Live Demo

Hosted version: https://ai-directory-in.vercel.app/
=======
# 🌐 AI Directory - Open Source Starter Kit

Welcome to the open-source frontend of **AI Directory**! This is a modern, fast, and beautiful directory for AI Rules, MCPs, and Prompts. 

This repository contains the **frontend UI** of the project. You can use this to build your own AI directory or contribute to the main hosted version.

👉 **Check out the live hosted version here:** [https://ai-directory-in.vercel.app/](https://ai-directory-in.vercel.app/)

## ✨ Features
- **Modern UI:** Built with React, Vite, and Tailwind CSS.
- **Open/Closed Source Filters:** Easily distinguish between proprietary and open-source AI tools.
- **Stack Builder:** Create and share your own collections of AI tools.
- **Authentication:** Integrated with Supabase for user profiles and upvotes.

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GouravDora/Ai-directory.open.git
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05
