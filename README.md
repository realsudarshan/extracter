# Extracter — AI-Powered Receipt Scanner

Extracter is a full-stack web application that uses AI to automatically scan and extract structured data from receipt images and PDFs. Upload a receipt, and within seconds the app surfaces the merchant name, transaction details, itemised line items, and a plain-English summary — all stored securely in the cloud and tied to your account.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [How It Works](#how-it-works)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pricing Plans](#pricing-plans)
- [Deployment](#deployment)

---

## Features

- **Drag-and-drop upload** — Drop a receipt image (JPEG, PNG, WebP) or PDF directly onto the upload zone.
- **AI data extraction** — Google Gemini automatically parses merchant information, transaction dates, amounts, currency, and individual line items.
- **Receipt dashboard** — Browse all your uploaded receipts with at-a-glance status indicators (Pending / Processed / Error).
- **Receipt detail view** — Inspect every extracted field and read a human-friendly summary of the receipt.
- **Download & delete** — Download the original file or permanently remove a receipt from storage and the database.
- **Authentication** — Secure sign-up / sign-in via Clerk; each user can only access their own receipts.
- **Usage-based billing** — Tiered pricing (Free, Basic, Team) enforced through Schematic feature flags.
- **Real-time updates** — Convex pushes database changes to the UI instantly without polling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| Database & Backend | [Convex](https://convex.dev/) |
| Authentication | [Clerk](https://clerk.com/) |
| AI Processing | [Google Gemini 2.0 Flash Lite](https://deepmind.google/technologies/gemini/) via [Inngest Agent Kit](https://www.inngest.com/docs/agent-kit/overview) |
| Background Jobs | [Inngest](https://www.inngest.com/) |
| Feature Flags / Billing | [Schematic](https://schematichq.com/) |
| Language | TypeScript |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  Landing Page  │  Dashboard  │  Receipt Detail          │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTPS
          ┌────────────▼────────────┐
          │      Next.js Server     │
          │  (App Router / API)     │
          └───┬──────────┬──────────┘
              │          │
      ┌───────▼───┐  ┌───▼──────────────┐
      │  Convex   │  │     Inngest       │
      │ (DB + RPC)│  │ (background jobs) │
      └───────────┘  └──────┬───────────┘
                            │
              ┌─────────────▼──────────────┐
              │       Agent Network        │
              │  ┌────────────────────┐    │
              │  │ Receipt Scanning   │    │
              │  │      Agent         │    │
              │  │  (Gemini + OCR)    │    │
              │  └────────┬───────────┘    │
              │           │ extracted JSON  │
              │  ┌────────▼───────────┐    │
              │  │  Database Agent    │    │
              │  │ (saves to Convex)  │    │
              │  └────────────────────┘    │
              └────────────────────────────┘
```

---

## How It Works

1. **Upload** — The user drags a receipt file onto the upload zone. The file is uploaded directly to Convex Storage via a pre-signed URL, and a receipt record is inserted into the `recipts` table with `status: "pending"`.

2. **Trigger** — The upload action fires an Inngest event (`extract-data-from-pdf-and-save-to-database`) carrying the temporary file URL and the receipt's database ID.

3. **AI Agent Network** — Inngest runs the agent network:
   - **Receipt Scanning Agent** downloads the file, converts it to base64, and sends it to Gemini with a structured extraction prompt. The model returns a JSON object containing merchant details, transaction info, line items, and totals.
   - **Database Agent** receives the extracted JSON and calls the Convex `updateReceiptWithExtractData` mutation to persist the data and flip the record's status to `"proceed"`.

4. **Real-time update** — Because Convex is reactive, the dashboard and detail pages update automatically when the record changes — no page reload required.

5. **Usage tracking** — Each successful scan is tracked via Schematic so that plan limits can be enforced.

---

## Data Model

The `recipts` table (Convex schema):

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Clerk user subject (owner of the receipt) |
| `fileName` | `string` | Original file name |
| `fileDisplayName` | `string?` | Human-readable name assigned by the AI |
| `fileId` | `Id<"_storage">` | Convex Storage reference |
| `uploadedAt` | `number` | Unix timestamp of upload |
| `size` | `number` | File size in bytes |
| `mimeType` | `string` | MIME type (e.g. `image/jpeg`, `application/pdf`) |
| `status` | `string` | `"pending"` → `"proceed"` → `"error"` |
| `merchantName` | `string?` | Extracted merchant / store name |
| `merchantAddress` | `string?` | Extracted merchant address |
| `merchantContact` | `string?` | Extracted phone / email |
| `transactionDate` | `string?` | Date of the transaction (YYYY-MM-DD) |
| `transactionAmount` | `string?` | Total amount paid |
| `currency` | `string?` | Currency code (e.g. `USD`) |
| `reciptSummary` | `string?` | Plain-English AI-generated summary |
| `items` | `array` | Line items — `{ name, quantity, unitPrice, totalPrice }` |

### Convex Queries & Mutations

| Name | Type | Description |
|---|---|---|
| `generateUploadUrl` | mutation | Returns a short-lived upload URL for Convex Storage |
| `storeReciepts` | mutation | Inserts a new receipt record |
| `getRecipts` | query | Returns all receipts for a given user (descending order) |
| `getReceiptById` | query | Returns a single receipt (auth-checked) |
| `getReceiptDownloadUrl` | query | Returns a temporary download URL for the stored file |
| `updateReceiptsStatus` | mutation | Updates only the `status` field (auth-checked) |
| `deleteReciept` | mutation | Deletes the file from Storage and the DB record (auth-checked) |
| `updateReceiptWithExtractData` | mutation | Persists all AI-extracted fields and sets status to `"proceed"` |

---

## Project Structure

```
extracter/
├── app/
│   ├── actions/                  # Next.js Server Actions
│   │   ├── getFileDownloadUrl.ts
│   │   └── getTemporaryAcessToken.ts
│   ├── dashboard/                # Protected dashboard page
│   ├── manage-plan/              # Billing / plan management page
│   ├── receipt/[id]/             # Dynamic receipt detail page
│   ├── server/                   # Inngest serve endpoint
│   ├── layout.tsx                # Root layout (Clerk + Convex providers)
│   └── page.tsx                  # Landing page
├── components/
│   ├── Dashboard/                # Dashboard-specific components
│   ├── Landing/                  # Landing page sections (Hero, Feature, Pricing, Footer)
│   ├── schematic/                # Schematic billing components
│   ├── ui/                       # shadcn/ui primitive components
│   ├── comp-145.tsx              # Feature card component
│   ├── comp-548.tsx              # Custom dropzone component
│   └── ConvexClientProvider.tsx  # Convex React provider wrapper
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── recipts.ts                # All queries & mutations
│   └── auth.config.ts            # Clerk JWT configuration
├── inngest/
│   ├── agents/
│   │   ├── receiptScanningAgent.ts  # Gemini-powered OCR agent
│   │   └── databaseAgent.ts         # Convex persistence agent
│   ├── agent.ts                  # Agent network + Inngest function
│   ├── client.ts                 # Inngest client
│   └── constants.ts              # Event name constants
├── hooks/                        # Custom React hooks
├── lib/                          # Shared utilities (Convex client, Schematic client)
├── middleware.ts                 # Clerk auth middleware
├── next.config.ts
└── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10 (or npm / yarn)
- A **Convex** account — [convex.dev](https://convex.dev/)
- A **Clerk** account — [clerk.com](https://clerk.com/)
- A **Google AI** API key (Gemini) — [aistudio.google.com](https://aistudio.google.com/)
- An **Inngest** account — [inngest.com](https://www.inngest.com/)
- A **Schematic** account — [schematichq.com](https://schematichq.com/) *(optional — for billing)*

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/realsudarshan/extracter.git
cd extracter
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up Convex

```bash
npx convex dev --until-success
```

This will prompt you to log in and create a new Convex project. After it succeeds, a `.env.local` file is created with `NEXT_PUBLIC_CONVEX_URL`.

### 4. Configure Clerk

1. Create an application in the [Clerk dashboard](https://dashboard.clerk.com/).
2. Add your Clerk publishable and secret keys to `.env.local` (see [Environment Variables](#environment-variables)).
3. In the Clerk dashboard, create a **JWT template** named `convex` following the [Convex + Clerk guide](https://docs.convex.dev/auth/clerk#get-started).
4. In `convex/auth.config.ts`, uncomment the Clerk provider and paste your Clerk Issuer URL.
5. Add `CLERK_JWT_ISSUER_DOMAIN` to your Convex deployment environment variables via the [Convex dashboard](https://dashboard.convex.dev/).

### 5. Configure Gemini (Google AI)

1. Generate an API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Add it to `.env.local` as `GOOGLE_AI_API_KEY`.

### 6. Configure Inngest

1. Sign up at [app.inngest.com](https://app.inngest.com/) and create an app.
2. Copy your **Event Key** and **Signing Key**.
3. Add them to `.env.local` (see [Environment Variables](#environment-variables)).

### 7. Configure Schematic *(optional)*

1. Create an account at [schematichq.com](https://schematichq.com/) and set up your plans.
2. Add your Schematic API key to `.env.local`.

### 8. Start the development servers

```bash
pnpm dev
```

This runs the Next.js frontend (`next dev`) and the Convex backend (`convex dev`) in parallel.

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Convex (auto-generated by `npx convex dev`)
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIza...

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Schematic (optional)
NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY=...
SCHEMATIC_API_KEY=...
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js and Convex dev servers concurrently |
| `pnpm build` | Build the Next.js app for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

---

## Pricing Plans

| Plan | Price | Users |
|---|---|---|
| Free | Free forever | 1 |
| Basic | $4 / month or $40 / year | 2 |
| Team | $7 / month or $70 / year | 5 |

Plan management is handled on the `/manage-plan` page and enforced via Schematic feature flags.

---

## Deployment

### Convex

The Convex backend is deployed automatically when you run `npx convex deploy` or link your repository in the [Convex dashboard](https://dashboard.convex.dev/).

### Next.js

Deploy the Next.js app to [Vercel](https://vercel.com/) (recommended):

1. Push the repository to GitHub.
2. Import the project in the Vercel dashboard.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy.

### Inngest

Register the Inngest serve endpoint with your production app URL in the [Inngest dashboard](https://app.inngest.com/). The endpoint is hosted at `/api/inngest` (configured in `app/server/`).
