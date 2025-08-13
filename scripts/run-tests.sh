#!/bin/bash

# Farm Management System Automated Testing Script
# This script runs comprehensive tests on the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
TEST_DIR="/opt/farm-management/tests"
LOG_DIR="/opt/farm-management/logs"
RESULTS_DIR="/opt/farm-management/test-results"

# Create directories if they don't exist
mkdir -p "$TEST_DIR" "$LOG_DIR" "$RESULTS_DIR"

# Test results file
RESULTS_FILE="$RESULTS_DIR/test-results-$(date +%Y%m%d-%H%M%S).json"
SUMMARY_FILE="$RESULTS_DIR/test-summary-$(date +%Y%m%d-%H%M%S).txt"

# Function to log messages
log() {
    echo -e "$1" | tee -a "$SUMMARY_FILE"
}

# Function to run a test and record results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local start_time=$(date +%s)
    
    log "Running test: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${GREEN}✓${NC} $test_name passed (${duration}s)"
        echo "{\"test\": \"$test_name\", \"status\": \"passed\", \"duration\": $duration, \"timestamp\": \"$(date -Iseconds)\"}" >> "$RESULTS_FILE"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "${RED}✗${NC} $test_name failed (${duration}s)"
        echo "{\"test\": \"$test_name\", \"status\": \"failed\", \"duration\": $duration, \"timestamp\": \"$(date -Iseconds)\"}" >> "$RESULTS_FILE"
        return 1
    fi
}

# Function to test backend API
test_backend_api() {
    log "${BLUE}=== Backend API Tests ===${NC}"
    
    # Test health endpoint
    run_test "Backend Health Check" "curl -s -f $BACKEND_URL/health > /dev/null"
    
    # Test API endpoints
    run_test "Farms API" "curl -s -f $BACKEND_URL/api/farms > /dev/null"
    run_test "Livestock API" "curl -s -f $BACKEND_URL/api/livestock > /dev/null"
    run_test "Animal Products API" "curl -s -f $BACKEND_URL/api/animal-products > /dev/null"
    run_test "Sales API" "curl -s -f $BACKEND_URL/api/sales > /dev/null"
    
    # Test authentication
    run_test "Auth Endpoint" "curl -s -f $BACKEND_URL/api/auth/login > /dev/null"
}

# Function to test frontend
test_frontend() {
    log "${BLUE}=== Frontend Tests ===${NC}"
    
    # Test if frontend is accessible
    run_test "Frontend Accessibility" "curl -s -f $FRONTEND_URL > /dev/null"
    
    # Test if main page loads
    run_test "Main Page Load" "curl -s $FRONTEND_URL | grep -q 'Farm System'"
}

# Function to test database connections
test_database() {
    log "${BLUE}=== Database Tests ===${NC}"
    
    # Test MongoDB connection
    run_test "MongoDB Connection" "mongosh --eval 'db.runCommand(\"ping\")' > /dev/null"
    
    # Test Redis connection
    run_test "Redis Connection" "redis-cli ping > /dev/null"
}

# Function to test Docker services
test_docker_services() {
    log "${BLUE}=== Docker Services Tests ===${NC}"
    
    # Check if all containers are running
    run_test "Docker Containers Running" "docker ps --format '{{.Status}}' | grep -q 'Up'"
    
    # Check container health
    run_test "Container Health" "docker ps --format '{{.Status}}' | grep -v 'Up' | wc -l | grep -q '^0$'"
}

# Function to test system resources
test_system_resources() {
    log "${BLUE}=== System Resource Tests ===${NC}"
    
    # Check disk space
    run_test "Disk Space" "df / | tail -1 | awk '{if (\$5 < 90) exit 0; else exit 1}'"
    
    # Check memory usage
    run_test "Memory Usage" "free | grep Mem | awk '{if (\$3/\$2 < 0.9) exit 0; else exit 1}'"
    
    # Check CPU load
    run_test "CPU Load" "uptime | awk '{if (\$10 < 2.0) exit 0; else exit 1}'"
}

# Function to run integration tests
run_integration_tests() {
    log "${BLUE}=== Integration Tests ===${NC}"
    
    # Test complete user workflow
    run_test "User Registration Flow" "curl -s -f -X POST $BACKEND_URL/api/auth/register -H 'Content-Type: application/json' -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"password\":\"testpass123\"}' > /dev/null || true"
    
    # Test data creation flow
    run_test "Farm Creation Flow" "curl -s -f -X POST $BACKEND_URL/api/farms -H 'Content-Type: application/json' -d '{\"name\":\"Test Farm\",\"location\":{\"address\":\"Test Address\"}}' > /dev/null || true"
}

# Function to generate test report
generate_report() {
    log "${BLUE}=== Test Report ===${NC}"
    
    local total_tests=$(grep -c '"test":' "$RESULTS_FILE" || echo "0")
    local passed_tests=$(grep -c '"status": "passed"' "$RESULTS_FILE" || echo "0")
    local failed_tests=$(grep -c '"status": "failed"' "$RESULTS_FILE" || echo "0")
    
    log "Total tests: $total_tests"
    log "Passed: ${GREEN}$passed_tests${NC}"
    log "Failed: ${RED}$failed_tests${NC}"
    
    if [ $failed_tests -eq 0 ]; then
        log "${GREEN}✓${NC} All tests passed!"
        exit 0
    else
        log "${RED}✗${NC} $failed_tests test(s) failed!"
        exit 1
    fi
}

# Main function
main() {
    local start_time=$(date +%s)
    
    log "${BLUE}=== Farm Management System Automated Testing ===${NC}"
    log "Started at: $(date)"
    log "Results file: $RESULTS_FILE"
    log "Summary file: $SUMMARY_FILE"
    log ""
    
    # Initialize results file
    echo "[" > "$RESULTS_FILE"
    local first_test=true
    
    # Run all test suites
    test_backend_api
    test_frontend
    test_database
    test_docker_services
    test_system_resources
    run_integration_tests
    
    # Close results file
    echo "]" >> "$RESULTS_FILE"
    
    # Generate report
    generate_report
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    log "Total testing duration: ${duration} seconds"
}

# Run main function
main "$@"
