UP_CMD = docker compose up -d --build
DOWN_CMD = docker compose down -v
LOGS_CMD = docker compose logs -f

.PHONY: up down logs health smoke

up:
	$(UP_CMD)

down:
	$(DOWN_CMD)

logs:
	$(LOGS_CMD)

health:
	@echo "Services status:"
	@docker compose ps

smoke:
	@echo "Running smoke curl checks against api-gateway (http://localhost:8080)"
	@curl -fsS http://localhost:8080/api/auth/health || true
	@curl -fsS http://localhost:8080/api/products/health || true
	@curl -fsS http://localhost:8080/api/orders/health || true
	@curl -fsS http://localhost:8080/api/payment/health || true
	@curl -fsS http://localhost:8080/api/admin/health || true
	@curl -fsS http://localhost:8080/api/analytics/health || true
