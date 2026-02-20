# Seed Products (one-off)

This script inserts a small set of sample products into the product-service MongoDB if the collection is empty.

Usage:

1. Ensure the product service `MONGO_URI` is reachable from this machine (or run inside container where it is available).

2. From the `product-service` folder run:

```bash
# install deps (if needed)
cd skymart-enterprise-backend/services/product-service
npm install

# run seed (make sure MONGO_URI is set in env)
MONGO_URI="mongodb://user:pass@host:27017/dbname" node scripts/seedProducts.js
```

The script will refuse to insert if products already exist.
