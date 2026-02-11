Service Template
================

Files in this template are intended as a drop-in, production-ready starting point
for each microservice. They are ESM modules and expect Node >= 18.

Usage
-----
- Copy the files into a service folder (overwrite `app.js`, `server.js`, `config/`, `middleware/`)
- Keep your existing `routes/`, `controllers/`, and `models/` folders unchanged
- Ensure `MONGO_URI` and `JWT_SECRET` are set in environment or `.env`
- Start with `node server.js` or use your container entrypoint

Security & Production
---------------------
- Uses `helmet`, `cors`, basic rate limiting and structured error handling
- Connects to MongoDB with sensible options and graceful shutdown
- Exposes `/health` endpoint
