# 🚜 Modern Farm Management System

A comprehensive, enterprise-grade farm management system built with modern technologies and DevOps best practices. Features role-based access control, real-time analytics, and optimized performance for managing both livestock and crop operations.

## ✨ Key Highlights

- 🎯 **Role-Based Access Control** - Admin, Manager, and Worker permissions
- 📱 **Modern React Frontend** - Beautiful UI with glassmorphism design
- 🔄 **Real-time Updates** - Socket.IO integration for live notifications  
- 📊 **Advanced Analytics** - Performance metrics and trend analysis
- 🚀 **Production Ready** - Docker, Kubernetes, and CI/CD pipeline
- 🔒 **Enterprise Security** - JWT authentication and data protection

## 🌟 Features

### 🏡 **Farm Management**
- Multi-farm support with detailed location tracking
- Soil analysis and climate zone management  
- Water source monitoring and irrigation systems
- Certification management (organic, fair-trade, USDA)

### 🐄 **Livestock Management**
- Comprehensive animal tracking with health monitoring
- Breeding program management and pregnancy tracking
- Vaccination schedules and medical history
- Feeding management with diet optimization
- Production monitoring (milk, eggs, meat)

### 🥛 **Animal Products Management**
- Product lifecycle tracking from production to sale
- Quality grading and certification management
- Inventory management with automated reorder points
- Batch tracking and expiry date management
- Processing method documentation

### 🌾 **Crop Management**
- Crop planning and rotation optimization
- Harvest tracking and yield prediction
- Storage management with condition monitoring
- Quality control and grading systems
- Seasonal planning and weather integration

### 💰 **Sales & Market Management**
- Unified sales platform for all products
- Customer relationship management
- Order processing and delivery tracking
- Multi-payment method support
- Real-time inventory synchronization

### 📊 **Analytics & Reporting**
- Interactive dashboards with real-time data
- Sales analytics with period-based reporting
- Production metrics and trend analysis
- Financial reporting with profit calculations
- Inventory analytics and forecasting

### 🔔 **Real-time Features**
- Live notifications and alerts
- Real-time data synchronization
- Farm-specific updates and messaging
- Performance monitoring dashboards

## 🏗️ Architecture

### **Backend Stack**
- **Node.js 20.x** with **TypeScript** for type safety and performance
- **Express.js** framework with comprehensive middleware
- **MongoDB 7.0** with Mongoose ODM and advanced indexing
- **Redis 7.2+** for caching, sessions, and real-time data
- **Socket.IO** for real-time communication and live updates

### **Frontend Stack**
- **React 18** with TypeScript and modern hooks
- **Material-UI** with custom glassmorphism design system
- **React Router** for client-side routing
- **Axios** for API communication with interceptors
- **Socket.IO Client** for real-time frontend updates

### **DevOps & Infrastructure**
- **Multi-stage Docker builds** for optimized production images
- **Docker Compose** for local development environment
- **Kubernetes** with Helm charts for production deployment
- **Jenkins CI/CD** with parallel builds and automated testing
- **Nginx** reverse proxy with SSL termination
- **Health checks** and comprehensive monitoring

### **Security & Performance**
- **JWT authentication** with refresh token rotation
- **Role-Based Access Control (RBAC)** with granular permissions
- **Rate limiting** and DDoS protection
- **Input validation** and SQL injection prevention
- **Performance optimization** with caching and data debouncing
- **Security headers** and CORS configuration

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 20.x** (LTS recommended)
- **Docker** and **Docker Compose**
- **MongoDB 7.0+**
- **Redis 7.2+**
- **Git** for version control

### **Development Setup**

#### **Option 1: Vagrant Development Environment (Recommended)**
```bash
# Clone the repository
git clone https://github.com/your-org/farm-management-system.git
cd farm-management-system

# Start Vagrant VM with all dependencies
vagrant up
vagrant ssh

# Inside VM - start the application
fm-start  # Alias for npm run dev
```

#### **Option 2: Local Development**
```bash
# Clone and setup
git clone https://github.com/your-org/farm-management-system.git
cd farm-management-system

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start services with Docker
docker-compose up -d mongodb redis

# Start backend
npm run dev

# Start frontend (new terminal)
cd frontend && npm start
```

