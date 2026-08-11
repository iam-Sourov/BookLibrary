# BookLibrary 📚

A modern, full-stack digital book management and courier logistics platform featuring standard/Google OAuth authentication, live interactive delivery map tiles, predictive search, and custom slow-motion vertical shutter view transitions.

## 🚀 Key Features

*   **Database Migration**: Migrated from MongoDB to a Supabase-managed **PostgreSQL** backend with robust queries and atomic upsert operations.
*   **Authentication Hub**: Built with Supabase Auth supporting standard email/password registration, secure JWT token validation middleware, and Google OAuth redirection flow.
*   **Predictive Search**: Real-time glassmorphic suggestion dropdowns integrated into both the home page hero section and the library collection page, synchronized with URL query states (`?search=...`).
*   **Color-Adaptive Delivery Map**: Interactive Leaflet maps tracking delivery coverage, with a `MutationObserver` listener that dynamically switches map tiles between light and dark modes in real-time.
*   **Cinematic Theme Shutter**: A hardware-accelerated, pure CSS Keyframe view transition (`@keyframes shutter-down`) that slides the selected color mode down from the top of the viewport.
*   **Multi-Role Dashboards**: Customized sidebar panels, stats cards, and action paths dynamically tailored to three distinct user groups: Admins, Librarians, and Users.

---

## 🛠️ Technology Stack

### Frontend (Client)
*   **Core**: React 19, Vite, React Router (v6/v7)
*   **Styling**: Tailwind CSS & Vanilla CSS Transitions
*   **State & Queries**: Tanstack React Query (v5)
*   **Mapping**: React Leaflet & Leaflet (CartoDB Tiles)
*   **Icons & Alerts**: Lucide React, Date-Fns, Sonner toasts

### Backend (Server)
*   **Server**: Node.js & Express
*   **Database Connection**: PostgreSQL Client (`pg` Pool)
*   **Environment**: Dotenv, CORS
*   **Dev Utilities**: Nodemon

---

## 📁 Repository Structure

```text
BookLibrary/
├── BookLibrary-client/    # React Single Page Application (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI & Layout Components
│   │   ├── contexts/      # AuthContext & Supabase Providers
│   │   ├── Layouts/       # Dashboard & Root Layout Wrappers
│   │   ├── Pages/         # Home, AllBooks, BookDetails, Dashboards
│   │   └── Routes/        # Private Route Guards & Router Map
│   └── package.json
│
├── BookLibrary-server/    # Node.js Express Backend Service
│   ├── index.js           # Server Endpoints & Postgres Pool
│   └── package.json
│
├── package.json           # Root concurrent startup configuration
└── README.md
```

---

## ⚡ Setup & Installation

### Prerequisite
*   Node.js (v18+)
*   A running Supabase PostgreSQL database instance.

### 1. Clone the repository
```bash
git clone https://github.com/iam-Sourov/BookLibrary.git
cd BookLibrary
```

### 2. Configure Environment Variables
Create `.env` configuration files inside the client and server directories:

#### Client `.env` (`/BookLibrary-client/.env`)
```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_IMG_BB_API_KEY=your_imgbb_api_key
VITE_BASE_URL=http://localhost:5001
```

#### Server `.env` (`/BookLibrary-server/.env`)
```text
PORT=5001
DATABASE_URL=your_percent_encoded_postgresql_connection_string
```

### 3. Run Concurrently (Recommended)
You can start both the client (port `5173`) and server (port `5001`) simultaneously from the root folder:

```bash
# Install dependencies at the root
npm install

# Start both development servers concurrently
npm run dev
```

---

## 🔒 Security & Git Best Practices
*   Sensitive tokens, PostgreSQL credentials, and API keys are stored strictly inside `.env` configurations.
*   The root-level `.gitignore` excludes environment configurations (`.env`), build directories (`dist/`, `build/`), and dependencies (`node_modules/`) from being staged or committed.
