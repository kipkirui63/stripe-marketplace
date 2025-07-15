# CrispAI Marketplace

A comprehensive Django-powered SaaS platform for discovering and managing AI-powered business tools with advanced features for tool exploration, subscription, and user engagement.

## Architecture

- **Frontend**: React with TypeScript and Vite
- **Backend**: Django with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT with email verification
- **Payments**: Stripe integration
- **Email**: HTML templates with SMTP

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL database
- SMTP email credentials
- Stripe account

### 1. Start the Django Backend

```bash
# Method 1: Using the start script
./start_django.sh

# Method 2: Manual start
cd crisp_backend
python manage.py runserver 0.0.0.0:8000
```

The Django backend will be available at: http://localhost:8000

### 2. Start the React Frontend

```bash
# Method 1: Using the start script
./start_frontend.sh

# Method 2: Manual start
vite --host 0.0.0.0 --port 5173
```

The React frontend will be available at: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/user/` - Get user profile
- `GET /api/auth/activate/<uid>/<token>/` - Email activation

### Tools & Subscriptions
- `GET /api/tools/` - List available tools
- `GET /api/subscriptions/` - User subscriptions
- `GET /api/subscriptions/check/` - Check subscription status
- `POST /api/subscriptions/cancel/` - Cancel subscription

### Payments
- `POST /api/checkout/` - Create Stripe checkout session
- `POST /api/webhook/stripe/` - Stripe webhook handler

## Configuration

### Backend Environment Variables

Create a `.env` file in the `crisp_backend/` directory:

```env
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=your-django-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@crispai.ca
```

### Frontend Configuration

The frontend automatically connects to the Django backend at `http://localhost:8000/api`.

## Database Setup

```bash
cd crisp_backend
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
python manage.py loaddata fixtures/sample_data.json  # Optional: load sample data
```

## Features

### User Management
- JWT-based authentication
- Email verification system
- User profiles with roles
- Password reset functionality

### Tool Catalog
- Comprehensive tool management
- Pricing and subscription plans
- Tool categorization
- Active/inactive status

### Subscription System
- Multi-plan subscriptions (1, 3, 6, 12 months)
- Stripe payment integration
- Subscription status tracking
- Automatic renewal handling

### Email System
- HTML email templates
- Account activation emails
- Professional branding
- SMTP configuration

## Development

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
vite --host 0.0.0.0 --port 5173
```

### Backend Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 0.0.0.0:8000
```

## Testing

### Backend Tests
```bash
cd crisp_backend
python test_backend.py
```

### Frontend Tests
```bash
npm test
```

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to static hosting
```

### Backend Deployment
```bash
# Configure production settings
export DEBUG=False
export ALLOWED_HOSTS=your-domain.com

# Collect static files
python manage.py collectstatic

# Deploy to production server
```

## Support

For issues or questions, please contact support@crispai.ca

## License

MIT License