#### **Option 3: Full Docker Development**
```bash
# Clone repository
git clone https://github.com/your-org/farm-management-system.git
cd farm-management-system

# Start entire stack
docker-compose -f docker-compose.dev.yml up --build
```

### **Production Deployment**

#### **Docker Images**
```bash
# Build backend image
docker build -t farm-system-backend:latest .

# Build frontend image
docker build -t farm-system-frontend:latest ./frontend

# Push to registry
docker push your-registry.com/farm-system-backend:latest
docker push your-registry.com/farm-system-frontend:latest
```

#### **Kubernetes Deployment**
```bash
# Deploy with Helm
helm upgrade --install farm-system ./helm/farm-system \
  --namespace production \
  --set image.backend.tag=latest \
  --set image.frontend.tag=latest \
  --wait --timeout=15m

# Monitor deployment
kubectl rollout status deployment/farm-system-backend-production -n production
kubectl rollout status deployment/farm-system-frontend-production -n production
```

#### **CI/CD Pipeline**
```bash
# Trigger Jenkins pipeline
# Pipeline automatically:
# 1. Runs tests and security scans
# 2. Builds Docker images
# 3. Deploys to staging
# 4. Awaits approval for production
# 5. Deploys to production with zero downtime
```

## 📁 Project Structure

```
├── src/                          # Backend source code
│   ├── config/                   # Database, Redis, and app configuration
│   ├── controllers/              # Business logic controllers
│   ├── middleware/               # Authentication and validation middleware
│   ├── models/                   # MongoDB schemas and models
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic services
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions and helpers
│   └── server.ts                 # Main application entry point
├── frontend/                     # React frontend application
│   ├── public/                   # Static assets
│   ├── src/                      # Frontend source code
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service functions
│   │   ├── utils/                # Frontend utilities
│   │   ├── types/                # TypeScript interfaces
│   │   └── App.tsx               # Main App component
│   ├── Dockerfile                # Frontend Docker configuration
│   ├── nginx.conf                # Nginx configuration for production
│   └── package.json              # Frontend dependencies
├── k8s/                          # Kubernetes deployment configurations
│   ├── staging/                  # Staging environment configs
│   └── production/               # Production environment configs
├── helm/                         # Helm charts for deployment
├── scripts/                      # Utility scripts
│   ├── health-check.sh           # Health check script
│   ├── monitor.sh                # Monitoring script
│   └── run-dev.sh                # Development startup script
├── docker-compose.yml            # Local development environment
├── docker-compose.dev.yml        # Development with hot reload
├── docker-compose.test.yml       # Testing environment
├── Dockerfile                    # Backend Docker configuration
├── Jenkinsfile                   # CI/CD pipeline configuration
├── Vagrantfile                   # Development VM configuration
├── healthcheck.js                # Docker health check script
├── .gitignore                    # Git ignore patterns
├── package.json                  # Backend dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Endpoints

### **Authentication & Authorization**
```http
POST   /api/auth/login           # User login with credentials
POST   /api/auth/register        # User registration
POST   /api/auth/refresh         # Refresh JWT token
POST   /api/auth/logout          # Logout and invalidate token
GET    /api/auth/profile         # Get current user profile
PUT    /api/auth/profile         # Update user profile
```

### **Farm Management**
```http
GET    /api/farms                # List user accessible farms
POST   /api/farms                # Create new farm (admin/manager)
GET    /api/farms/:id            # Get farm details
PUT    /api/farms/:id            # Update farm (admin/manager)
DELETE /api/farms/:id            # Delete farm (admin only)
GET    /api/farms/:id/analytics  # Farm analytics and metrics
```

### **Livestock Management**
```http
GET    /api/livestock            # List livestock with filters
POST   /api/livestock            # Add new animal
GET    /api/livestock/:id        # Get animal details
PUT    /api/livestock/:id        # Update animal information
DELETE /api/livestock/:id        # Remove animal
GET    /api/livestock/:id/health # Health records
POST   /api/livestock/:id/health # Add health record
```

### **Animal Products**
```http
GET    /api/animal-products      # List products with pagination
POST   /api/animal-products      # Create new product
GET    /api/animal-products/:id  # Get product details
PUT    /api/animal-products/:id  # Update product
DELETE /api/animal-products/:id  # Delete product
PATCH  /api/animal-products/:id/inventory # Update inventory
```

### **Sales & Orders**
```http
POST   /api/sales                # Create new sale
GET    /api/sales                # List sales with filters
GET    /api/sales/:id            # Get sale details
PATCH  /api/sales/:id/status     # Update sale status
POST   /api/sales/:id/payment    # Process payment
GET    /api/sales/analytics      # Sales analytics
```

### **Analytics & Reports**
```http
GET    /api/analytics/dashboard  # Main dashboard data
GET    /api/analytics/sales      # Sales analytics
GET    /api/analytics/production # Production metrics
GET    /api/analytics/inventory  # Inventory analytics
GET    /api/reports/export       # Export reports (CSV/PDF)
```

### **System & Health**
```http
GET    /api/health               # System health check
GET    /api/version              # API version information
GET    /api/docs                 # Swagger API documentation
```

## 🧪 Testing Strategy

### **Backend Testing**
```bash
# Unit tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Security tests
npm run test:security
```

### **Frontend Testing**
```bash
# Frontend unit tests
cd frontend && npm test

