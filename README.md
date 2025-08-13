# 🚜 Modern Farm Agricultural Management System

A comprehensive, modern farm management system built with Node.js, TypeScript, and MongoDB, designed to solve key problems in the agricultural sector including both farm products and animal products management.

## 🌟 Features

### 🏡 Farm Management
- **Multi-farm support** with detailed location and infrastructure tracking
- **Soil analysis** and climate zone management
- **Water source monitoring** and irrigation system tracking
- **Certification management** (organic, fair-trade, USDA, etc.)

### 🐄 Livestock Management
- **Comprehensive animal tracking** with health monitoring
- **Breeding program management** including pregnancy tracking
- **Vaccination schedules** and medical history
- **Feeding management** with diet tracking
- **Production monitoring** (milk, eggs, etc.)

### 🥛 Animal Products Management
- **Product lifecycle tracking** from production to sale
- **Quality grading** and certification management
- **Inventory management** with reorder points
- **Batch tracking** and expiry date management
- **Processing method documentation**

### 🌾 Farm Products Management
- **Crop planning** and rotation management
- **Harvest tracking** and yield prediction
- **Storage management** with condition monitoring
- **Quality control** and grading systems

### 💰 Sales & Market Management
- **Unified sales platform** for both farm and animal products
- **Customer management** with segmentation
- **Order processing** and delivery tracking
- **Payment management** with multiple payment methods
- **Real-time inventory updates** after sales

### 📊 Analytics & Reporting
- **Sales analytics** with period-based reporting
- **Production metrics** and trend analysis
- **Financial reporting** with profit margin calculations
- **Inventory analytics** with stock level monitoring

### 🔔 Real-time Notifications
- **Socket.IO integration** for live updates
- **Automated alerts** for critical events
- **Farm-specific notifications** and updates

## 🏗️ Architecture

### Backend Stack
- **Node.js** with **TypeScript** for type safety
- **Express.js** framework with middleware support
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **Socket.IO** for real-time communication

### DevOps & Infrastructure
- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **Kubernetes** deployment configurations
- **Jenkins CI/CD** pipeline with automated testing
- **Health checks** and monitoring

### Security Features
- **JWT authentication** with role-based access control
- **Rate limiting** and request validation
- **Helmet.js** security headers
- **Input sanitization** and validation
- **Farm-level access control**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MongoDB 7.0+
- Redis 7.2+

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm-agricultural-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start with Docker Compose**
   ```bash
   npm run docker:compose
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Build Docker image**
   ```bash
   npm run docker:build
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/production/
   ```

3. **Monitor deployment**
   ```bash
   kubectl get pods -n production
   kubectl logs -f deployment/farm-system-production
   ```

## 📁 Project Structure

```
├── src/
│   ├── config/          # Database, Redis, and app configuration
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Authentication and validation middleware
│   ├── models/          # MongoDB schemas and models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and helpers
│   └── server.ts        # Main application entry point
├── k8s/                 # Kubernetes deployment configurations
├── docker-compose.yml   # Local development environment
├── Dockerfile           # Multi-stage Docker build
├── Jenkinsfile          # CI/CD pipeline configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Farms
- `GET /api/farms` - List user farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Livestock
- `GET /api/livestock` - List livestock
- `POST /api/livestock` - Add new animal
- `GET /api/livestock/:id` - Get animal details
- `PUT /api/livestock/:id` - Update animal
- `DELETE /api/livestock/:id` - Remove animal

### Animal Products
- `GET /api/animal-products` - List products
- `POST /api/animal-products` - Create product
- `GET /api/animal-products/:id` - Get product details
- `PUT /api/animal-products/:id` - Update product
- `DELETE /api/animal-products/:id` - Delete product

### Sales
- `POST /api/sales` - Create sale
- `GET /api/sales/farm/:farmId` - Get farm sales
- `GET /api/sales/:id` - Get sale details
- `PATCH /api/sales/:id/status` - Update sale status
- `POST /api/sales/:id/payment` - Add payment
- `GET /api/sales/farm/:farmId/analytics` - Sales analytics

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration
```

### Test Coverage
- Unit tests for all controllers and services
- Integration tests with test database
- API endpoint testing
- Authentication and authorization testing

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Farm-level access permissions
- Session management with Redis

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet.js
- Rate limiting and DDoS protection

### Environment Security
- Environment variable management
- Secret management in Kubernetes
- Secure Docker configurations
- Non-root container execution

## 📈 Monitoring & Logging

### Logging
- Winston logger with multiple transports
- Structured logging in JSON format
- Log rotation and archiving
- Error tracking and monitoring

### Health Checks
- Application health endpoint
- Database connectivity monitoring
- Redis connection status
- Kubernetes liveness and readiness probes

### Performance Monitoring
- Request/response logging
- Database query performance
- Memory and CPU usage tracking
- Response time monitoring

## 🚀 CI/CD Pipeline

### Jenkins Pipeline Stages
1. **Code Checkout** - Git repository cloning
2. **Dependency Installation** - npm install
3. **Linting & Formatting** - Code quality checks
4. **Testing** - Unit and integration tests
5. **Security Scanning** - Vulnerability assessment
6. **Build** - TypeScript compilation
7. **Docker Build** - Container image creation
8. **Integration Testing** - Docker-based testing
9. **Registry Push** - Image deployment
10. **Staging Deployment** - Automated staging
11. **Production Deployment** - Manual approval required

### Automated Deployments
- Staging environment on main branch
- Production deployment with manual approval
- Rollback capabilities
- Health check validation

## 🌍 Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://farm-system.com

# Database
MONGODB_URI=mongodb://localhost:27017/farm_system

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# External Services
WEATHER_API_KEY=your-weather-api-key
SMS_API_KEY=your-sms-api-key
EMAIL_SERVICE_KEY=your-email-service-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Add proper error handling

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

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core farm management
- ✅ Livestock tracking
- ✅ Product management
- ✅ Sales system
- ✅ Basic analytics

### Phase 2 (Next)
- 🔄 IoT sensor integration
- 🔄 Weather forecasting
- 🔄 Predictive analytics
- 🔄 Mobile application
- 🔄 Advanced reporting

### Phase 3 (Future)
- 📋 AI-powered insights
- 📋 Blockchain integration
- 📋 Marketplace platform
- 📋 Supply chain optimization
- 📋 Sustainability tracking

---

**Built with ❤️ for modern agriculture**
