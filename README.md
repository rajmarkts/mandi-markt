# Mandi Markt

A rural B2B marketplace connecting wholesalers and retailers in low-internet connectivity areas.

## Project Goals

Mandi Markt is designed to bridge the gap between agricultural wholesalers and rural retailers who face challenges with:
- Limited or unreliable internet connectivity
- Complex inventory and order management
- Lack of centralized pricing information
- Difficulties in supply chain coordination

### Key Features

- **Offline-First Design**: Core functionality works with intermittent connectivity
- **Wholesaler Portal**: Manage inventory, pricing, and bulk orders
- **Retailer App**: Browse products, place orders, and track deliveries
- **Simplified UI**: Easy-to-use interface designed for users with varying technical expertise
- **Low-Bandwidth Optimized**: Minimal data usage for all transactions

## Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: PocketBase
- **Database**: SQLite (via PocketBase)

## Project Structure

```
├── app/              # Next.js App Router
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── backend/          # PocketBase backend
│   ├── pocketbase.exe    # PocketBase executable (add manually)
│   └── pb_schema.json    # Database schema
└── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- PocketBase executable (download from [pocketbase.io](https://pocketbase.io/))

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Download PocketBase from https://pocketbase.io/
2. Place the executable in the `/backend` folder
3. Start PocketBase:

```bash
cd backend
./pocketbase serve
```

The backend admin UI will be available at `http://localhost:8090/_`

## Development

- Frontend runs on port 3000
- PocketBase runs on port 8090

## License

MIT
