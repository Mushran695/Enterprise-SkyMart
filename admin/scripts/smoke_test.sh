#!/usr/bin/env bash
set -euo pipefail

# Simple smoke test hitting gateway endpoints using VITE_API_BASE or first arg
API_BASE=${1:-${VITE_API_BASE:-http://13.60.55.228:8080/api}}

echo "Using API base: $API_BASE"

echo "1) Health endpoints"
for ep in auth products orders payment analytics notification admin; do
	url="$API_BASE/$ep/health"
	echo -n "$url -> "
	if curl -sf "$url" -m 5 -o /dev/null; then
		echo "OK"
	else
		echo "FAILED"
		exit 2
	fi
done

if [ -z "${ADMIN_EMAIL:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ]; then
	echo "Skipping authenticated flows: set ADMIN_EMAIL and ADMIN_PASSWORD to run them."
	echo "Smoke test finished (partial)"
	exit 0
fi

echo "2) Login as admin"
login_res=$(curl -s -X POST "$API_BASE/auth/login" -H 'Content-Type: application/json' -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}")
http_code=$(echo "$login_res" | jq -r '.statusCode // empty' 2>/dev/null || true)
token=$(echo "$login_res" | jq -r '.token // .data.token // empty' 2>/dev/null || true)
if [ -z "$token" ]; then
	echo "Login failed or token not returned: $login_res"
	exit 3
fi
echo "Login OK, token received"

echo "3) Products list"
curl -s -H "Authorization: Bearer $token" "$API_BASE/products" | head -c 400; echo; echo

echo "4) Orders (admin)"
curl -s -H "Authorization: Bearer $token" "$API_BASE/orders/admin" | head -c 400; echo; echo

echo "5) Analytics stats"
curl -s -H "Authorization: Bearer $token" "$API_BASE/analytics/stats" | head -c 400; echo; echo

echo "Smoke test finished"
