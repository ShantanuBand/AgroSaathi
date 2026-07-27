# AgroSaathi — Agricultural Platform

A professional agricultural platform for Indian farmers, traders, buyers, and agricultural organizations. Provides market prices, weather forecasts, government schemes, marketplace listings, AI assistant, and notifications — all served from realistic mock data and ready for MERN backend integration.

## Run & Operate

- `pnpm --filter @workspace/agri-app run dev` — run the frontend (preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, preview at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, Tailwind CSS v4, Framer Motion, Recharts, Wouter
- API: Express 5
- Validation: Zod (via Orval codegen from OpenAPI spec)
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not hand-edit)
- `artifacts/agri-app/src/` — React frontend
  - `pages/` — page components (Dashboard, Market, Weather, etc.)
  - `components/` — shared UI components
  - `lib/` — utilities
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/data/` — mock static data (mockCrops, mockWeather, mockNotifications, mockSchemes, mockMarketplace, mockProfile, mockAI)

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — live weather, top crop prices, market trend, notifications |
| `/market` | Market Prices — crop price listing, filters, price history chart |
| `/weather` | Weather — current conditions, 7-day forecast, IMD alerts |
| `/marketplace` | Marketplace — buy/sell crop listings, create listing modal |
| `/schemes` | Government Schemes — PM-KISAN, PMFBY, KCC, eNAM and more |
| `/ai` | AI Assistant — chat interface with agricultural advice |
| `/notifications` | Notifications — alerts, price changes, scheme updates |
| `/profile` | Farmer Profile — editable profile with land and crop details |

## Architecture decisions

- **Mock data only**: All API routes return in-memory static data. To connect a real database, replace the data modules in `artifacts/api-server/src/data/` with Drizzle DB queries.
- **OpenAPI-first**: The spec in `lib/api-spec/openapi.yaml` drives both frontend React Query hooks (Orval) and backend Zod validation schemas. Always update the spec first, then run codegen.
- **No auth**: The app uses a hardcoded farmer profile (Ramesh Patil). Adding Clerk or Replit Auth is a natural next step.
- **State is ephemeral**: Mutations (mark notification read, create listing, update profile) update in-memory arrays that reset on server restart. Connecting a database will make these persistent.
- **OpenAPI collision rule**: When adding endpoints with both path params AND query params, Orval generates a `<OperationId>Params` name in both `api.ts` and `generated/types/` — causing TS2308. To avoid, remove query params from endpoints that also have path params, or use only one type of param per endpoint.

## Product

- Farmers can view live mandi prices for 18+ crops across Indian states with price history charts
- Weather forecasts with IMD-style alerts and per-day farming advisories
- Government scheme discovery (PM-KISAN, PMFBY, KCC, eNAM, AIF and more) with eligibility and application links
- Marketplace for listing crops to buy/sell with contact details
- AI agricultural assistant with domain-aware responses on pests, fertilizers, markets, and weather
- Notification center with price alerts, weather warnings, and scheme updates

## User preferences

_Populate as the user provides preferences._

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend or backend code
- Do NOT add endpoints with both path params AND query params — causes Orval TS2308 collision (see architecture decisions above)
- The API server routes are at `/api/*`; do not prefix routes inside route files — the root router in `routes/index.ts` handles `/api`
- Express 5: use `/{*splat}` for wildcard routes, not `*`; use `res.status(x).json(y); return;` not `return res.status(x).json(y)`
- Mock data is in `artifacts/api-server/src/data/` — mutations update in-memory arrays and reset on server restart

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