# Frontend coverage
cd frontend && npm run test:coverage

# Component testing
cd frontend && npm run test:components

# Visual regression tests
cd frontend && npm run test:visual
```

### **Test Coverage Goals**
- ✅ **Unit Tests**: 90%+ coverage for controllers and services
- ✅ **Integration Tests**: All API endpoints tested
- ✅ **Authentication Tests**: Complete RBAC testing
- ✅ **Performance Tests**: Load testing with realistic data
- ✅ **Security Tests**: OWASP compliance testing
- ✅ **Frontend Tests**: Component and integration testing

## 🔒 Security & Compliance

### **Authentication & Authorization**
- **JWT Authentication** with refresh token rotation
- **Role-Based Access Control (RBAC)** - Admin, Manager, Worker roles
- **Farm-level permissions** with granular access control
- **Session management** with Redis and secure cookies
- **Multi-factor authentication** support (optional)

### **Data Protection**
- **Input validation** with Joi schemas and sanitization
- **SQL/NoSQL injection** prevention with parameterized queries
- **XSS protection** with Content Security Policy headers
- **CSRF protection** with secure tokens
- **Rate limiting** and DDoS protection with Redis
- **Data encryption** at rest and in transit

### **Infrastructure Security**
- **Environment variables** management with secrets
- **Docker security** with non-root users and minimal images
- **Kubernetes secrets** management with encryption
- **Network policies** and service mesh security
- **SSL/TLS termination** with automatic certificate renewal

### **Compliance & Monitoring**
- **GDPR compliance** with data anonymization
- **Audit logging** for all critical operations
- **Security scanning** in CI/CD pipeline
- **Vulnerability assessment** with automated tools
- **Penetration testing** recommendations

## 📈 Monitoring & Observability

### **Application Logging**
- **Winston logger** with multiple transports (file, console, database)
- **Structured logging** in JSON format for better parsing
- **Log levels** (error, warn, info, debug) with environment-based filtering
- **Log rotation** and archiving with retention policies
- **Centralized logging** with ELK stack integration

### **Health Monitoring**
- **Health endpoints** (`/api/health`) for load balancer checks
- **Database connectivity** monitoring with connection pooling
- **Redis connection** status and performance metrics
- **Kubernetes probes** (liveness, readiness, startup)
- **Service dependency** health checks

### **Performance Metrics**
- **Request/response** timing and throughput
- **Database query** performance and slow query detection
- **Memory and CPU** usage tracking with alerts
- **Real-time metrics** dashboard with Grafana
- **Error rate** and success rate monitoring

### **Business Metrics**
- **Farm operations** tracking and analytics
- **User activity** and engagement metrics
- **Sales performance** and conversion rates
- **System usage** patterns and optimization insights

## 🚀 DevOps & CI/CD Pipeline

### **Jenkins Pipeline Stages**

#### **Phase 1: Code Quality**
1. **Code Checkout** - Git repository cloning with commit info
2. **Parallel Dependency Installation** - Backend and frontend npm install
3. **Code Quality Checks** - ESLint, Prettier, and TypeScript compilation
4. **Security Scanning** - npm audit and vulnerability assessment

#### **Phase 2: Testing**
5. **Parallel Testing** - Backend and frontend unit tests
6. **Integration Testing** - API and database integration tests
7. **SonarQube Analysis** - Code quality and security analysis
8. **Test Coverage** - Minimum 90% coverage enforcement

#### **Phase 3: Build & Deploy**
9. **Parallel Builds** - Backend and frontend application builds
10. **Docker Image Creation** - Multi-stage optimized images
11. **Integration Testing** - Full stack testing with Docker Compose
12. **Registry Push** - Secure image deployment to registry

#### **Phase 4: Deployment**
13. **Staging Deployment** - Automated deployment with Helm
14. **Smoke Tests** - Post-deployment validation
15. **Production Approval** - Manual approval with timeout
16. **Production Deployment** - Zero-downtime deployment
17. **Health Validation** - Post-deployment health checks

### **Deployment Features**
- **Blue-Green Deployment** for zero downtime
- **Automatic Rollback** on health check failures
- **Canary Releases** for gradual rollouts
- **Environment Promotion** from staging to production
- **Slack/Email Notifications** for deployment status
- **Artifact Management** with version tracking

## 🌍 Environment Configuration

### **Application Settings**
```bash
# Core Application
NODE_ENV=production                    # Environment (development/staging/production)
PORT=3000                             # Application port
FRONTEND_URL=https://farm-system.com  # Frontend URL for CORS
API_VERSION=v1                        # API version
API_PREFIX=/api                       # API route prefix

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/farm_system  # MongoDB connection
MONGODB_OPTIONS=retryWrites=true&w=majority        # MongoDB options
DB_POOL_SIZE=10                                     # Connection pool size

