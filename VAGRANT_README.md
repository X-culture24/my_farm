# 🚜 Farm Management System - Vagrant Development Environment

This Vagrant VM provides a complete development and testing environment for the Farm Management System, including all necessary services, monitoring tools, and automated testing capabilities.

## 🌟 Features

- **Complete Development Stack**: Node.js, MongoDB, Redis, Docker, Jenkins
- **Automated Health Checks**: Comprehensive system monitoring and health validation
- **Automated Testing**: End-to-end testing with detailed reporting
- **Real-time Monitoring**: Live dashboard for system resources and services
- **CI/CD Ready**: Jenkins integration for continuous integration/deployment
- **Container Orchestration**: Kubernetes (Minikube) and Helm support
- **Automated Maintenance**: Cron jobs for health checks, testing, and backups

## 🏗️ Architecture

### Services Included
- **Backend API**: Node.js/TypeScript on port 3000
- **Frontend**: React/TypeScript on port 3001
- **Database**: MongoDB on port 27017
- **Cache**: Redis on port 6379
- **CI/CD**: Jenkins on port 8080
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Minikube)
- **Package Manager**: Helm

### System Requirements
- **Host OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 8GB (4GB allocated to VM)
- **Storage**: Minimum 20GB free space
- **Virtualization**: VirtualBox 6.0+ or VMware

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Install Vagrant
# Download from: https://www.vagrantup.com/downloads

# Install VirtualBox
# Download from: https://www.virtualbox.org/wiki/Downloads

# Verify installation
vagrant --version
vboxmanage --version
```

**Note**: This environment uses Ubuntu 20.04 LTS (Focal) for maximum compatibility and stability.

### 2. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd farm-management-system

# Start the VM
vagrant up

# Access the VM
vagrant ssh
```

### 3. First Time Setup
```bash
# Inside the VM, run the startup script
/opt/farm-management/startup.sh

# Or run health check manually
/opt/farm-management/scripts/health-check.sh
```

## 📱 Access URLs

Once the VM is running, you can access:

- **Backend API**: http://192.168.56.10:3000
- **Frontend**: http://192.168.56.10:3001
- **Jenkins**: http://192.168.56.10:8080
- **MongoDB**: mongodb://192.168.56.10:27017
- **Redis**: redis://192.168.56.10:6379

## 🛠️ Available Scripts

### Health Check Script
```bash
# Run comprehensive health check
/opt/farm-management/scripts/health-check.sh

# This script checks:
# - System resources (CPU, memory, disk)
# - Service status (Docker, Redis, MongoDB, Jenkins)
# - Port availability
# - Application endpoints
# - Basic API functionality
```

### Automated Testing Script
```bash
# Run comprehensive tests
/opt/farm-management/scripts/run-tests.sh

# This script tests:
# - Backend API endpoints
# - Frontend accessibility
# - Database connections
# - Docker services
# - System resources
# - Integration workflows
```

### Monitoring Script
```bash
# Start real-time monitoring
/opt/farm-management/scripts/monitor.sh

# Features:
# - Live system metrics dashboard
# - Service status monitoring
# - Automated alerting
# - Resource usage tracking
# - Performance monitoring
```

## 🔄 Automated Tasks

The system includes several automated tasks via cron:

- **Health Checks**: Every 15 minutes
- **Comprehensive Tests**: Every 2 hours
- **Log Cleanup**: Daily at 2 AM
- **Data Backup**: Daily at 3 AM
- **Backup Cleanup**: Daily at 4 AM

## 📊 Monitoring Dashboard

The monitoring script provides a real-time dashboard showing:

- **System Resources**: CPU, memory, disk usage, load average
- **Service Status**: Docker, Redis, MongoDB, Jenkins
- **Application Health**: Container status, endpoint availability
- **Recent Alerts**: System warnings and errors

## 🧪 Testing Framework

### Test Categories
1. **Backend API Tests**: Health checks, endpoint validation
2. **Frontend Tests**: Accessibility, page loading
3. **Database Tests**: Connection validation, query testing
4. **Docker Tests**: Container health, service availability
5. **System Tests**: Resource usage, performance metrics
6. **Integration Tests**: End-to-end workflow validation

### Test Results
- **JSON Reports**: Detailed test results with timestamps
- **Summary Reports**: Human-readable test summaries
- **Error Logs**: Detailed error information for debugging
- **Performance Metrics**: Test execution times and resource usage

## 🔧 Development Workflow

### 1. Start Development Environment
```bash
vagrant up
vagrant ssh
/opt/farm-management/run-dev.sh
```

### 2. Run Your Applications
```bash
# Backend (from host machine)
cd /vagrant
npm run dev

# Frontend (from host machine)
cd /vagrant/frontend
npm start
```

