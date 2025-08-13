# 🚜 Farm Management System - Ubuntu Installation Guide

This guide will help you install and run the Farm Management System directly on your Ubuntu system, including all necessary services, monitoring tools, and automated testing capabilities.

## 🌟 System Overview

The Farm Management System is a comprehensive agricultural management platform that includes:
- **Backend API**: Node.js/TypeScript with Express.js
- **Frontend**: React/TypeScript with Material-UI
- **Database**: MongoDB for data storage
- **Cache**: Redis for session management and caching
- **CI/CD**: Jenkins for continuous integration/deployment
- **Containerization**: Docker & Docker Compose
- **Monitoring**: Automated health checks and system monitoring
- **Testing**: Comprehensive testing framework with automated reporting

## 🏗️ System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04 LTS (Focal) or Ubuntu 22.04 LTS (Jammy)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 20GB free space minimum
- **CPU**: 2 cores minimum (4 cores recommended)
- **Network**: Internet connection for package installation

### Recommended Requirements
- **OS**: Ubuntu 22.04 LTS (Jammy)
- **RAM**: 8GB or more
- **Storage**: 50GB+ free space
- **CPU**: 4 cores or more
- **Network**: Stable internet connection

## 🚀 Installation Guide

### 1. System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  unzip \
  software-properties-common \
  apt-transport-https \
  ca-certificates \
  gnupg \
  lsb-release \
  build-essential \
  python3 \
  python3-pip \
  python3-venv \
  supervisor \
  cron \
  logrotate \
  fail2ban \
  ufw
```

### 2. Install Node.js and NPM

```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install Yarn globally
sudo npm install -g yarn

# Install PM2 globally for process management
sudo npm install -g pm2
```

### 3. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 4. Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list and install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install MongoDB tools
sudo apt install -y mongodb-mongosh mongodb-database-tools
```

### 5. Install Redis

```bash
# Install Redis server
sudo apt install -y redis-server

# Start and enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
```

### 6. Install Jenkins (Optional - for CI/CD)

```bash
# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo apt-key add -
echo "deb https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list

# Update and install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 7. Install Kubernetes Tools (Optional)

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo chmod +x minikube-linux-amd64
sudo mv minikube-linux-amd64 /usr/local/bin/minikube

# Install Helm
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt update
sudo apt install -y helm
```

## 🔧 Project Setup

### 1. Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>
cd farm-management-system

# Create project directories
sudo mkdir -p /opt/farm-management/{backend,frontend,logs,scripts,tests,backup,monitoring}
sudo chown -R $USER:$USER /opt/farm-management
```

### 2. Copy Scripts and Configuration

```bash
# Copy scripts to system directory
sudo cp scripts/* /opt/farm-management/scripts/
sudo chmod +x /opt/farm-management/scripts/*

# Create symbolic links for easy access
sudo ln -sf /opt/farm-management/scripts/health-check.sh /usr/local/bin/farm-health
sudo ln -sf /opt/farm-management/scripts/run-tests.sh /usr/local/bin/farm-test
sudo ln -sf /opt/farm-management/scripts/monitor.sh /usr/local/bin/farm-monitor
sudo ln -sf /opt/farm-management/scripts/startup.sh /usr/local/bin/farm-startup
```

### 3. Install Project Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to project root
cd ..
```

## ⚙️ Configuration

### 1. Environment Variables

Create environment files for your project:

#### Backend Environment (`.env` in backend directory)
```bash
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/farm_management
MONGODB_OPTIONS={"useNewUrlParser":true,"useUnifiedTopology":true}

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/opt/farm-management/uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/opt/farm-management/logs/backend.log

# Monitoring Configuration
ENABLE_MONITORING=true
HEALTH_CHECK_INTERVAL=30000

# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External APIs
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key
```

#### Frontend Environment (`.env` in frontend directory)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000

# Application Configuration
REACT_APP_NAME=Farm Management System
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=Comprehensive farm management platform

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REAL_TIME=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### 2. MongoDB Configuration

Create MongoDB configuration file:

```bash
sudo nano /etc/mongod.conf
```

Add/modify these settings:
```yaml
# Database Configuration
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

# Network Configuration
net:
  port: 27017
  bindIp: 127.0.0.1

# Security Configuration
security:
  authorization: enabled

# Performance Configuration
operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp

# Logging Configuration
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

### 3. Redis Configuration

Create Redis configuration file:

```bash
sudo nano /etc/redis/redis.conf
```

Add/modify these settings:
```conf
# Network Configuration
bind 127.0.0.1
port 6379

# Memory Configuration
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence Configuration
save 900 1
save 300 10
save 60 10000

# Security Configuration
requirepass your-redis-password

# Logging Configuration
loglevel notice
logfile /var/log/redis/redis-server.log
```

### 4. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # Backend API
sudo ufw allow 3001/tcp    # Frontend
sudo ufw allow 8080/tcp    # Jenkins (if installed)
sudo ufw allow 27017/tcp   # MongoDB
sudo ufw allow 6379/tcp    # Redis

# Enable firewall
sudo ufw --force enable
```

## 🚀 Startup and Management

### 1. Systemd Service Files

Create systemd service for the backend:

```bash
sudo nano /etc/systemd/system/farm-backend.service
```

```ini
[Unit]
Description=Farm Management System Backend
After=network.target mongod.service redis-server.service
Wants=mongod.service redis-server.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/farm-management/backend
ExecStart=/usr/bin/node dist/server.js
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Create systemd service for the frontend:

```bash
sudo nano /etc/systemd/system/farm-frontend.service
```

```ini
[Unit]
Description=Farm Management System Frontend
After=network.target farm-backend.service
Wants=farm-backend.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/farm-management/frontend
ExecStart=/usr/bin/npm start
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

### 2. Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services
sudo systemctl enable farm-backend
sudo systemctl enable farm-frontend

# Start services
sudo systemctl start farm-backend
sudo systemctl start farm-frontend

# Check status
sudo systemctl status farm-backend
sudo systemctl status farm-frontend
```

### 3. PM2 Process Management (Alternative)

If you prefer PM2 over systemd:

```bash
# Navigate to backend directory
cd /opt/farm-management/backend

# Build the project
npm run build

# Start with PM2
pm2 start dist/server.js --name "farm-backend" --env production

# Navigate to frontend directory
cd /opt/farm-management/frontend

# Start with PM2
pm2 start npm --name "farm-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📊 Monitoring and Health Checks

### 1. Automated Health Checks

Set up cron jobs for automated monitoring:

```bash
# Edit crontab
crontab -e

# Add these entries:
# Health check every 15 minutes
*/15 * * * * /opt/farm-management/scripts/health-check.sh >> /opt/farm-management/logs/cron-health-check.log 2>&1

