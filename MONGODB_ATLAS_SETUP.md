# MongoDB Atlas Connection Setup

## Your Connection Details
**Connection String (Base):**
```
mongodb+srv://syedishaqmushran_db_user:HR8WjNsB4n4GtNnk@cluster0.unxbwej.mongodb.net/?appName=Cluster0
```

## Complete Connection String for Render
Add the database name `skymart` to the connection string:

```
mongodb+srv://syedishaqmushran_db_user:HR8WjNsB4n4GtNnk@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
```

## Steps to Add to Render

### 1. Go to Render Dashboard
- Navigate to https://dashboard.render.com
- Select your Web Service (mern-ecommerce)

### 2. Click "Environment" in the left sidebar

### 3. Add the Environment Variable
Click "Add Environment Variable" and enter:

**Key:** `MONGO_URI`

**Value:**
```
mongodb+srv://syedishaqmushran_db_user:HR8WjNsB4n4GtNnk@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
```

### 4. Save Changes
Click "Save" and Render will automatically redeploy your app

### 5. Verify Deployment
Check the deployment logs. You should see:
```
✅ Cart model registered
MongoDB Connected: cluster0.unxbwej.mongodb.net
Server running on http://localhost:5000
```

## Testing Locally (Optional)
If you want to test with MongoDB Atlas locally before deploying, update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://syedishaqmushran_db_user:HR8WjNsB4n4GtNnk@cluster0.unxbwej.mongodb.net/skymart?retryWrites=true&w=majority
JWT_SECRET=skymart_super_secret
RAZORPAY_KEY_ID=rzp_test_SA848OYsod4lAU
RAZORPAY_KEY_SECRET=Y4d9KAwb4gfLlgOz4Vh5nkL7
```

Then run:
```bash
cd backend
npm run dev
```

## Security Note
⚠️ **Important**: Keep your MongoDB credentials private!
- Never commit credentials to git
- `.env` file should be in `.gitignore` (it already is)
- For production, use Render's environment variable settings (which you're doing ✅)

## What Happens Next
Once deployed:
- ✅ All API routes will work: `/api/products`, `/api/orders`, `/api/admin`, `/api/analytics`
- ✅ Admin CRUD operations for Products, Orders, Users
- ✅ Shopping cart, checkout, order placement
- ✅ Analytics dashboard with real data from MongoDB
