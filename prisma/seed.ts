import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create sport categories
  const sportCategories = [
    { name: 'football', displayName: 'Football', sortOrder: 1 },
    { name: 'basketball', displayName: 'Basketball', sortOrder: 2 },
    { name: 'soccer', displayName: 'Soccer', sortOrder: 3 },
    { name: 'baseball', displayName: 'Baseball', sortOrder: 4 },
    { name: 'hockey', displayName: 'Hockey', sortOrder: 5 },
    { name: 'volleyball', displayName: 'Volleyball', sortOrder: 6 },
    { name: 'tennis', displayName: 'Tennis', sortOrder: 7 },
    { name: 'golf', displayName: 'Golf', sortOrder: 8 },
    { name: 'track-field', displayName: 'Track & Field', sortOrder: 9 },
    { name: 'swimming', displayName: 'Swimming', sortOrder: 10 },
    { name: 'multi-sport', displayName: 'Multi-Sport', sortOrder: 11 },
    { name: 'other', displayName: 'Other Sports', sortOrder: 12 }
  ]

  console.log('Creating sport categories...')
  for (const category of sportCategories) {
    await prisma.sportCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category
    })
  }

  // Create project types
  const projectTypes = [
    { name: 'website-redesign', displayName: 'Website Redesign', sortOrder: 1 },
    { name: 'new-website', displayName: 'New Website', sortOrder: 2 },
    { name: 'event-platform', displayName: 'Event Platform', sortOrder: 3 },
    { name: 'registration-system', displayName: 'Registration System', sortOrder: 4 },
    { name: 'mobile-app', displayName: 'Mobile App', sortOrder: 5 },
    { name: 'tournament-platform', displayName: 'Tournament Platform', sortOrder: 6 },
    { name: 'membership-portal', displayName: 'Membership Portal', sortOrder: 7 },
    { name: 'ecommerce', displayName: 'E-commerce', sortOrder: 8 },
    { name: 'content-management', displayName: 'Content Management', sortOrder: 9 },
    { name: 'analytics-dashboard', displayName: 'Analytics Dashboard', sortOrder: 10 }
  ]

  console.log('Creating project types...')
  for (const type of projectTypes) {
    await prisma.projectType.upsert({
      where: { name: type.name },
      update: type,
      create: type
    })
  }

  // Create sample portfolio projects
  const sampleProjects = [
    {
      title: "Denver United Soccer Club",
      slug: "denver-united-soccer-club",
      description: "Complete website redesign with integrated player registration, schedule management, and fan engagement features.",
      clientName: "Denver United Soccer Club",
      clientIndustry: "Sports Organization",
      sportCategory: "soccer",
      projectType: "website-redesign",
      technologies: ["Next.js", "React", "TailwindCSS", "PostgreSQL", "Stripe"],
      projectUrl: "https://denverunited.com",
      thumbnailImage: "/portfolio/denver-united.jpg",
      heroImage: "/portfolio/denver-united-hero.jpg",
      gallery: ["/portfolio/denver-united-1.jpg", "/portfolio/denver-united-2.jpg", "/portfolio/denver-united-3.jpg"],
      startDate: new Date("2023-01-15"),
      completionDate: new Date("2023-04-20"),
      status: "completed",
      featured: true,
      sortOrder: 1,
      metaTitle: "Denver United Soccer Club Website Redesign",
      metaDescription: "Complete website redesign for Denver United Soccer Club with registration and scheduling features.",
      metaKeywords: ["soccer", "website", "registration", "scheduling"],
      challenges: "The existing website was outdated, difficult to navigate, and lacked modern functionality for player registration and schedule management. The club needed a solution that could handle complex scheduling, multiple team management, and provide a professional online presence.",
      solutions: "We developed a comprehensive sports organization platform using Next.js with a modern, responsive design. The solution includes player registration forms, automated scheduling, team management dashboards, and real-time score updates. We integrated Stripe for payment processing and built a custom content management system for easy updates.",
      results: "The new website resulted in a 250% increase in user engagement, 75% reduction in administrative workload, and 45% increase in player registrations. The club now has a professional online presence that serves as a central hub for all team activities and communications.",
      testimonial: "The new website has transformed how we manage our club. Registration is now automated, and parents love the easy access to schedules and updates.",
      testimonialAuthor: "Sarah Johnson",
      testimonialRole: "Club Director"
    },
    {
      title: "Mountain State Basketball Tournament",
      slug: "mountain-state-basketball-tournament",
      description: "Custom event registration system handling 5,000+ registrations with automated payment processing and team management.",
      clientName: "Mountain State Basketball Association",
      clientIndustry: "Sports Event Management",
      sportCategory: "basketball",
      projectType: "registration-system",
      technologies: ["Next.js", "Node.js", "MongoDB", "Stripe", "SendGrid"],
      projectUrl: "https://mountainstatehoops.com",
      thumbnailImage: "/portfolio/basketball-tournament.jpg",
      heroImage: "/portfolio/basketball-tournament-hero.jpg",
      gallery: ["/portfolio/basketball-1.jpg", "/portfolio/basketball-2.jpg"],
      startDate: new Date("2023-06-01"),
      completionDate: new Date("2023-09-15"),
      status: "completed",
      featured: true,
      sortOrder: 2,
      metaTitle: "Mountain State Basketball Tournament Registration System",
      metaDescription: "Custom tournament registration system handling 5,000+ registrations with automated payments.",
      metaKeywords: ["basketball", "tournament", "registration", "payment"],
      challenges: "The tournament was growing rapidly and the manual registration process was becoming unmanageable. They needed a system that could handle thousands of registrations, process payments securely, manage team brackets, and provide real-time updates to participants.",
      solutions: "We built a comprehensive tournament management platform with automated registration workflows, secure payment processing through Stripe, dynamic bracket generation, and real-time score updates. The system includes team management, communication tools, and a mobile-responsive design for on-the-go access.",
      results: "Processed 5,000+ registrations with zero errors, reduced administrative time by 80%, and increased participant satisfaction by 90%. The tournament now runs smoothly with automated workflows and real-time communication.",
      testimonial: "This system saved our tournament. We can now handle twice as many teams with half the administrative effort.",
      testimonialAuthor: "Mike Thompson",
      testimonialRole: "Tournament Director"
    },
    {
      title: "Colorado Youth Hockey League",
      slug: "colorado-youth-hockey-league",
      description: "Multi-organization platform serving 20+ teams with unified scheduling, registration, and communication tools.",
      clientName: "Colorado Youth Hockey Association",
      clientIndustry: "Youth Sports League",
      sportCategory: "hockey",
      projectType: "event-platform",
      technologies: ["Next.js", "React", "PostgreSQL", "Redis", "WebSockets"],
      projectUrl: "https://coloradoyouthhockey.org",
      thumbnailImage: "/portfolio/hockey-league.jpg",
      heroImage: "/portfolio/hockey-league-hero.jpg",
      gallery: ["/portfolio/hockey-1.jpg", "/portfolio/hockey-2.jpg", "/portfolio/hockey-3.jpg"],
      startDate: new Date("2023-03-10"),
      completionDate: new Date("2023-07-22"),
      status: "completed",
      featured: false,
      sortOrder: 3,
      metaTitle: "Colorado Youth Hockey League Platform",
      metaDescription: "Multi-organization platform serving 20+ hockey teams with unified management tools.",
      metaKeywords: ["hockey", "league", "platform", "scheduling"],
      challenges: "The hockey league consisted of 20+ teams with different needs and schedules. Communication was fragmented, scheduling was complex, and there was no centralized system for managing league operations.",
      solutions: "We developed a unified league management platform that serves all teams with centralized scheduling, automated communication tools, registration management, and real-time score updates. The platform includes role-based access for different user types and integrates with existing hockey management systems.",
      results: "Unified 20+ teams on a single platform, reduced communication errors by 95%, and improved scheduling efficiency by 70%. The league now has complete visibility into all operations and can make data-driven decisions.",
      testimonial: "Finally, all our teams are on the same page. The platform has made league management so much easier.",
      testimonialAuthor: "David Martinez",
      testimonialRole: "League Commissioner"
    }
  ]

  console.log('Creating portfolio projects...')
  const createdProjects = []
  for (const project of sampleProjects) {
    const createdProject = await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project
    })
    createdProjects.push(createdProject)
  }

  // Create metrics for projects
  console.log('Creating project metrics...')
  const metricsData = [
    {
      trafficIncrease: "+250%",
      conversionRate: "12%",
      pageLoadSpeed: "1.2s",
      mobileScore: "95/100",
      clientSatisfaction: "4.8/5",
      roi: "+350%",
      timelineMet: true,
      pagesCreated: 25,
      featuresImplemented: 15,
      customIntegrations: 3
    },
    {
      trafficIncrease: "+180%",
      conversionRate: "8%",
      pageLoadSpeed: "1.5s",
      mobileScore: "92/100",
      clientSatisfaction: "4.9/5",
      roi: "+420%",
      timelineMet: true,
      pagesCreated: 15,
      featuresImplemented: 20,
      customIntegrations: 5
    },
    {
      trafficIncrease: "+200%",
      conversionRate: "10%",
      pageLoadSpeed: "1.8s",
      mobileScore: "90/100",
      clientSatisfaction: "4.7/5",
      roi: "+280%",
      timelineMet: true,
      pagesCreated: 30,
      featuresImplemented: 25,
      customIntegrations: 4
    }
  ]

  for (let i = 0; i < createdProjects.length; i++) {
    const project = createdProjects[i]
    const metrics = metricsData[i]
    
    await prisma.projectMetrics.upsert({
      where: { portfolioProjectId: project.id },
      update: metrics,
      create: {
        portfolioProjectId: project.id,
        ...metrics
      }
    })
  }

  console.log('Database seeding completed successfully!')
  console.log(`Created ${sportCategories.length} sport categories`)
  console.log(`Created ${projectTypes.length} project types`)
  console.log(`Created ${sampleProjects.length} portfolio projects`)
  console.log(`Created ${metricsData.length} project metrics`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
