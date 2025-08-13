#!/bin/bash

# Farm Management System Startup Script

echo "Starting Farm Management System..."

# Start all services
sudo systemctl start docker
sudo systemctl start redis-server
sudo systemctl start mongodb
sudo systemctl start jenkins
sudo systemctl start farm-monitoring

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run health check
echo "Running health check..."
/opt/farm-management/scripts/health-check.sh

echo "Farm Management System is ready!"
echo "Access URLs:"
echo "  Backend API: http://192.168.56.10:3000"
echo "  Frontend: http://192.168.56.10:3001"
echo "  Jenkins: http://192.168.56.10:8080"
