# 🧪 GEED Application - Complete Testing Guide

## 📋 How to Test GEED on Your PC

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone https://github.com/aminenb07/geed.git
cd geed

# Verify the structure
ls -la
# You should see: geed-app/ folder along with other files
```

### Step 2: Backend Setup and Testing
```bash
# Navigate to backend
cd geed-app/backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

**Expected Output:**
```
Server running on port 5001
Database connected successfully
```

**Test Backend APIs:**
Open a new terminal and run these tests:

```bash
# Test 1: Services API
curl http://localhost:5001/api/services
# Expected: JSON with 3 services (Web Development, Mobile App, Digital Marketing)

# Test 2: Authentication API
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@geed.com","password":"admin123"}'
# Expected: {"success": true, "token": "jwt-token", "user": {...}}

# Test 3: Contact API
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"123-456-7890","message":"Test message"}'
# Expected: {"success": true, "message": "Contact saved successfully"}
```

### Step 3: Frontend Setup and Testing
Open a new terminal:

```bash
# Navigate to frontend (from root geed directory)
cd geed-app/frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 152 ms

➜  Local:   http://localhost:3000/
➜  Network: http://10.x.x.x:3000/
```

### Step 4: Web Application Testing

Open your browser and go to `http://localhost:3000`

#### 🏠 Homepage Testing
- ✅ Check responsive design (resize browser window)
- ✅ Verify hero section loads
- ✅ Test navigation menu
- ✅ Check "Get Started" button functionality

#### 🔐 Authentication Testing
1. **Registration Test:**
   - Click "Register" or go to `/register`
   - Fill form: Name, Email, Password
   - Submit and verify success message
   - Check if redirected to dashboard

2. **Login Test:**
   - Go to `/login`
   - Use test credentials:
     - Admin: `admin@geed.com` / `admin123`
     - User: `user@geed.com` / `user123`
   - Verify successful login and redirect

#### 🛍️ Services Page Testing
- Go to `/services`
- ✅ Verify 3 services are displayed
- ✅ Test search functionality (search "web")
- ✅ Test category filtering
- ✅ Check service details display

#### 📞 Contact Form Testing
- Go to `/contact`
- Fill out the contact form:
  - Name: Your Name
  - Email: your@email.com
  - Phone: 123-456-7890
  - Message: Test message
- ✅ Submit and verify success message
- ✅ Check form validation (try submitting empty form)

#### 👤 User Profile Testing (After Login)
- Go to `/profile`
- ✅ Verify user information displays
- ✅ Test profile update functionality
- ✅ Check password change feature

#### 🎛️ Admin Dashboard Testing (Admin Login Required)
- Login as admin: `admin@geed.com` / `admin123`
- Go to `/dashboard`
- ✅ Verify admin-only access
- ✅ Check user management features
- ✅ View contact submissions
- ✅ Test service management

### Step 5: API Integration Testing

Test frontend-backend communication:

1. **Services Integration:**
   - Open browser dev tools (F12)
   - Go to `/services`
   - Check Network tab for API calls to `/api/services`
   - Verify data loads correctly

2. **Authentication Integration:**
   - Login with test credentials
   - Check Network tab for `/api/auth/login` call
   - Verify JWT token is stored (Application > Local Storage)

3. **Contact Form Integration:**
   - Submit contact form
   - Check Network tab for `/api/contact` POST request
   - Verify success response

### Step 6: Mobile Responsiveness Testing

Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**How to test:**
1. Open browser dev tools (F12)
2. Click device toolbar icon
3. Select different device sizes
4. Navigate through all pages
5. Verify layout adapts correctly

### Step 7: Performance Testing

1. **Load Time Testing:**
   - Open dev tools > Network tab
   - Refresh homepage
   - Check total load time (should be < 3 seconds)

2. **API Response Testing:**
   - Check API response times in Network tab
   - Services API should respond < 500ms
   - Authentication should respond < 1 second

### 🐛 Common Issues and Solutions

#### Issue 1: Port Already in Use
```bash
# Kill processes on ports
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

#### Issue 2: Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue 3: CORS Errors
- Check backend console for CORS configuration
- Ensure frontend URL is allowed in backend CORS settings

#### Issue 4: API Not Responding
```bash
# Check if backend is running
curl http://localhost:5001/api/services
# If no response, restart backend server
```

### 📊 Expected Test Results

#### ✅ All Tests Should Pass:
- Backend server starts on port 5001
- Frontend server starts on port 3000 (or next available)
- All API endpoints respond correctly
- Authentication system works
- Contact form submits successfully
- Services display and filter correctly
- Admin dashboard accessible to admin users
- Responsive design works on all screen sizes

#### 📈 Performance Benchmarks:
- Homepage load: < 3 seconds
- API responses: < 500ms
- Navigation: Instant (SPA routing)
- Form submissions: < 1 second

### 🎯 Testing Checklist

**Backend Testing:**
- [ ] Server starts without errors
- [ ] All API endpoints respond
- [ ] Authentication works
- [ ] Database operations succeed
- [ ] CORS configured correctly

**Frontend Testing:**
- [ ] Application loads in browser
- [ ] All pages accessible
- [ ] Forms work correctly
- [ ] Authentication flow complete
- [ ] API integration functional
- [ ] Responsive design works

**Integration Testing:**
- [ ] Frontend connects to backend
- [ ] Data flows correctly
- [ ] Error handling works
- [ ] User sessions persist
- [ ] Admin features restricted

### 🚀 Ready for Production

Once all tests pass, your GEED application is ready for:
- Production deployment
- User acceptance testing
- Performance optimization
- Feature enhancements

---

**Need Help?**
- Check console logs for errors
- Verify Node.js version (16+)
- Ensure all dependencies installed
- Test API endpoints individually
- Check network connectivity

**Last Updated:** November 2, 2025