# TheGoanWedding.com - Premium Wedding Vendor Directory

![Wedding Directory Platform](https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400)

## 🌟 Overview

TheGoanWedding.com is a premium online directory designed to connect couples planning their weddings with the finest local service providers in Goa. The platform serves as a comprehensive hub for wedding planning, featuring elegant design aesthetics inspired by Goan culture with coral, sea blue, and gold color schemes.

### Key Features

- **Vendor Directory**: Comprehensive listings across 43+ categories with reviews and social media integration
- **RSVP Tool**: Elegant wedding RSVP system with QR code generation and guest management
- **Blog System**: Content management for wedding inspiration and planning guides
- **Business Listings**: Easy vendor submission and management system
- **Advanced Search**: Enhanced search with autocomplete, filtering, and wishlist functionality
- **Mobile-First Design**: Fully responsive interface optimized for all devices
- **SEO Optimized**: AdSense-compatible with comprehensive meta tags and structured data

## 🚀 Quick Start

### Option 1: Running on Replit (Recommended)

1. **Fork this Replit**: Click the "Fork" button to create your own copy
2. **Database Setup**: The PostgreSQL database is automatically configured
3. **Start the Application**: The project will automatically start when you run it
4. **Access Your App**: Your application will be available at your Replit URL

### Option 2: Local Development

#### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

#### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd wedding-directory-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

4. **Database Setup**
   ```bash
   # Create your PostgreSQL database
   createdb wedding_directory
   
   # Run database migrations
   npm run db:push
   
   # Seed the database with sample data (optional)
   npm run db:seed
   ```

5. **Build and Start**
   ```bash
   # Build the client application
   npm run build
   
   # Start the server
   npm run dev
   ```

6. **Access the Application**
   - Open your browser to `http://localhost:5000`

## 🔧 Environment Variables

### Required Variables

Only **DATABASE_URL** is required for basic functionality:

```bash
# REQUIRED: PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### Optional Variables

All other variables have sensible defaults but can be customized:

#### Server Configuration
```bash
NODE_ENV=development          # Environment mode
PORT=5000                    # Server port (use 5000 for Replit)
SITE_URL=http://localhost:5000
DOMAIN_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5000
```

#### Database Pool Settings
```bash
DB_MAX_CONNECTIONS=20        # Maximum database connections
DB_IDLE_TIMEOUT=30000       # Connection idle timeout (ms)
DB_CONNECT_TIMEOUT=10000    # Connection timeout (ms)
```

#### Security & API Keys
```bash
API_KEY=                    # General API key for validation
REQUEST_SECRET_KEY=         # Request signature verification
HCAPTCHA_SECRET_KEY=        # hCaptcha secret for forms
```

#### Analytics & Monitoring
```bash
GOOGLE_ANALYTICS_ID=        # Google Analytics tracking ID
SENTRY_DSN=                # Sentry error monitoring DSN
```

#### Supabase (If using Supabase as database)
```bash
SUPABASE_URL=              # Your Supabase project URL
SUPABASE_ANON_KEY=         # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY= # Supabase service role key
```

See `.env.example` for the complete list of available variables.

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── styles/        # CSS styles
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── db/               # Database configuration
│   ├── middleware/       # Express middleware
│   ├── monitoring/       # Health checks and monitoring
│   ├── cache/           # Caching layer
│   └── routes.ts        # API routes
├── shared/              # Shared TypeScript types and schemas
└── migrations/          # Database migration files
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run type-check      # Run TypeScript type checking
npm run lint            # Run ESLint
npm run test            # Run test suite
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

### Database Management
```bash
npm run db:generate     # Generate database migrations
npm run db:push         # Push schema changes to database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:reset        # Reset and reseed database
```

### Production
```bash
npm run build:production # Build optimized for production
npm run start           # Start production server
npm run analyze         # Analyze bundle size
```

## 🎨 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Shadcn/UI** components with Tailwind CSS
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for data persistence
- **Redis** for caching (memory fallback)
- **Helmet** for security headers
- **Rate limiting** and CORS protection

### Development Tools
- **Vite** for fast development and building
- **ESLint** and **TypeScript** for code quality
- **Jest** for testing
- **Drizzle Kit** for database migrations

## 🔒 Security Features

- **Rate Limiting**: Protects against abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin request handling
- **Input Sanitization**: All user inputs are validated and sanitized
- **Helmet Security Headers**: Comprehensive security headers
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **hCaptcha Integration**: Bot protection for forms
- **Environment-based Configuration**: Secure handling of sensitive data

## 📱 Features & Functionality

### Vendor Management
- 43+ wedding vendor categories
- Vendor profiles with social media integration
- Reviews and ratings system
- Business submission and verification
- Advanced search and filtering

### RSVP System
- Create elegant wedding invitation pages
- QR code generation for easy sharing
- Guest list management
- RSVP tracking and analytics
- Image upload support (5MB limit)

### Content Management
- Wedding blog with rich content
- SEO-optimized pages
- Dynamic meta tags and structured data
- Image optimization and lazy loading

### User Experience
- Mobile-first responsive design
- Wishlist functionality (local storage)
- Advanced search with autocomplete
- Location-based filtering (North/South Goa)
- Performance optimizations

## 🔧 Database Schema

The application uses PostgreSQL with the following main entities:

- **Vendors**: Wedding service providers with categories and contact information
- **Reviews**: User reviews and ratings for vendors
- **RSVP Weddings**: Wedding events with guest management
- **RSVP Guests**: Guest responses and attendance tracking
- **Blog Posts**: Content management for wedding-related articles
- **Business Inquiries**: Vendor submission requests

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Fork the Replit project
2. Configure your environment variables (DATABASE_URL is auto-provided)
3. The application automatically deploys and runs

### Manual Deployment
1. Set up a PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build:production`
4. Start the server: `npm start`
5. Set up a reverse proxy (nginx) if needed

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure DATABASE_URL
- [ ] Set up SSL certificates
- [ ] Configure CORS for your domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Enable rate limiting
- [ ] Set up CDN for static assets (optional)

## 🧪 Testing

Run the test suite:
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

Tests cover:
- API endpoint functionality
- Database operations
- Component rendering
- User interactions
- Security middleware

## 📊 Monitoring & Analytics

### Health Checks
- Database connectivity
- Memory usage monitoring
- Response time tracking
- Error rate monitoring

### Analytics Integration
- Google Analytics support
- Custom event tracking
- Performance monitoring
- User behavior analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the established code style (ESLint configuration)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Check the existing documentation
- Review the troubleshooting section below
- Create an issue in the repository

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure DATABASE_URL is correctly set
   - Check if PostgreSQL is running
   - Verify database permissions

2. **Build Failures**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 18+)
   - Ensure all environment variables are set

3. **Frontend Not Loading**
   - Rebuild the client: `npm run build`
   - Check browser console for errors
   - Verify static files are being served

4. **Performance Issues**
   - Enable Redis caching if available
   - Check database query performance
   - Monitor server resource usage

### Getting Help

If you encounter issues not covered here:
1. Check the server logs for error messages
2. Verify your environment configuration
3. Ensure all dependencies are properly installed
4. Review the health check endpoint: `/health`

---

Built with ❤️ for the Goan wedding community. Celebrate your big day, Goan style! 🌺