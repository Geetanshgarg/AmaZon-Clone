# 📦 AmaZon-Clone

A high-performance, full-stack Amazon India storefront localization built with a modern TypeScript monorepo architecture. This project features a robust backend, dynamic storefront, and a shared UI design system.

![AmaZon-Clone Logo](https://img.shields.io/badge/AmaZon-Clone-FF9900?style=for-the-badge&logo=amazon&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

---

## 🚀 Overview

AmaZon-Clone is a production-ready e-commerce platform that mirrors the Amazon India shopping experience. It leverages **Turborepo** for efficient monorepo management, **Next.js 15+** for a blazing-fast frontend, and **Express 5** for a scalable API layer.

### ✨ Key Features

- 🇮🇳 **India Storefront Localization**: Fully adapted UI for the Indian market, including regional product data.
- 💰 **Precision Currency**: Global standardization to Indian Rupees (₹) with proper comma separation (`en-IN` formatting).
- 🛒 **Dynamic Shopping Experience**: Real-time product fetching, interactive linking, and a responsive shopping cart.
- 🔐 **Secure Authentication**: Integrated with **Better Auth** for robust session management and user protection.
- 📦 **Order Management**: End-to-end order flow from checkout to history tracking.
- 🎨 **Modern UI System**: Built with **Tailwind CSS 4** and shared **shadcn/ui** components across the workspace.
- 🏗️ **Monorepo Architecture**: Clean separation of concerns with dedicated packages for `db`, `auth`, `ui`, and `env`.

---

## 🛠️ Tech Stack

### **Frontend** (`apps/web`)
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [Tanstack React Form](https://tanstack.com/form)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### **Backend** (`apps/server`)
- **Framework**: [Express 5](https://expressjs.com/)
- **Runtime**: [Node.js](https://nodejs.org/) / [Bun](https://bun.sh/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: [Better Auth](https://better-auth.com/)

### **Shared Packages** (`packages/`)
- **`@AmaZon-Clone/db`**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL.
- **`@AmaZon-Clone/ui`**: Shared design system and React primitives.
- **`@AmaZon-Clone/auth`**: Unified authentication logic.
- **`@AmaZon-Clone/config`**: Shared ESLint, TypeScript, and Tailwind configurations.

---

## 🚦 Getting Started

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Geetanshgarg/AmaZon-Clone.git
   cd AmaZon-Clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create `.env` files in `apps/web/.env`, `apps/server/.env`, and `packages/db/.env`.
   - Update `DATABASE_URL` and other secrets as per your local setup.

4. **Initialize Database**:
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start Development**:
   ```bash
   npm run dev
   ```
   - **Frontend**: [http://localhost:3001](http://localhost:3001)
   - **API**: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```text
AmaZon-Clone/
├── apps/
│   ├── web/                # Next.js frontend
│   └── server/             # Express API
├── packages/
│   ├── auth/               # Shared Auth logic
│   ├── config/             # Workspace configurations
│   ├── db/                 # Prisma schema & client
│   ├── env/                # Environment variable schemas
│   └── ui/                 # Component library (shadcn/ui)
└── turbo.json              # Turborepo orchestration
```

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts both web and server in parallel |
| `npm run build` | Optimized production build for all packages |
| `npm run check-types` | Run type checking across the entire repo |
| `npm run db:push` | Sync Prisma schema with the database |
| `npm run db:studio` | Opens Prisma Studio for data browsing |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