# Redis Configuration
REDIS_URL=redis://localhost:6379      # Redis connection
REDIS_PREFIX=farm:                    # Redis key prefix
SESSION_SECRET=your-session-secret    # Session encryption key
SESSION_TIMEOUT=3600                  # Session timeout (seconds)

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key           # JWT signing key
JWT_REFRESH_SECRET=your-refresh-secret         # Refresh token key
JWT_EXPIRES_IN=15m                             # Access token expiry
JWT_REFRESH_EXPIRES_IN=7d                      # Refresh token expiry
BCRYPT_ROUNDS=12                               # Password hashing rounds

# Rate Limiting
RATE_LIMIT_WINDOW=15                           # Rate limit window (minutes)
RATE_LIMIT_MAX=100                             # Max requests per window
RATE_LIMIT_SKIP_SUCCESS=true                   # Skip successful requests

# External Services
WEATHER_API_KEY=your-weather-api-key           # Weather service API
SMS_API_KEY=your-sms-api-key                   # SMS service API
EMAIL_SERVICE_KEY=your-email-service-key       # Email service API
FILE_UPLOAD_MAX_SIZE=10485760                  # Max file size (10MB)
FILE_UPLOAD_ALLOWED_TYPES=jpg,jpeg,png,pdf     # Allowed file types

# Monitoring & Logging
LOG_LEVEL=info                                 # Logging level
LOG_FORMAT=json                                # Log format
HEALTH_CHECK_INTERVAL=30                       # Health check interval (seconds)
METRICS_ENABLED=true                           # Enable metrics collection
```

### **Docker Environment**
```bash
# Docker-specific variables
DOCKER_REGISTRY=your-registry.com
DOCKER_NAMESPACE=farm-system
DOCKER_TAG=latest

# Kubernetes Configuration
K8S_NAMESPACE=production
K8S_CLUSTER_NAME=farm-cluster
HELM_CHART_VERSION=1.0.0
```

## 🤝 Contributing

### **Getting Started**
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/farm-management-system.git
   cd farm-management-system
   ```
3. **Setup** development environment
   ```bash
   vagrant up  # Recommended
   # OR
   npm install && cd frontend && npm install
   ```
4. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

### **Development Guidelines**

#### **Code Standards**
- **TypeScript** strict mode with comprehensive typing
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **JSDoc** comments for all public functions
- **Error handling** with proper logging and user feedback

#### **Testing Requirements**
- **Unit tests** for all new functions (90%+ coverage)
- **Integration tests** for API endpoints
- **Frontend tests** for React components
- **E2E tests** for critical user flows

#### **Pull Request Process**
1. **Update** documentation for any new features
2. **Add tests** with good coverage
3. **Run** the full test suite locally
4. **Update** the CHANGELOG.md if applicable
5. **Create** PR with descriptive title and description
6. **Request** review from maintainers

