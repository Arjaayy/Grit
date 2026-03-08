# Grit Digital Performance

A modern, high-performance website built for sports organizations with Next.js 14, TailwindCSS, and sports-themed branding.

## 🏆 Overview

Grit Digital Performance specializes in creating cutting-edge digital solutions for sports organizations, including:

- Custom website development
- Event registration systems with payment processing
- Portfolio management
- Digital consulting services

## 🚀 Features

### Core Website Pages

- **Homepage** - Hero section with statistics and service overview
- **Services** - Comprehensive service showcase with pricing
- **About** - Company story, team profiles, and values
- **Contact** - Multi-channel contact with inquiry forms
- **Portfolio** - Project showcase with filtering capabilities
- **Events** - Tournament listings with registration

### Technical Features

- ⚡ **Next.js 14** with App Router
- 🎨 **TailwindCSS** with custom sports theme
- 🧩 **Framer Motion** animations
- 📱 **Fully Responsive** design
- 🏃 **Sports-focused** branding and UX
- 🔍 **SEO Optimized** content structure
- ♿ **Accessibility** compliant components

### Design System

- **Color Palette**: Slate & Red sports theme
- **Typography**: Inter font family
- **Components**: Reusable sports-themed UI elements
- **Animations**: Smooth transitions and micro-interactions

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

### Backend & Database

- **Database**: MongoDB with Prisma ORM
- **Payments**: Stripe integration
- **Deployment**: Vercel

### Development Tools

- **Package Manager**: npm
- **Code Quality**: ESLint + TypeScript
- **Version Control**: Git

## 📁 Project Structure

```
grit-digital-performance/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── services/           # Services page
│   │   ├── portfolio/           # Portfolio page
│   │   ├── events/              # Events page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer, Layout
│   │   └── ui/                 # Reusable UI components
│   ├── styles/               # Custom CSS and design tokens
│   └── utils/                # Utility functions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── tailwind.config.ts    # TailwindCSS configuration
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

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables in `.env.local`:
   - Database connection strings
   - Stripe API keys
   - Next.js configuration

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push    # Push schema to database
npm run db:studio   # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
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

### Components

- **SportsCard**: Reusable card for sports content
- **SportsHero**: Prominent display sections
- **SportsStats**: Statistics display with icons
- **LoadingStates**: Skeletons and spinners
- **ErrorBoundary**: Graceful error handling

## 📱 Pages Overview

### Homepage (`/`)

- Hero section with gradient background
- Key statistics display
- Service overview grid
- Call-to-action sections

### Services (`/services`)

- Service showcase with detailed descriptions
- Pricing information
- Feature lists
- Process explanation

### About (`/about`)

- Company story and mission
- Core values section
- Team member profiles
- Impact statistics

### Contact (`/contact`)

- Multi-channel contact options
- Comprehensive inquiry form
- FAQ section
- Service selection dropdown

### Portfolio (`/portfolio`)

- Project grid with filtering
- Category-based organization
- Project statistics
- Case study links

### Events (`/events`)

- Tournament listings
- Registration status indicators
- Event details and pricing
- Host your event section

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

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

### TailwindCSS Configuration

The project uses TailwindCSS v4 with:

- Custom color palette for sports branding
- Extended font sizes and spacing
- Custom animations and transitions
- Responsive breakpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
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

- Create reusable components in `src/components/ui/`
- Use sports-themed design tokens
- Implement proper error boundaries
- Add loading states for better UX

### Performance Considerations

- Optimize images with Next.js Image component
- Use code splitting for large pages
- Implement proper caching strategies
- Monitor Core Web Vitals

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

### Phase 2: Portfolio Management

- [ ] Database schema design
- [ ] Project filtering and search
- [ ] Individual project pages
- [ ] Case study presentations

### Phase 3: Event Registration

- [ ] Stripe payment integration
- [ ] Registration forms
- [ ] Event management dashboard
- [ ] Revenue tracking

### Phase 4: Advanced Features

- [ ] User authentication
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Mobile app development

---

**Built with ❤️ for sports organizations worldwide**
