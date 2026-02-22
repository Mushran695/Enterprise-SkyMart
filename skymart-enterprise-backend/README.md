# Docker / Compose helper

This README contains convenient commands to run the backend stack locally using Docker Compose.

Prerequisites
- Docker Desktop for macOS

Quick start (local dev):

1. Copy and edit environment values (optional):

```bash
cp .env.example .env
# edit .env if you want to use Atlas or custom secrets
```

2. Start the stack:

```bash
docker compose up -d --build
```

3. Stop and remove:

```bash
docker compose down -v
```

Makefile targets

- `make up` — build and start all services
- `make down` — stop and remove containers + volumes
- `make logs` — follow logs
- `make health` — show `docker compose ps`
- `make smoke` — run gateway smoke curl checks

Smoke test (curl) — hit each service via the API gateway (gateway exposes port `8080`):

```bash
# Auth
curl -v http://localhost:8080/api/auth/health

# Products
curl -v http://localhost:8080/api/products/health

# Orders
curl -v http://localhost:8080/api/orders/health

# Payment
curl -v http://localhost:8080/api/payment/health

# Admin
curl -v http://localhost:8080/api/admin/health

# Analytics
curl -v http://localhost:8080/api/analytics/health
```

Notes
- The compose stack includes a local `mongo` container for development. For production set `MONGO_URI` to your MongoDB Atlas URI in your environment or secrets store and remove the local `mongo` service.
- Kafka is configured with an internal listener (for other services) and an external listener mapped to host port `9092` for local testing. If you need different behavior or cluster setups, update the Kafka env vars in `docker-compose.yml`.

API Gateway CORS

- **Restart gateway after config changes:**

```bash
docker compose restart api-gateway
```

- **Quick verification (simulate browser preflight and normal request):**

```bash
# Preflight (OPTIONS)
curl -i -X OPTIONS http://localhost:8080/api/auth/login \
	-H "Origin: http://localhost:5174" \
	-H "Access-Control-Request-Method: POST"

# Normal request — check Access-Control-Allow-Origin and that Authorization is forwarded upstream
curl -i http://localhost:8080/api/auth/health -H "Origin: http://localhost:5174"
```

Ensure the response includes `Access-Control-Allow-Origin: http://localhost:5174` and `Access-Control-Allow-Credentials: true`.
