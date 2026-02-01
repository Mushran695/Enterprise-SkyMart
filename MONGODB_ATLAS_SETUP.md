# MongoDB Atlas Connection Setup

## ⚠️ SECURITY WARNING - CREDENTIALS EXPOSED
Your MongoDB credentials were exposed on GitHub. Follow these steps immediately:

### 1. ROTATE YOUR MONGODB PASSWORD (DO THIS NOW!)
1. Go to https://cloud.mongodb.com/v2/697f1e1ec055faa91bef2b2f#/security/database
2. Find user `syedishaqmushran_db_user`
3. Click "Edit" and change the password to a NEW strong password
4. Copy the NEW password

### 2. Update Your New Connection String
After changing the password, your new connection string will be:
```
mongodb+srv://syedishaqmushran_db_user:NEW_PASSWORD@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
```

Replace `NEW_PASSWORD` with your newly set password.

### 3. Update Render Environment Variable
1. Go to https://dashboard.render.com
2. Select your Web Service
3. Go to **Environment**
4. Update `MONGO_URI` with your NEW connection string
5. Save and redeploy

### 4. Update Local .env (Optional - for local testing)
Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://syedishaqmushran_db_user:NEW_PASSWORD@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
```

### 5. Never Commit Credentials Again
- `.env` is in `.gitignore` ✅
- MONGODB_ATLAS_SETUP.md should NOT contain actual passwords ✅ (fixed)
- Use Render's Environment Variables panel only for secrets

## MongoDB Atlas Security Checklist
- [ ] Changed database user password
- [ ] Updated MONGO_URI in Render
- [ ] Verified deployment connects successfully
- [ ] Reviewed Database Access History for suspicious activity
- [ ] Enabled IP Access List in Atlas (whitelist Render IP)

## Best Practices Going Forward
1. Store all credentials in environment variables only
2. Never commit `.env` files
3. Use `RENDER_GIT_COMMIT` to track only non-sensitive changes
4. Rotate passwords quarterly
5. Monitor MongoDB Activity Feed regularly

