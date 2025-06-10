# Environment Configuration Guide

## Overview

The `.env` file contains all the configuration needed for the Fox Voting System. This file should be present on each server with the appropriate settings.

## Environment Variables Explained

### Backend Configuration

```bash
BACKEND_PORT=5000
BACKEND_HOST=10.12.91.101
```

- **BACKEND_PORT**: The port where the backend API server will run
- **BACKEND_HOST**: The IP address of the backend server

### Frontend Configuration

```bash
FRONTEND_PORT=3000
FRONTEND_HOST=10.12.91.103
```

- **FRONTEND_PORT**: The port where the frontend Express server will run
- **FRONTEND_HOST**: The IP address of the frontend server

### MongoDB Configuration

```bash
MONGODB_HOST=10.12.91.102
MONGODB_PORT=27017
MONGODB_DATABASE=foxvoting
```

- **MONGODB_HOST**: The IP address of the MongoDB server
- **MONGODB_PORT**: The port MongoDB is listening on (default: 27017)
- **MONGODB_DATABASE**: The name of the database to use

### Node Environment

```bash
NODE_ENV=production
```

- **NODE_ENV**: Sets the environment mode (development/production)

## Deployment Instructions

### 1. Backend Server (10.12.91.101)

Copy the `.env` file to the backend server and ensure it contains:

```bash
# This is what the backend server needs
BACKEND_PORT=5000
BACKEND_HOST=10.12.91.101
MONGODB_HOST=10.12.91.102
MONGODB_PORT=27017
MONGODB_DATABASE=foxvoting
NODE_ENV=production
```

### 2. Frontend Server (10.12.91.103)

Copy the `.env` file to the frontend server. The frontend primarily needs:

```bash
# This is what the frontend server needs
FRONTEND_PORT=3000
FRONTEND_HOST=10.12.91.103
NODE_ENV=production
```

### 3. Database Server (10.12.91.102)

The database server doesn't need the `.env` file as MongoDB is configured directly through its configuration file.

## Local Development

For local development on your machine, create a `.env.development` file:

```bash
# Local development configuration
BACKEND_PORT=5000
BACKEND_HOST=localhost

FRONTEND_PORT=3000
FRONTEND_HOST=localhost

MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=foxvoting_dev

NODE_ENV=development
```

## Testing the Configuration

### Test Backend Connection

```bash
# From the backend server
curl http://localhost:5000/api/health
```

### Test Frontend Connection

```bash
# From the frontend server
curl http://localhost:3000/health
```

### Test MongoDB Connection

```bash
# From the backend server
mongo mongodb://10.12.91.102:27017/foxvoting --eval "db.stats()"
```

## Important Notes

1. **Never commit `.env` files to version control** - They may contain sensitive information
2. **Use different `.env` files for different environments** - development, staging, production
3. **Ensure file permissions are restrictive** - Only the application user should read the file:
   ```bash
   chmod 600 .env
   ```

## Troubleshooting

### Backend can't connect to MongoDB

Check that:
- MongoDB is running on 10.12.91.102
- Firewall allows connection from 10.12.91.101
- MongoDB is configured to bind to the internal IP

### Frontend can't connect to Backend

Check that:
- Backend is running on 10.12.91.101:5000
- Firewall allows connection from 10.12.91.103
- CORS is properly configured in the backend

### Application not reading environment variables

Ensure:
- `.env` file is in the root directory where you run the application
- The file has proper permissions
- You've restarted the application after changing the file

## Using Environment Variables in Code

### Backend Example

```javascript
const PORT = process.env.BACKEND_PORT || 5000;
const MONGODB_URI = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;
```

### Frontend Example

```javascript
const PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_URL = `http://${process.env.BACKEND_HOST || '10.12.91.101'}:${process.env.BACKEND_PORT || 5000}`;
``` 