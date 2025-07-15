# CrispAI Marketplace

## Overview

This is a full-stack marketplace application for CrispAI, a company that sells AI-powered business tools and applications. The platform allows users to browse, purchase, and access various AI solutions including business intelligence, writing tools, and recruitment applications.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context for authentication and subscription state
- **Data Fetching**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Django Backend**: Python/Django REST API (crisp_backend/)
  - **Framework**: Django 5.2.4 with Django REST Framework
  - **Authentication**: JWT-based authentication with email verification
  - **Database**: PostgreSQL with Django ORM
  - **Payment Processing**: Stripe integration with webhooks
  - **Email System**: HTML email templates for user activation
  - **API Endpoints**: Complete REST API for all functionality

### Build System
- **Frontend Build**: Vite with React plugin
- **Development**: Standalone React development server
- **TypeScript**: Strict mode with path mapping
- **Backend Development**: Django development server

## Key Components

### Authentication System
- JWT-based authentication with external API (api.crispai.ca)
- User registration with email verification
- Context-based user state management
- Protected routes and conditional rendering

### Subscription Management
- Real-time subscription status checking
- App purchase tracking and validation
- Expiration warnings and notifications
- Integration with Stripe for payment processing

### Marketplace Features
- App browsing with category filtering
- Shopping cart functionality
- Star ratings and reviews
- App preview and external linking
- Coming soon apps with disabled purchase

### UI Components
- Comprehensive design system with shadcn/ui
- Responsive layout with mobile-first approach
- Toast notifications for user feedback
- Modal dialogs for authentication
- Sidebar navigation for cart management

## Data Flow

### User Authentication Flow
1. User submits login/registration form
2. Frontend calls Django backend API (localhost:8000)
3. JWT token stored in localStorage
4. User context updated across application
5. Protected routes become accessible
6. Email verification required for new users

### Purchase Flow
1. User adds apps to shopping cart
2. Cart state managed locally
3. Checkout creates Stripe session via API
4. Payment processed externally
5. Subscription context refreshed
6. User gains access to purchased apps

### App Access Flow
1. User subscription status checked on load
2. Purchased apps identified by API response
3. Access controls applied to app features
4. External app URLs opened for verified users

## External Dependencies

### APIs
- **Django Backend API**: http://localhost:8000/api
  - User authentication with JWT and email verification
  - Tool/subscription management
  - Stripe payment processing with webhooks
  - Email activation system

### Third-party Services
- **Stripe**: Payment processing integration
- **Neon Database**: PostgreSQL hosting
- **Replit**: Development environment integration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form validation
- **TanStack Query**: Data fetching and caching

## Deployment Strategy

### Development
- **Frontend**: Vite dev server on port 5173
- **Backend**: Django dev server on port 8000
- Hot module replacement for fast iteration
- TypeScript compilation checking
- Database migrations with Django ORM

### Production Build
- Frontend assets built with Vite
- Django backend serves API endpoints
- Static assets served from dist/
- Separate deployment for frontend and backend

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- EMAIL_HOST_USER and EMAIL_HOST_PASSWORD for email functionality
- STRIPE_SECRET_KEY for payment processing
- Django SECRET_KEY for security

## Changelog

- July 05, 2025. Initial setup
- July 15, 2025. Migrated from Replit Agent to standard Replit environment
- July 15, 2025. Enhanced authentication flow with session timeout handling and login redirects
- July 15, 2025. Removed Node.js/Express server completely, converted to standalone React frontend
- July 15, 2025. Updated all API calls to use Django backend instead of external API

## Recent Changes

- Enhanced authentication system to redirect users to login when attempting to purchase while not logged in
- Added session timeout detection and automatic logout for expired sessions
- Improved checkout process to handle authentication errors gracefully
- Added session validity checks before proceeding with purchases
- Added terms and conditions checkbox requirement for user registration
- Updated login error message to "Please verify your email first" for unverified accounts
- Implemented subscription plans with monthly/yearly billing toggle and discount structure:
  - 1 month: 0% discount
  - 3 months: 10% discount  
  - 6 months: 15% discount
  - 12 months: 20-25% discount
- Added subscription plans component with pricing toggle similar to the provided screenshot
- **Built complete Django backend (crisp_backend/):**
  - JWT-based user authentication with email verification
  - HTML email templates for account activation
  - Enhanced user profiles with roles and verification status
  - Tool management with comprehensive catalog
  - Multi-plan subscription system with Stripe integration
  - Payment processing with webhook handling
  - RESTful API endpoints matching frontend requirements
  - Database migrations and admin interface
  - Sample data population and testing scripts
  - Email functionality extracted from provided views.py

## User Preferences

Preferred communication style: Simple, everyday language.