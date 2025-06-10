#!/bin/bash

echo "Setting up Image Voting System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Starting services with Docker Compose..."
docker-compose up -d

echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking service status..."

if curl -s http://10.12.91.101:5000/api/health > /dev/null; then
    echo "Backend is running"
else
    echo "Backend is not responding"
fi

if curl -s http://10.12.91.103:3000/health > /dev/null; then
    echo "Frontend is running"
else
    echo "Frontend is not responding"
fi

echo ""
echo "Setup complete!"
echo "Access the application at: http://10.12.91.103:3000"
echo ""
echo "Service URLs:"
echo "   - Frontend: http://10.12.91.103:3000"
echo "   - Backend API: http://10.12.91.101:5000"
echo "   - MongoDB: 10.12.91.102:27017"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f" 