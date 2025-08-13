#!/bin/bash

# Farm Management System Health Check Script
# This script performs comprehensive health checks on all system components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="/opt/farm-management/logs/health-check-$(date +%Y%m%d-%H%M%S).log"
ERROR_LOG="/opt/farm-management/logs/health-check-errors-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to log errors
log_error() {
    echo -e "$1" | tee -a "$LOG_FILE" "$ERROR_LOG"
}

# Function to check if a service is running
check_service() {
    local service_name=$1
    local service_display_name=${2:-$1}
    
    if systemctl is-active --quiet "$service_name"; then
        log "${GREEN}✓${NC} $service_display_name is running"
        return 0
    else
        log_error "${RED}✗${NC} $service_display_name is not running"
        return 1
    fi
}

# Function to check if a port is listening
check_port() {
    local port=$1
    local service_name=${2:-"Service on port $port"}
    
    if netstat -tuln | grep -q ":$port "; then
        log "${GREEN}✓${NC} $service_name is listening on port $port"
        return 0
    else
        log_error "${RED}✗${NC} $service_name is not listening on port $port"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    local threshold=80
    local usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$usage" -lt "$threshold" ]; then
        log "${GREEN}✓${NC} Disk space usage: ${usage}% (below ${threshold}% threshold)"
        return 0
    else
        log_error "${YELLOW}⚠${NC} Disk space usage: ${usage}% (above ${threshold}% threshold)"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    local threshold=80
    local usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    
    if [ "$usage" -lt "$threshold" ]; then
        log "${GREEN}✓${NC} Memory usage: ${usage}% (below ${threshold}% threshold)"
        return 0
    else
        log_error "${YELLOW}⚠${NC} Memory usage: ${usage}% (above ${threshold}% threshold)"
        return 1
    fi
}

# Function to check Docker containers
check_docker_containers() {
    local containers_running=$(docker ps --format "table {{.Names}}\t{{.Status}}" | wc -l)
    local containers_total=$(docker ps -a --format "table {{.Names}}\t{{.Status}}" | wc -l)
    
    if [ "$containers_running" -eq "$containers_total" ]; then
        log "${GREEN}✓${NC} All Docker containers are running"
        return 0
    else
        log_error "${RED}✗${NC} Some Docker containers are not running"
        docker ps -a --format "table {{.Names}}\t{{.Status}}" | tee -a "$LOG_FILE"
        return 1
    fi
}

# Function to check MongoDB connection
check_mongodb() {
    if mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        log "${GREEN}✓${NC} MongoDB is accessible"
        return 0
    else
        log_error "${RED}✗${NC} MongoDB is not accessible"
        return 1
    fi
}

# Function to check Redis connection
check_redis() {
    if redis-cli ping > /dev/null 2>&1; then
        log "${GREEN}✓${NC} Redis is accessible"
        return 0
    else
        log_error "${RED}✗${NC} Redis is not accessible"
        return 1
    fi
}

# Function to check Node.js applications
check_node_apps() {
    local backend_running=$(curl -s http://localhost:3000/health || echo "FAIL")
    local frontend_running=$(curl -s http://localhost:3001 || echo "FAIL")
    
    if [[ "$backend_running" != "FAIL" ]]; then
        log "${GREEN}✓${NC} Backend API is responding"
    else
        log_error "${RED}✗${NC} Backend API is not responding"
    fi
    
    if [[ "$frontend_running" != "FAIL" ]]; then
        log "${GREEN}✓${NC} Frontend is responding"
    else
        log_error "${RED}✗${NC} Frontend is not responding"
    fi
}

# Function to check Jenkins
check_jenkins() {
    local jenkins_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 || echo "000")
    
    if [ "$jenkins_response" = "200" ]; then
        log "${GREEN}✓${NC} Jenkins is accessible"
        return 0
    else
        log_error "${RED}✗${NC} Jenkins is not accessible (HTTP $jenkins_response)"
        return 1
    fi
}

# Function to run basic tests
run_basic_tests() {
    log "${BLUE}Running basic tests...${NC}"
    
    # Test backend API endpoints
    log "Testing backend API endpoints..."
    local api_tests=(
        "GET /health"
        "GET /api/farms"
        "GET /api/livestock"
        "GET /api/animal-products"
        "GET /api/sales"
    )
    
    for test in "${api_tests[@]}"; do
        local method=$(echo "$test" | cut -d' ' -f1)
        local endpoint=$(echo "$test" | cut -d' ' -f2)
        
        if [ "$method" = "GET" ]; then
            local response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint" || echo "000")
            if [ "$response" != "000" ]; then
                log "${GREEN}✓${NC} $test - HTTP $response"
            else
                log_error "${RED}✗${NC} $test - Failed"
            fi
        fi
    done
}

# Main health check function
main() {
    local start_time=$(date +%s)
    local errors=0
    
    log "${BLUE}=== Farm Management System Health Check ===${NC}"
    log "Started at: $(date)"
    log "Log file: $LOG_FILE"
    log ""
    
    # System health checks
    log "${BLUE}=== System Health Checks ===${NC}"
    check_disk_space || ((errors++))
    check_memory || ((errors++))
    log ""
    
    # Service health checks
    log "${BLUE}=== Service Health Checks ===${NC}"
    check_service "docker" "Docker" || ((errors++))
    check_service "redis-server" "Redis" || ((errors++))
    check_service "mongodb" "MongoDB" || ((errors++))
    check_service "jenkins" "Jenkins" || ((errors++))
    log ""
    
    # Port checks
    log "${BLUE}=== Port Availability Checks ===${NC}"
    check_port 22 "SSH" || ((errors++))
    check_port 80 "HTTP" || ((errors++))
    check_port 3000 "Backend API" || ((errors++))
    check_port 3001 "Frontend" || ((errors++))
    check_port 8080 "Jenkins" || ((errors++))
    check_port 27017 "MongoDB" || ((errors++))
    check_port 6379 "Redis" || ((errors++))
    log ""
    
    # Application health checks
    log "${BLUE}=== Application Health Checks ===${NC}"
    check_docker_containers || ((errors++))
    check_mongodb || ((errors++))
    check_redis || ((errors++))
    check_jenkins || ((errors++))
    log ""
    
    # Run basic tests
    run_basic_tests
    log ""
    
    # Summary
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log "${BLUE}=== Health Check Summary ===${NC}"
    log "Duration: ${duration} seconds"
    log "Total errors: $errors"
    
    if [ $errors -eq 0 ]; then
        log "${GREEN}✓${NC} All health checks passed! System is healthy."
        exit 0
    else
        log_error "${RED}✗${NC} $errors health check(s) failed. Please review the logs."
        exit 1
    fi
}

# Run main function
main "$@"
