# Database Migration - Local -> Atlas

This document explains how to copy your local MongoDB (`mongodb://127.0.0.1:27017/skymart`) to your Atlas cluster.

## Script added
`backend/scripts/migrate_db.js` - Node script that copies collections from a source MongoDB URI to a target MongoDB URI.

## Usage
1. Ensure you have Node.js installed locally and dependencies installed for the `backend` package:

```bash
cd backend
npm install
```

2. Run the migration script locally. Replace `<ATLAS_URI>` with your Atlas connection string (do NOT commit credentials):

```bash
# Example - drop existing target collections first (recommended for a fresh copy)
node scripts/migrate_db.js --source "mongodb://127.0.0.1:27017/skymart" --target "mongodb+srv://<user>:<password>@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority" --drop true

# If you want to keep existing data and append (may cause duplicate _id errors), set --drop false
node scripts/migrate_db.js --source "mongodb://127.0.0.1:27017/skymart" --target "<ATLAS_URI>" --drop false
```

3. Wait for the script to finish. It will print the number of documents copied per collection.

## Notes
- The script preserves `_id` values.
- It skips `system.*` collections.
- If your target already has documents with the same `_id`, `insertMany` will error. Use `--drop true` to remove existing collections first.

## After Migration
- Update your `backend/.env` (for local testing) or Render environment variable `MONGO_URI` (production) to point to the Atlas URI without exposing credentials in the repo.

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
```

- Restart your backend or wait for Render redeploy to pick up the new env var.

## Troubleshooting
- If you see authentication errors, verify the Atlas user and password are correct and that the IP access list allows connections from your local IP (or `0.0.0.0/0` temporarily).
- For very large datasets prefer `mongodump`/`mongorestore`.

*** End of file ***