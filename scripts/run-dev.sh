#!/bin/bash

# Farm Management System Development Runner

echo "Starting Farm Management System in development mode..."

# Check if services are running
if ! systemctl is-active --quiet docker; then
    echo "Starting Docker..."
    sudo systemctl start docker
fi

if ! systemctl is-active --quiet redis-server; then
    echo "Starting Redis..."
    sudo systemctl start redis-server
fi

if ! systemctl is-active --quiet mongodb; then
    echo "Starting MongoDB..."
    sudo systemctl start mongodb
fi

# Wait for services
echo "Waiting for services to be ready..."
sleep 5

# Run health check
echo "Running health check..."
/opt/farm-management/scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo "All services are healthy!"
    echo ""
    echo "Development environment is ready!"
    echo "You can now:"
    echo "  1. Start your backend: cd /vagrant && npm run dev"
    echo "  2. Start your frontend: cd /vagrant/frontend && npm start"
    echo "  3. Run tests: /opt/farm-management/scripts/run-tests.sh"
    echo "  4. Monitor system: /opt/farm-management/scripts/monitor.sh"
else
    echo "Some services are not healthy. Please check the logs."
    exit 1
fi