### **Code Review Checklist**
- [ ] Code follows project conventions
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Backward compatibility maintained

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- API documentation available at `/api/docs`
- Swagger UI for interactive API testing
- Code examples and tutorials

### Community
- GitHub Issues for bug reports
- Discussion forum for questions
- Contributing guidelines
- Code of conduct

### Contact
- **Email**: support@farm-system.com
- **Documentation**: https://docs.farm-system.com
- **Issues**: https://github.com/farm-system/issues

## 🔮 Roadmap & Future Enhancements

### **Phase 1 - Foundation (Completed ✅)**
- ✅ **Core Farm Management** - Multi-farm support with detailed tracking
- ✅ **Livestock Management** - Comprehensive animal tracking and health monitoring
- ✅ **Product Management** - Animal and crop product lifecycle management
- ✅ **Sales System** - Unified sales platform with customer management
- ✅ **Role-Based Access Control** - Admin, Manager, Worker permissions
- ✅ **Real-time Analytics** - Interactive dashboards and reporting
- ✅ **Modern UI/UX** - React frontend with glassmorphism design
- ✅ **DevOps Pipeline** - Docker, Kubernetes, Jenkins CI/CD

### **Phase 2 - Intelligence & Integration (In Progress 🔄)**
- 🔄 **IoT Sensor Integration** - Real-time environmental monitoring
- 🔄 **Weather API Integration** - Forecasting and climate data
- 🔄 **Predictive Analytics** - ML-based yield and health predictions
- 🔄 **Mobile Application** - React Native app for field operations
- 🔄 **Advanced Reporting** - Custom report builder and scheduling
- 🔄 **Inventory Optimization** - Automated reorder points and forecasting
- 🔄 **Financial Management** - Comprehensive accounting and budgeting

### **Phase 3 - AI & Automation (Planned 📋)**
- 📋 **AI-Powered Insights** - Machine learning for farm optimization
- 📋 **Computer Vision** - Automated crop and livestock monitoring
- 📋 **Blockchain Integration** - Supply chain transparency and traceability
- 📋 **Marketplace Platform** - B2B/B2C marketplace for farm products
- 📋 **Supply Chain Optimization** - End-to-end logistics management
- 📋 **Sustainability Tracking** - Carbon footprint and environmental impact
- 📋 **Voice Interface** - Voice commands for hands-free operation

### **Phase 4 - Ecosystem & Scale (Future 🚀)**
- 🚀 **Multi-tenant SaaS** - White-label solutions for agricultural organizations
- 🚀 **API Marketplace** - Third-party integrations and extensions
- 🚀 **Global Localization** - Multi-language and regional compliance
- 🚀 **Enterprise Features** - Advanced workflow automation and approvals
- 🚀 **Data Analytics Platform** - Big data processing and insights
- 🚀 **Regulatory Compliance** - Automated compliance reporting and auditing

## 📞 Support & Community

### **Documentation**
- 📚 **API Documentation**: [Swagger UI](http://localhost:3000/api/docs)
- 🎥 **Video Tutorials**: [YouTube Channel](https://youtube.com/farm-system)
- 📖 **User Guide**: [GitBook Documentation](https://docs.farm-system.com)
- 🔧 **Developer Guide**: [GitHub Wiki](https://github.com/farm-system/wiki)

### **Community & Support**
- 💬 **Discord Server**: [Join Community](https://discord.gg/farm-system)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/farm-system/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/farm-system/discussions)
- 📧 **Email Support**: support@farm-system.com

### **Professional Services**
- 🏢 **Enterprise Support**: enterprise@farm-system.com
- 🎓 **Training Programs**: training@farm-system.com
- 🔧 **Custom Development**: consulting@farm-system.com
- 🌐 **Deployment Services**: devops@farm-system.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🚜 **Built with ❤️ for Modern Agriculture**

**Empowering farmers with technology for sustainable and profitable farming**

[![GitHub Stars](https://img.shields.io/github/stars/farm-system/farm-management)](https://github.com/farm-system/farm-management)
[![Docker Pulls](https://img.shields.io/docker/pulls/farm-system/backend)](https://hub.docker.com/r/farm-system/backend)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/jenkins/build?jobUrl=https://jenkins.farm-system.com/job/farm-system)](https://jenkins.farm-system.com)

</div>