### 3. Monitor System Health
```bash
# Start monitoring
/opt/farm-management/scripts/monitor.sh

# Run health checks
/opt/farm-management/scripts/health-check.sh
```

### 4. Run Tests
```bash
# Automated testing
/opt/farm-management/scripts/run-tests.sh

# Manual health check
/opt/farm-management/scripts/health-check.sh
```

## 📁 Directory Structure

```
/opt/farm-management/
├── backend/           # Backend application files
├── frontend/          # Frontend application files
├── logs/              # System and application logs
├── scripts/           # Health check and testing scripts
├── tests/             # Test files and configurations
├── backup/            # Automated backups
├── monitoring/        # Monitoring configurations
└── README.md          # This documentation
```

## 🚨 Troubleshooting

### Common Issues

#### 1. VM Won't Start
```bash
# Check VirtualBox installation
vboxmanage --version

# Check Vagrant installation
vagrant --version

# Restart VirtualBox service
# Windows: Restart VirtualBox
# macOS/Linux: sudo systemctl restart vboxdrv
```

#### 2. Services Not Running
```bash
# Check service status
sudo systemctl status <service-name>

# Restart services
sudo systemctl restart <service-name>

# View service logs
sudo journalctl -u <service-name> -f
```

#### 3. Port Conflicts
```bash
# Check port usage
netstat -tuln | grep :<port>

# Kill process using port
sudo fuser -k <port>/tcp
```

#### 4. Docker Issues
```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check containers
docker ps -a
docker logs <container-name>
```

### Health Check Failures

If health checks fail:

1. **Check logs**: `/opt/farm-management/logs/`
2. **Run manual health check**: `/opt/farm-management/scripts/health-check.sh`
3. **Check service status**: `systemctl status <service>`
4. **Review error logs**: `/opt/farm-management/logs/health-check-errors-*.log`

### Performance Issues

1. **Increase VM resources** in Vagrantfile:
   ```ruby
   vb.memory = "8192"  # 8GB RAM
   vb.cpus = 4          # 4 CPU cores
   ```

2. **Monitor resource usage**:
   ```bash
   /opt/farm-management/scripts/monitor.sh
   htop
   ```

## 🔒 Security Considerations

- **Firewall**: UFW enabled with necessary ports open
- **Fail2ban**: Protection against brute force attacks
- **Service Isolation**: Services run with minimal privileges
- **Regular Updates**: System packages updated during provisioning
- **Access Control**: SSH key-based authentication recommended

## 📈 Performance Optimization

### VM Configuration
```ruby
# Optimize for development
vb.memory = "4096"      # 4GB RAM
vb.cpus = 2             # 2 CPU cores
vb.customize ["modifyvm", :id, "--cpuexecutioncap", "80"]
```

### Service Optimization
- **MongoDB**: Configured for development workloads
- **Redis**: Optimized memory settings
- **Docker**: Resource limits configured
- **Jenkins**: Development-optimized configuration

## 🔄 Maintenance

### Regular Tasks
1. **Update system packages**: `sudo apt update && sudo apt upgrade`
2. **Clean old logs**: Automatic via cron
3. **Backup important data**: Automatic via cron
4. **Monitor disk space**: Automatic via health checks

### Backup and Recovery
```bash
# Manual backup
tar -czf /opt/farm-management/backup/manual-backup-$(date +%Y%m%d).tar.gz \
  /opt/farm-management/logs \
  /opt/farm-management/test-results

# Restore from backup
tar -xzf /opt/farm-management/backup/backup-YYYYMMDD.tar.gz -C /
```

## 📚 Additional Resources

- **Vagrant Documentation**: https://www.vagrantup.com/docs
- **VirtualBox Documentation**: https://www.virtualbox.org/manual
- **Docker Documentation**: https://docs.docker.com
- **MongoDB Documentation**: https://docs.mongodb.com
- **Redis Documentation**: https://redis.io/documentation

## 🤝 Support

### Getting Help
1. **Check logs**: `/opt/farm-management/logs/`
2. **Run health checks**: `/opt/farm-management/scripts/health-check.sh`
3. **Review this documentation**
4. **Check system status**: `/opt/farm-management/scripts/monitor.sh`

### Reporting Issues
When reporting issues, include:
- **Vagrant version**: `vagrant --version`
- **VirtualBox version**: `vboxmanage --version`
- **Host OS**: Windows/macOS/Linux version
- **Error logs**: From `/opt/farm-management/logs/`
- **Health check output**: From health check script

## 📄 License

This development environment is part of the Farm Management System project and follows the same license terms.

---

**Happy Farming! 🚜🌾**

For questions or issues, check the logs and run the health check script first. The automated monitoring and testing should catch most issues before they become problems.
