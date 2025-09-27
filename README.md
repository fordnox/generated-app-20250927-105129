# Veloce: Fleet Management

A visually stunning and intuitive application for managing your personal or business car fleet.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fordnox/generated-app-20250927-105129)

Veloce is a sophisticated, minimalist web application designed for car enthusiasts and small business owners to manage their vehicle fleet with elegance and efficiency. The application provides a clean, intuitive interface to track comprehensive details for each car, including specifications, important deadlines, recurring expenses, documents, and photos. The core experience revolves around a central dashboard displaying the entire fleet at a glance, with quick access to detailed views for each vehicle.

## ✨ Key Features

- **Fleet Dashboard:** A beautiful, responsive grid displaying all your vehicles at a glance with key information and alerts.
- **Detailed Vehicle View:** A comprehensive, tabbed interface for each car, covering an overview of technical specifications, expenses, documents, and a photo gallery.
- **Effortless Data Entry:** An intuitive modal form for adding or editing vehicle details with smart controls like date pickers and validated fields.
- **Visual Excellence:** A clean, minimalist design with a professional color palette, ample whitespace, and smooth micro-interactions.
- **Responsive Perfection:** A flawless user experience across all devices, from mobile phones to desktops.
- **Built for Performance:** Leverages the power of Cloudflare Workers and Durable Objects for a fast and reliable experience.

## 🚀 Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **UI Components:** Shadcn/UI, Framer Motion, Lucide React
- **Routing:** React Router
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod for validation
- **Backend:** Hono running on Cloudflare Workers
- **Storage:** Cloudflare Durable Objects

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [Bun](https://bun.sh/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd veloce_fleet_manager
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    ```sh
    bun run dev
    ```

The application will be available at `http://localhost:3000`. The Vite server will automatically proxy API requests to the local Wrangler instance.

## 🛠️ Development

- `bun run dev`: Starts the local development server for both the frontend (Vite) and backend (Wrangler).
- `bun run build`: Builds the frontend application for production.
- `bun run lint`: Lints the codebase to ensure code quality.

## ☁️ Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Log in to Wrangler:**
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    ```sh
    bun run deploy
    ```
    This command will build the application and deploy it to your Cloudflare account. Wrangler will handle the setup of the Worker and Durable Object bindings.

Alternatively, you can deploy directly from your GitHub repository.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fordnox/generated-app-20250927-105129)

## 📁 Project Structure

```
.
├── src/                # Frontend React application
│   ├── components/     # Shared React components
│   ├── pages/          # Page components for different routes
│   ├── lib/            # Utility functions and API client
│   └── ...
├── worker/             # Backend Hono application (Cloudflare Worker)
│   ├── entities.ts     # Durable Object entity definitions
│   ├── user-routes.ts  # API route definitions
│   └── index.ts        # Worker entrypoint
├── shared/             # Code shared between frontend and backend
│   ├── types.ts        # TypeScript type definitions
│   └── mock-data.ts    # Mock data for development
└── wrangler.jsonc      # Cloudflare Worker configuration
```