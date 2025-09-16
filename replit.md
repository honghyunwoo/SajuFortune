# Overview

This is a modern Korean fortune-telling (Saju) web application built as a full-stack Node.js project. The application provides traditional Korean fortune reading services with both free and premium tiers. Users can input their birth information to receive detailed Saju (Four Pillars) analysis based on traditional Korean astrology principles.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Payment Integration**: Stripe React components for premium service payments
- **Design System**: shadcn/ui component library with custom Korean-themed styling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe API integration for premium services
- **API Design**: RESTful endpoints with JSON responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Two main tables - users and fortune_readings
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **File Storage**: In-memory storage for development with plans for database persistence

## Authentication and Authorization
- **Authentication**: Session-based authentication with Express sessions
- **User Management**: Username/email registration with password hashing
- **Authorization**: Simple role-based access (free vs premium users)
- **Anonymous Users**: Support for guest fortune readings with session tracking
- **Security**: CSRF protection through session validation

## Core Business Logic
- **Saju Calculator**: Traditional Korean astrology calculation engine
- **Service Tiers**: Free basic readings and premium detailed analysis
- **Payment Flow**: Stripe integration for premium service upgrades
- **PDF Generation**: Client-side PDF generation for fortune reading reports

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **connect-pg-simple**: PostgreSQL session store for Express

## Payment Processing
- **Stripe**: Payment processing for premium services
- **@stripe/stripe-js**: Client-side Stripe integration
- **@stripe/react-stripe-js**: React components for Stripe

## UI and Styling
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Noto Sans KR and Inter fonts for Korean text support

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration and schema management tools

## Additional Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class management
- **nanoid**: Unique ID generation
- **wouter**: Lightweight React router
- **TanStack React Query**: Server state management and caching