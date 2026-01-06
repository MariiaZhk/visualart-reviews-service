# 🎨 VisualArt Reviews Service

A REST API for managing **reviews of artworks** (Entity 3) related to artworks (Entity 1).  
Built with **Node.js, TypeScript, Express, and MongoDB**, it allows creating reviews, listing them with pagination, and retrieving aggregated counts.

---

## 📌 Technologies

- Node.js 18+
- TypeScript
- Express.js
- MongoDB + Mongoose
- MongoDB Atlas / Local MongoDB
- Axios (HTTP client)
- Jest + Supertest (integration testing)
- mongodb-memory-server (in-memory DB for tests)

---

## 🚀 Running the Application

### 1. Install dependencies

```bash
npm install
```

### 2. Environment configuration

Create a `.env` file **locally**:

```env
PORT=4002
DB_HOST=mongodb://localhost:27017/visualart-reviews
ARTWORKS_SERVICE_URL=http://localhost:8080/api/artworks
```

> ⚠️ `.env` is ignored by Git. Adjust `DB_HOST` or `ARTWORKS_SERVICE_URL` as needed.

### 3. Start the service (development mode)

```bash
npm run dev
```

---

## 🌐 Base URL

```text
http://localhost:4002/api/reviews
```

---

## 🧩 Reviews API — `/api/reviews`

| Method | Endpoint   | Description                                                  |
| ------ | ---------- | ------------------------------------------------------------ |
| POST   | `/`        | Create a new review for an artwork                           |
| GET    | `/`        | Get reviews for a specific artwork (paginated, newest first) |
| POST   | `/_counts` | Get review counts for multiple artworks                      |

---

### POST `/api/reviews/`

Create a new review.

**Request body:**

```json
{
  "artworkId": "string",
  "author": "string",
  "content": "string",
  "rating": 1
}
```

**Behavior:**

- Validates required fields and rating (1–5)
- Automatically sets `createdAt`
- Checks existence of the referenced Artwork via external service

---

### GET `/api/reviews/`

Get reviews for a single artwork, sorted by newest first.

**Query parameters:**

| Name      | Required | Description                         |
| --------- | -------- | ----------------------------------- |
| artworkId | ✅       | Artwork identifier                  |
| size      | ❌       | Max number of results (default: 10) |
| from      | ❌       | Offset for pagination (default: 0)  |

---

### POST `/api/reviews/_counts`

Get total number of reviews for multiple artworks.

**Request body:**

```json
{
  "artworkIds": ["art-1", "art-2", "art-3"]
}
```

**Response example:**

```json
{
  "art-1": 5,
  "art-2": 2,
  "art-3": 0
}
```

> Aggregation is done via MongoDB pipeline, without loading full review documents.

---

## 🧪 Testing

- Fully covered with **integration tests**.
- Uses `mongodb-memory-server` for an isolated in-memory database.
- External Artwork service is mocked.

Run tests:

```bash
npm test
```

---

## ⚡ Notes

- Reviews have timestamps (`createdAt`) for sorting.
- Compound index on `{ artworkId: 1, createdAt: -1 }` for efficient queries.
- Designed to work in a microservice architecture.
