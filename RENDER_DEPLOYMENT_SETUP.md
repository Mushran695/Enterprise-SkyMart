# Render Deployment Setup Guide

## Current Status
✅ Backend code is fixed and deployed
✅ All routes are wired correctly
❌ MongoDB connection failing (need cloud database)

## Required Setup

### 1. MongoDB Atlas Setup (Free Tier)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create an account (if you don't have one)
3. Create a new Free Tier cluster
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Drivers" → Node.js
   - Copy the connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skymart?retryWrites=true&w=majority`

### 2. Set MongoDB URI in Render
1. Go to your Render Dashboard
2. Select your Web Service (mern-ecommerce or similar)
3. Go to **Environment** (left sidebar)
4. Add a new environment variable:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB Atlas connection string from step 1
5. Click "Save Changes"
6. Render will automatically redeploy

### 3. Verify Deployment
After setting the `MONGO_URI` environment variable:
- Render will redeploy automatically
- Check the deployment logs to confirm MongoDB connects
- You should see: `MongoDB Connected: cluster0.xxxxx.mongodb.net`

## Local Development
Your local `.env` file already has `MONGO_URI=mongodb://127.0.0.1:27017/skymart`

To test locally, make sure MongoDB is running:
```bash
# macOS (if using Homebrew)
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

Then run:
```bash
cd backend
npm run dev
```

## Environment Variables Needed in Render
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/skymart
JWT_SECRET=skymart_super_secret
RAZORPAY_KEY_ID=rzp_test_SA848OYsod4lAU
RAZORPAY_KEY_SECRET=Y4d9KAwb4gfLlgOz4Vh5nkL7
```

## Troubleshooting
- If deployment still fails, check Render logs for the exact error
- Verify MongoDB Atlas cluster is running and access is allowed from Render IPs
- Make sure the MONGO_URI format is correct (with password encoded if it contains special characters)
