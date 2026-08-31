# JSICP — API Contracts & OpenAPI Specifications (SIH 2026)

## Overview
All client traffic routes through the API Gateway at port `4000`.

---

## 1. Auth Service (`/api/v1/auth`)

### `POST /auth/register`
- **Request**:
```json
{
  "fullName": "Smt. Sunita Devi",
  "phone": "+919835124901",
  "email": "sunita.devi@gmail.com",
  "password": "SecurePassword123!",
  "role": "citizen",
  "district": "Ranchi"
}
```
- **Response (201 Created)**:
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": { "id": "uuid", "fullName": "Smt. Sunita Devi", "role": "citizen" }
}
```

### `POST /auth/login`
- **Request**: `{ "phone": "+919835124901", "password": "SecurePassword123!" }`
- **Response (200 OK)**: Access & Refresh Tokens.

### `POST /auth/ekyc/digilocker`
- Stub for Aadhaar / DigiLocker e-KYC OAuth2 redirect flow.

---

## 2. Problem Service (`/api/v1/problems`)

### `POST /problems`
- Ingests problem, uploads media to MinIO/S3, executes AI pipeline (classify, CV validate, dedup, score, route), stores record.
- **Request**:
```json
{
  "title": "Fluoride Contamination in Angara Borewells",
  "description": "High yellow fluoride water in 12 handpumps...",
  "district": "Ranchi",
  "block": "Angara",
  "village": "Hesal",
  "latitude": 23.4189,
  "longitude": 85.5211,
  "mediaUrls": ["https://.../photo.jpg"]
}
```
- **Response (201 Created)**: Problem object with `ticketNumber`, `category`, `priorityScore`, `status: "pending_nodal_review"`.

### `GET /problems?district=Ranchi&category=Water`
- List problems filtered by district, category, or status.

### `PATCH /problems/:id/nodal-review`
- Human-in-the-loop validator confirms or modifies AI routing.

---

## 3. University Service (`/api/v1/universities`)

### `GET /universities/:id/routed-problems`
- List challenges routed to this HEI.

### `POST /universities/:id/problems/:problemId/accept`
- Accept problem and assign faculty mentor.

### `POST /teams`
- Form multidisciplinary student team across departments.

### `POST /proposals`
- Submit solution research proposal with budget & milestones.

---

## 4. Industry & CSR Marketplace (`/api/v1/marketplace`)

### `GET /marketplace/proposals`
- List approved proposals open for CSR funding & prototyping.

### `POST /agreements`
- Execute bilateral MoU with digital e-signature and generate Blockchain hash.

---

## 5. Project Lifecycle & Document Vault (`/api/v1/lifecycle`)

### `GET /projects/:proposalId/gantt`
- Get 5-stage milestones with completion percentages.

### `POST /milestones/:id/approve`
- Dual Sign-off Gate: Stamped by Faculty Mentor + District Officer.

### `POST /milestones/:id/documents`
- Upload NABL reports, CAD models, telemetry logs.

---

## 6. Government Analytics (`/api/v1/analytics`)

### `GET /analytics/summary`
- Real-time aggregated stats across 24 Jharkhand districts.

### `GET /analytics/impact-map`
- GeoJSON feature collection for 24 districts with vulnerability & resolution density.
