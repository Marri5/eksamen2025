# Fox Voting System - Deployment Steps

Since your VMs are already set up, follow these steps to deploy the application:

## 🚀 Quick Deployment Guide

### Step 1: Prepare Files for Transfer

First, create deployment packages for each server:

```bash
# In your project directory

# Create deployment package for Database Server
mkdir -p deploy/database
cp scripts/setup-mongodb.sh deploy/database/

# Create deployment package for Backend Server
mkdir -p deploy/backend
cp -r backend/ deploy/backend/
cp package.json deploy/backend/
cp .env deploy/backend/
cp scripts/setup-backend.sh deploy/backend/

# Create deployment package for Frontend Server
mkdir -p deploy/frontend
cp -r frontend/ deploy/frontend/
cp package.json deploy/frontend/
cp .env deploy/frontend/
cp scripts/setup-frontend.sh deploy/frontend/
```

### Step 2: Transfer Files to Each VM

Transfer files using SCP (replace 'username' with your VM username):

```bash
# Database Server (10.12.91.102)
scp -r deploy/database/* username@10.12.91.102:~/

# Backend Server (10.12.91.101)
scp -r deploy/backend/* username@10.12.91.101:~/

# Frontend Server (10.12.91.103)
scp -r deploy/frontend/* username@10.12.91.103:~/
```

### Step 3: Deploy Database Server (10.12.91.102)

SSH into the database server and run:

```bash
ssh username@10.12.91.102

# Make script executable and run it
chmod +x setup-mongodb.sh
./setup-mongodb.sh

# Verify MongoDB is running
sudo systemctl status mongod
```

### Step 4: Deploy Backend Server (10.12.91.101)

SSH into the backend server and run:

```bash
ssh username@10.12.91.101

# Make script executable and run it
chmod +x setup-backend.sh
./setup-backend.sh

# Or manually:
# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Start the backend
pm2 start backend/server.js --name fox-backend
pm2 save
pm2 startup

# Test the backend
curl http://localhost:5000/api/health
```

### Step 5: Deploy Frontend Server (10.12.91.103)

SSH into the frontend server and run:

```bash
ssh username@10.12.91.103

# Make script executable and run it
chmod +x setup-frontend.sh
./setup-frontend.sh

# Or manually:
# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Start the frontend
pm2 start frontend/server.js --name fox-frontend
pm2 save
pm2 startup

# Test the frontend
curl http://localhost:3000/health
```

## 📋 Verification Checklist

### Database Server (10.12.91.102)
- [ ] MongoDB is running: `sudo systemctl status mongod`
- [ ] MongoDB is listening on correct IP: `sudo netstat -tlnp | grep 27017`
- [ ] Firewall allows backend connection: `sudo ufw status`

### Backend Server (10.12.91.101)
- [ ] Backend is running: `pm2 status`
- [ ] API health check works: `curl http://localhost:5000/api/health`
- [ ] Can connect to MongoDB: Check PM2 logs with `pm2 logs`

### Frontend Server (10.12.91.103)
- [ ] Frontend is running: `pm2 status`
- [ ] Can access in browser: http://10.12.91.103:3000
- [ ] Nginx is running (if installed): `sudo systemctl status nginx`

## 🔧 Quick Commands

### Check Status
```bash
# On backend/frontend servers
pm2 status
pm2 logs

# On database server
sudo systemctl status mongod
sudo journalctl -u mongod -f
```

### Restart Services
```bash
# Backend/Frontend
pm2 restart all

# MongoDB
sudo systemctl restart mongod
```

### View Logs
```bash
# Application logs
pm2 logs fox-backend
pm2 logs fox-frontend

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
1. Check MongoDB is running on 10.12.91.102
2. Check firewall on database server allows connection from 10.12.91.101
3. Verify MongoDB config binds to 10.12.91.102 (not just localhost)

### "Frontend can't reach backend"
1. Check backend is running on 10.12.91.101:5000
2. Check firewall on backend allows connection from 10.12.91.103
3. Verify CORS settings in backend

### "Page not loading"
1. Check frontend is running on 10.12.91.103:3000
2. Try accessing directly without Nginx first
3. Check browser console for errors

## 🎯 Final Test

Once everything is deployed:

1. Open browser to http://10.12.91.103:3000 (or port 80 if using Nginx)
2. You should see two fox images
3. Click to vote
4. Check statistics page
5. Verify votes are being saved

Success! Your Fox Voting System should now be running across all three VMs. 🦊 