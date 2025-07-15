# CrispAI Backend

This is the Django backend for the CrispAI Marketplace application.

## Features

- **User Authentication**: JWT-based authentication with email verification
- **Email System**: HTML email templates for account activation
- **Tool Management**: Comprehensive tool catalog with pricing
- **Subscription System**: Multi-plan subscriptions with Stripe integration
- **Payment Processing**: Secure payment handling with webhooks
- **User Profiles**: Extended user profiles with roles and verification status
- **RESTful API**: Complete REST API endpoints for all functionality
- **PostgreSQL Database**: Robust database with proper relationships

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
export DATABASE_URL=your_postgres_url
export STRIPE_SECRET_KEY=your_stripe_secret_key
export STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
export SECRET_KEY=your_django_secret_key
```

3. Run database migrations:
```bash
python manage.py migrate
```

4. Populate sample data:
```bash
python manage.py populate_data
```

5. Start the development server:
```bash
python manage.py runserver 0.0.0.0:8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user profile

### Tools
- `GET /api/tools/` - List all available tools

### Subscriptions
- `GET /api/subscriptions/` - Get user's subscriptions
- `GET /api/subscriptions/check/` - Check subscription status for a tool

### Payments
- `POST /api/checkout/` - Create Stripe checkout session
- `POST /api/webhook/stripe/` - Handle Stripe webhook events

## Database Models

- **User**: Django's built-in User model
- **UserProfile**: Extended user information
- **Tool**: Available AI tools/applications
- **Subscription**: User tool subscriptions
- **Payment**: Payment records

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection URL
- `SECRET_KEY`: Django secret key for sessions
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `EMAIL_HOST`: SMTP email host (default: smtp.gmail.com)
- `EMAIL_PORT`: SMTP email port (default: 587)
- `EMAIL_HOST_USER`: SMTP email username
- `EMAIL_HOST_PASSWORD`: SMTP email password
- `DEFAULT_FROM_EMAIL`: Default from email address
- `DEBUG`: Enable/disable debug mode (default: True)