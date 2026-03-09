# Grit Digital Performance

A modern, high-performance monorepo for sports organizations with Next.js 16, Turborepo, TailwindCSS, and sports-themed branding.

## 🏆 Overview

Grit Digital Performance specializes in creating cutting-edge digital solutions for sports organizations, including:

- Custom website development
- Event registration systems with payment processing
- Portfolio management
- Admin dashboard for organization management
- Digital consulting services

## 🚀 Features

### Website Application

- **Homepage** - Hero section with statistics and service overview
- **Services** - Comprehensive service showcase with pricing
- **About** - Company story, team profiles, and values
- **Contact** - Multi-channel contact with inquiry forms
- **Portfolio** - Project showcase with filtering capabilities
- **Events** - Tournament listings with registration

### Admin Application

- **Dashboard** - Overview with metrics and analytics
- **Portfolio Management** - CRUD operations for portfolio projects
- **Event Management** - Create and manage tournaments and events
- **Organization Management** - Manage sports organizations and clients
- **Participant Management** - Track athletes and participants
- **Payment Processing** - Monitor transactions and revenue
- **Analytics** - Detailed insights and reporting
- **Settings** - Application configuration

### Technical Features

- ⚡ **Next.js 16** with App Router
- 🎨 **TailwindCSS** with custom sports theme
- 🧩 **Framer Motion** animations
- 📱 **Fully Responsive** design
- 🏃 **Sports-focused** branding and UX
- 🔍 **SEO Optimized** content structure
- ♿ **Accessibility** compliant components
- 📦 **Turborepo** for monorepo management
- 🔐 **NextAuth.js** for authentication

## 🛠️ Tech Stack

### Frontend Frameworks

- **Website**: Next.js 16 (App Router)
- **Admin**: Next.js 16 (App Router)
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React & Phosphor Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

### Backend & Database

- **Database**: MongoDB with Prisma ORM
- **Payments**: Stripe integration
- **Authentication**: NextAuth.js with credentials provider
- **Deployment**: Vercel

### Monorepo & Development Tools

- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Code Quality**: ESLint + TypeScript
- **Version Control**: Git
- **Shared Packages**: UI components, utilities, configs

## 📁 Project Structure

```
grit-digital-performance/
├── apps/                          # Applications
│   ├── website/                   # Public website
│   │   ├── src/
│   │   │   ├── app/              # Next.js pages
│   │   │   ├── components/       # Website components
│   │   │   ├── lib/              # Utilities and API calls
│   │   │   └── styles/           # Global styles
│   │   ├── public/               # Static assets
│   │   └── package.json
│   └── admin/                    # Admin dashboard
│       ├── src/
│       │   ├── app/              # Next.js pages (no /admin prefix)
│       │   │   ├── auth/         # Authentication pages
│       │   │   ├── portfolio/    # Portfolio management
│       │   │   ├── events/       # Event management
│       │   │   ├── organizations/ # Organization management
│       │   │   ├── participants/ # Participant management
│       │   │   ├── payments/     # Payment management
│       │   │   ├── analytics/    # Analytics dashboard
│       │   │   └── settings/     # Settings
│       │   ├── components/       # Admin components
│       │   ├── lib/              # Admin utilities
│       │   └── types/            # TypeScript definitions
│       ├── public/               # Static assets
│       └── package.json
├── packages/                     # Shared packages
│   ├── ui/                       # Shared UI components
│   │   ├── src/ui/              # Reusable components
│   │   └── package.json
│   ├── utils/                    # Shared utilities
│   │   └── package.json
│   └── config/                   # Shared configurations
│       ├── eslint/              # ESLint configs
│       ├── tailwind/            # TailwindCSS configs
│       └── typescript/          # TypeScript configs
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kenjivafe/grit-digital-performance.git
   cd grit-digital-performance
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create environment files for each app:

   ```bash
   # Website
   cp apps/website/.env.example apps/website/.env.local

   # Admin
   cp apps/admin/.env.example apps/admin/.env.local
   ```

4. **Run development servers**

   ```bash
   # Start all applications
   npm run dev

   # Or start individual apps
   npm run dev:website    # Website on http://localhost:3000
   npm run dev:admin      # Admin on http://localhost:3001
   ```

5. **Open your browser**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3001](http://localhost:3001)

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start all applications
npm run dev:website      # Start website only
npm run dev:admin        # Start admin only

# Build
npm run build            # Build all applications
npm run build:website    # Build website only
npm run build:admin      # Build admin only

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint on all packages
npm run type-check       # Run TypeScript checks
npm run test             # Run tests
```