# Comprehensive tests every 2 hours
0 */2 * * * /opt/farm-management/scripts/run-tests.sh >> /opt/farm-management/logs/cron-tests.log 2>&1

# Log cleanup daily at 2 AM
0 2 * * * find /opt/farm-management/logs -name "*.log" -mtime +7 -delete

# Data backup daily at 3 AM
0 3 * * * tar -czf /opt/farm-management/backup/backup-$(date +\%Y\%m\%d).tar.gz /opt/farm-management/logs /opt/farm-management/test-results 2>/dev/null || true

# Backup cleanup (keep last 7 days)
0 4 * * * find /opt/farm-management/backup -name "backup-*.tar.gz" -mtime +7 -delete
```

### 2. Log Rotation

Create logrotate configuration:

```bash
sudo nano /etc/logrotate.d/farm-management
```

```conf
/opt/farm-management/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload farm-backend > /dev/null 2>&1 || true
        systemctl reload farm-frontend > /dev/null 2>&1 || true
    endscript
}
```

## 🧪 Testing and Development

### 1. Run Health Checks

```bash
# Manual health check
farm-health

# Or run directly
/opt/farm-management/scripts/health-check.sh
```

### 2. Run Automated Tests

```bash
# Run comprehensive tests
farm-test

# Or run directly
/opt/farm-management/scripts/run-tests.sh
```

### 3. Start Monitoring Dashboard

```bash
# Start real-time monitoring
farm-monitor

# Or run directly
/opt/farm-management/scripts/monitor.sh
```

## 🔄 Maintenance and Updates

### 1. Regular Maintenance Tasks

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /opt/farm-management/backend && npm update
cd /opt/farm-management/frontend && npm update

# Clean npm cache
npm cache clean --force

# Restart services after updates
sudo systemctl restart farm-backend
sudo systemctl restart farm-frontend
```

### 2. Backup and Recovery

```bash
# Manual backup
tar -czf /opt/farm-management/backup/manual-backup-$(date +%Y%m%d).tar.gz \
  /opt/farm-management/logs \
  /opt/farm-management/test-results \
  /opt/farm-management/uploads

# Restore from backup
tar -xzf /opt/farm-management/backup/backup-YYYYMMDD.tar.gz -C /
```

### 3. Performance Monitoring

```bash
# Monitor system resources
htop
iotop
nethogs

# Monitor application logs
tail -f /opt/farm-management/logs/backend.log
tail -f /opt/farm-management/logs/frontend.log

# Monitor service status
sudo systemctl status farm-backend
sudo systemctl status farm-frontend
```

## 🚨 Troubleshooting

### 1. Common Issues

#### Service Won't Start
```bash
# Check service status
sudo systemctl status farm-backend
sudo systemctl status farm-frontend

# Check logs
sudo journalctl -u farm-backend -f
sudo journalctl -u farm-frontend -f

# Check configuration
sudo systemctl daemon-reload
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test MongoDB connection
mongosh --eval "db.runCommand('ping')"
```

#### Port Conflicts
```bash
# Check port usage
sudo netstat -tuln | grep :3000
sudo netstat -tuln | grep :3001

# Kill process using port
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
```

### 2. Performance Issues

```bash
# Check system resources
free -h
df -h
top

# Check application performance
pm2 monit
pm2 logs

# Restart services
sudo systemctl restart farm-backend
sudo systemctl restart farm-frontend
```

## 📚 Additional Resources

- **Node.js Documentation**: https://nodejs.org/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Redis Documentation**: https://redis.io/documentation
- **Docker Documentation**: https://docs.docker.com
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Systemd Documentation**: https://systemd.io

## 🤝 Support

### Getting Help
1. **Check logs**: `/opt/farm-management/logs/`
2. **Run health checks**: `farm-health`
3. **Check service status**: `sudo systemctl status farm-*`
4. **Review this documentation**

### Reporting Issues
When reporting issues, include:
- **Ubuntu version**: `lsb_release -a`
- **Node.js version**: `node --version`
- **MongoDB version**: `mongod --version`
- **Error logs**: From `/opt/farm-management/logs/`
- **Health check output**: From health check script

---

**Happy Farming! 🚜🌾**

Your Farm Management System is now running directly on Ubuntu with full monitoring, automated testing, and health checks. The system will automatically maintain itself and alert you to any issues.
