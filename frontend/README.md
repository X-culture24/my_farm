# 🚜 Farm System Frontend

A modern, responsive React TypeScript frontend for the Farm Agricultural Management System.

## 🌟 Features

- **Modern UI/UX**: Built with Material-UI (MUI) for a professional, accessible interface
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Socket.IO integration for live notifications and updates
- **State Management**: Zustand for lightweight, performant state management
- **Form Handling**: React Hook Form with validation
- **Data Fetching**: React Query for efficient API data management
- **Authentication**: JWT-based authentication with protected routes
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🏗️ Architecture

### Tech Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Zustand** for state management
- **React Query** for server state
- **React Hook Form** for forms
- **Socket.IO Client** for real-time features
- **Recharts** for data visualization
- **Axios** for HTTP requests

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout and navigation
│   └── ErrorBoundary/  # Error handling
├── pages/              # Page components
│   ├── Auth/           # Login/Register pages
│   ├── Dashboard/      # Main dashboard
│   └── ...            # Other feature pages
├── store/              # Zustand stores
├── services/           # API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see main project README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

The application will open at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api

# Feature Flags
REACT_APP_ENABLE_SOCKET=true
REACT_APP_ENABLE_ANALYTICS=false

# External Services
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
REACT_APP_WEATHER_API_KEY=your-weather-api-key
```

### API Configuration

The frontend is configured to proxy API requests to the backend during development. Update the `proxy` field in `package.json` if needed:

```json
{
  "proxy": "http://localhost:3000"
}
```

## 📱 Available Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate test coverage report

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
```

## 🎨 UI Components

### Material-UI Theme

The application uses a custom Material-UI theme with:

- **Primary Color**: Green (#2E7D32) for agriculture theme
- **Secondary Color**: Orange (#FF8F00) for livestock theme
- **Typography**: Roboto font family
- **Components**: Customized with rounded corners and shadows

### Component Library

- **Layout Components**: Responsive sidebar, header, and navigation
- **Form Components**: Validated inputs, selects, and form controls
- **Data Display**: Tables, cards, and data grids
- **Feedback**: Toast notifications, alerts, and progress indicators
- **Navigation**: Breadcrumbs, pagination, and tabs

## 🔐 Authentication

### Features
- JWT-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh
- Secure logout

### Usage

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();

// Check authentication status
if (isAuthenticated) {
  // User is logged in
}

// Access user data
console.log(user?.firstName);
```

## 📊 State Management

### Zustand Stores

- **Auth Store**: User authentication and profile
- **Notification Store**: System notifications and alerts
- **Farm Store**: Farm data and management
- **Livestock Store**: Animal tracking and health
- **Product Store**: Inventory and product management

### React Query

Used for server state management:

```typescript
import { useQuery, useMutation } from 'react-query';

// Fetch data
const { data, isLoading, error } = useQuery('farms', fetchFarms);

// Mutate data
const mutation = useMutation(createFarm, {
  onSuccess: () => {
    queryClient.invalidateQueries('farms');
  },
});
```

## 🌐 API Integration

### Services

- **Auth Service**: Authentication endpoints
- **Farm Service**: Farm management
- **Livestock Service**: Animal management
- **Product Service**: Product and inventory
- **Sales Service**: Sales and transactions
- **Analytics Service**: Reports and insights

### Request/Response Handling

```typescript
import { farmService } from '@/services/farmService';

try {
  const farms = await farmService.getFarms();
  // Handle success
} catch (error) {
  // Handle error with toast notification
  toast.error('Failed to fetch farms');
}
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1280px (Desktop)
- **lg**: 1280px - 1920px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

### Mobile Features
- Responsive navigation drawer
- Touch-friendly interface
- Optimized layouts for small screens
- Progressive Web App (PWA) support

## 🧪 Testing

### Test Setup
- **Jest** for test runner
- **React Testing Library** for component testing
- **MSW** for API mocking
- **Testing utilities** for common test patterns

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=Dashboard
```

### Test Examples

```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Container**: Docker with nginx
- **Cloud**: AWS S3, Google Cloud Storage
- **CDN**: CloudFlare, AWS CloudFront

### Environment Configuration

Set production environment variables:

```bash
REACT_APP_API_URL=https://api.farm-system.com
REACT_APP_ENABLE_SOCKET=true
```

## 🔧 Development

### Code Style

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode enabled
- **Conventional commits** for commit messages

### Git Hooks

- **Husky** for Git hooks
- **Lint-staged** for pre-commit checks
- **Pre-commit**: Lint and format staged files
- **Pre-push**: Run tests and type checking

### Adding New Features

1. **Create component** in appropriate directory
2. **Add types** to `types/` directory
3. **Create service** if needed
4. **Add to routing** in `App.tsx`
5. **Update navigation** in `Layout.tsx`
6. **Write tests** for new functionality

## 📚 Additional Resources

- [Material-UI Documentation](https://mui.com/)
- [React Query Documentation](https://react-query.tanstack.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com/)

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Ensure accessibility compliance
5. Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built with ❤️ for modern agriculture**
