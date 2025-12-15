This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📽️ Loom Video
https://www.loom.com/share/be41c802ce1a4d1daeb5e424aab238c7

## Features
- Upload and manage marketplace attribute templates (CSV)
- Upload seller product files (CSV/Excel) with automatic column detection
- Visual column-to-attribute mapping UI with 1-to-1 enforcement
- Save and view mapping configurations

## 🚀 Quick Start with Docker (Recommended)

Run the full stack (Frontend + Backend + Database) with one command.

### Prerequisites
- **Docker** and **Docker Compose** installed.

### Steps
1. **Build and Run**:
   ```bash
   docker-compose up --build
   ```
2. **Access the App**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:4000](http://localhost:4000)
   - **API Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🛠 Manual Setup (Development)

# BACKEND
First, go to `backend` folder and set the following keys in `.env`:

.env Keys:
```bash
DATABASE_URL="YOUR_POSTGRES_DB_URL"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Run the following commands to start the server:
```bash
cd backend
npm install
npx prisma migrate dev --name setup # To use the schema from prisma orm 
npx prisma generate
npm run build && npm run start
```

# FRONTEND

Go to `frontend` folder and set keys:

.env Keys: 
```bash
NEXT_API_BASE_URL="http://localhost:4000"
```

Run the following commands to start the frontend:
```bash
cd frontend
npm install
npm run dev
```

Access the frontend at: http://localhost:3000

---

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend
npm test
```

The frontend has 6 test suites covering:
- MappingList
- MarketplaceTemplateList
- NewMappingForm (MappingBuilder)
- SellerFileDetail
- SellerFileList
- SellerFileUploadForm

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Here's the data model:

### Models

| Model | Description |
|-------|-------------|
| `MarketplaceTemplate` | Stores marketplace templates (e.g., Myntra, Flipkart) |
| `MarketplaceAttribute` | Attributes belonging to a template (e.g., productName, price) |
| `SellerFile` | Uploaded seller product files with parsed columns |
| `Mapping` | Links a template to a seller file |
| `MappingItem` | Individual attribute-to-column mappings within a Mapping |

### Key Relationships
- `MarketplaceTemplate` → has many → `MarketplaceAttribute`
- `Mapping` → belongs to → `MarketplaceTemplate` and `SellerFile`
- `Mapping` → has many → `MappingItem`
- Each `MappingItem` links one `MarketplaceAttribute` to a seller column name

### Constraints
- Marketplace template names are unique
- Each attribute is unique per template
- One-to-one mapping enforced: each marketplace attribute can only be mapped once per mapping

---

## Tech stack

### Frontend
- Next.js 15.5.2 (App Router)
- Tailwind CSS
- Shadcn/ui
- Zustand (state management)
- TanStack React Query
- Framer Motion

### Backend
- Node.js / Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)
- Multer (file uploads)

