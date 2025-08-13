#!/bin/bash

# Farm Management System Monitoring Script
# This script provides real-time monitoring of system resources and services

set -e

# Configuration
MONITOR_INTERVAL=30
LOG_FILE="/opt/farm-management/logs/monitoring-$(date +%Y%m%d).log"
ALERT_LOG="/opt/farm-management/logs/alerts-$(date +%Y%m%d).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to log alerts
alert() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - ALERT: $1" | tee -a "$LOG_FILE" "$ALERT_LOG"
}

# Function to get system metrics
get_system_metrics() {
    # CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    
    # Memory usage
    local mem_total=$(free | grep Mem | awk '{print $2}')
    local mem_used=$(free | grep Mem | awk '{print $3}')
    local mem_usage=$((mem_used * 100 / mem_total))
    
    # Disk usage
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    # Load average
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    
    echo "$cpu_usage|$mem_usage|$disk_usage|$load_avg"
}

# Function to check service status
check_service_status() {
    local service_name=$1
    local display_name=${2:-$1}
    
    if systemctl is-active --quiet "$service_name"; then
        echo "running"
    else
        echo "stopped"
    fi
}

# Function to check Docker containers
check_docker_status() {
    local running_containers=$(docker ps --format "{{.Names}}" | wc -l)
    local total_containers=$(docker ps -a --format "{{.Names}}" | wc -l)
    
    if [ "$running_containers" -eq "$total_containers" ]; then
        echo "healthy"
    else
        echo "unhealthy"
    fi
}

# Function to check application endpoints
check_endpoints() {
    local backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")
    
    if [ "$backend_status" = "200" ] && [ "$frontend_status" = "200" ]; then
        echo "healthy"
    else
        echo "unhealthy"
    fi
}

# Function to display monitoring dashboard
display_dashboard() {
    clear
    echo -e "${BLUE}=== Farm Management System Monitoring Dashboard ===${NC}"
    echo "Last updated: $(date)"
    echo "Monitoring interval: ${MONITOR_INTERVAL}s"
    echo ""
    
    # System metrics
    local metrics=$(get_system_metrics)
    local cpu_usage=$(echo "$metrics" | cut -d'|' -f1)
    local mem_usage=$(echo "$metrics" | cut -d'|' -f2)
    local disk_usage=$(echo "$metrics" | cut -d'|' -f3)
    local load_avg=$(echo "$metrics" | cut -d'|' -f4)
    
    echo -e "${BLUE}System Resources:${NC}"
    echo "CPU Usage: ${cpu_usage}%"
    echo "Memory Usage: ${mem_usage}%"
    echo "Disk Usage: ${disk_usage}%"
    echo "Load Average: ${load_avg}"
    echo ""
    
    # Service status
    echo -e "${BLUE}Service Status:${NC}"
    echo "Docker: $(check_service_status docker)"
    echo "Redis: $(check_service_status redis-server)"
    echo "MongoDB: $(check_service_status mongodb)"
    echo "Jenkins: $(check_service_status jenkins)"
    echo ""
    
    # Application status
    echo -e "${BLUE}Application Status:${NC}"
    echo "Docker Containers: $(check_docker_status)"
    echo "Endpoints: $(check_endpoints)"
    echo ""
    
    # Alerts
    if [ -f "$ALERT_LOG" ]; then
        local recent_alerts=$(tail -5 "$ALERT_LOG" | wc -l)
        if [ $recent_alerts -gt 0 ]; then
            echo -e "${YELLOW}Recent Alerts:${NC}"
            tail -5 "$ALERT_LOG" | while read -r line; do
                echo "  $line"
            done
            echo ""
        fi
    fi
    
    echo -e "${BLUE}Press Ctrl+C to stop monitoring${NC}"
}

# Function to check for alerts
check_alerts() {
    local metrics=$(get_system_metrics)
    local cpu_usage=$(echo "$metrics" | cut -d'|' -f1)
    local mem_usage=$(echo "$metrics" | cut -d'|' -f2)
    local disk_usage=$(echo "$metrics" | cut -d'|' -f3)
    local load_avg=$(echo "$metrics" | cut -d'|' -f4)
    
    # CPU alert
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        alert "High CPU usage: ${cpu_usage}%"
    fi
    
    # Memory alert
    if [ "$mem_usage" -gt 80 ]; then
        alert "High memory usage: ${mem_usage}%"
    fi
    
    # Disk alert
    if [ "$disk_usage" -gt 85 ]; then
        alert "High disk usage: ${disk_usage}%"
    fi
    
    # Load average alert
    if (( $(echo "$load_avg > 2.0" | bc -l) )); then
        alert "High system load: ${load_avg}"
    fi
    
    # Service alerts
    if [ "$(check_service_status docker)" != "running" ]; then
        alert "Docker service is not running"
    fi
    
    if [ "$(check_service_status redis-server)" != "running" ]; then
        alert "Redis service is not running"
    fi
    
    if [ "$(check_service_status mongodb)" != "running" ]; then
        alert "MongoDB service is not running"
    fi
}

# Main monitoring loop
main() {
    log "Starting monitoring..."
    
    # Check if bc is installed for floating point calculations
    if ! command -v bc &> /dev/null; then
        apt-get update && apt-get install -y bc
    fi
    
    while true; do
        display_dashboard
        check_alerts
        sleep "$MONITOR_INTERVAL"
    done
}

# Handle script interruption
trap 'log "Monitoring stopped by user"; exit 0' INT TERM

# Run main function
main "$@"