## 🎨 Design System

### Colors

- **Primary**: Slate-900 (`oklch(12.9% 0.042 264.695)`) - Professional base
- **Secondary**: Red-600 (`oklch(57.7% 0.245 27.325)`) - Sports energy
- **Accent**: Blue-500 (`oklch(62.3% 0.214 259.815)`) - Trust & reliability
- **Success**: Green-500 (`oklch(72.3% 0.219 149.579)`) - Achievement & winning

### Typography

- **Font Family**: Inter
- **Headings**: Bold weights for impact
- **Body**: Regular weights for readability

### Shared Components

- **SportsCard**: Reusable card for sports content
- **SportsHero**: Prominent display sections
- **SportsStats**: Statistics display with icons
- **LoadingStates**: Skeletons and spinners
- **ErrorBoundary**: Graceful error handling

## 📱 Applications Overview

### Website Application (`/`)

- Public-facing marketing website
- Event listings and registration
- Portfolio showcase
- Contact and service information

### Admin Application (`/`)

- **Dashboard**: Overview with metrics and activity feeds
- **Portfolio**: Manage portfolio projects and case studies
- **Events**: Create and manage tournaments with registration
- **Organizations**: Manage sports organizations and clients
- **Participants**: Track athletes and participant data
- **Payments**: Monitor transactions and revenue
- **Analytics**: Detailed insights and reporting
- **Settings**: Application configuration

**Note**: Admin app uses clean URLs without `/admin` prefix since it's deployed as `admin.gritdp.com`

## 🔧 Configuration

### Environment Variables

**Website** (`apps/website/.env.local`):

```env
# Database
DATABASE_URL="mongodb://localhost:27017/grit-digital"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

**Admin** (`apps/admin/.env.local`):

```env
# Next.js
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"
```

### TailwindCSS Configuration

The project uses TailwindCSS v4 with:

- Custom color palette for sports branding
- Extended font sizes and spacing
- Custom animations and transitions
- Responsive breakpoints
- Shared configuration across apps

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables for each app
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use semantic HTML elements
- Implement responsive design principles

### Component Development

- Create reusable components in `packages/ui/src/ui/`
- Use sports-themed design tokens
- Implement proper error boundaries
- Add loading states for better UX

### Monorepo Best Practices

- Share UI components between applications
- Use consistent configuration packages
- Implement proper dependency management
- Follow Turborepo caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support or inquiries:

- **Email**: info@gritdigitalperformance.com
- **Website**: [https://gritdigitalperformance.com](https://gritdigitalperformance.com)
- **GitHub Issues**: [Create an issue](https://github.com/kenjivafe/grit-digital-performance/issues)

## 🏆 Roadmap

### Phase 1: Core Website ✅

- [x] Homepage with hero and services
- [x] About page with team information
- [x] Contact page with forms
- [x] Portfolio showcase
- [x] Events listing

### Phase 2: Admin Dashboard ✅

- [x] Monorepo structure with Turborepo
- [x] Admin application with authentication
- [x] Portfolio management
- [x] Event management
- [x] Organization management
- [x] Participant tracking
- [x] Payment monitoring
- [x] Analytics dashboard

### Phase 3: Advanced Features

- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app development
- [ ] API documentation
- [ ] Performance monitoring

---

**Built with ❤️ for sports organizations worldwide**
