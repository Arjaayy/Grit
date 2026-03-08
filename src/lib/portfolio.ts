import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  description: string
  clientName: string
  clientIndustry: string
  sportCategory: string
  projectType: string
  technologies: string[]
  projectUrl?: string | null
  thumbnailImage: string
  heroImage: string
  gallery: string[]
  startDate: Date
  completionDate: Date
  status: string
  featured: boolean
  sortOrder: number
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords: string[]
  challenges?: string | null
  solutions?: string | null
  results?: string | null
  testimonial?: string | null
  testimonialAuthor?: string | null
  testimonialRole?: string | null
  createdAt: Date
  updatedAt: Date
  metrics?: {
    id: string
    portfolioProjectId: string
    trafficIncrease?: string | null
    conversionRate?: string | null
    pageLoadSpeed?: string | null
    mobileScore?: string | null
    clientSatisfaction?: string | null
    roi?: string | null
    timelineMet: boolean
    pagesCreated?: number | null
    featuresImplemented?: number | null
    customIntegrations?: number | null
  } | null
}

export interface PortfolioFilter {
  sportCategory?: string
  projectType?: string
  search?: string
  featured?: boolean
}

export async function getPortfolioProjects(filter: PortfolioFilter = {}): Promise<PortfolioProject[]> {
  const where: Record<string, unknown> = {
    status: 'completed'
  }

  if (filter.sportCategory && filter.sportCategory !== 'all') {
    where.sportCategory = filter.sportCategory
  }

  if (filter.projectType && filter.projectType !== 'all') {
    where.projectType = filter.projectType
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
      { clientName: { contains: filter.search, mode: 'insensitive' } },
      { clientIndustry: { contains: filter.search, mode: 'insensitive' } }
    ]
  }

  if (filter.featured) {
    where.featured = true
  }

  const projects = await prisma.portfolioProject.findMany({
    where,
    include: {
      metrics: true
    },
    orderBy: [
      { sortOrder: 'asc' },
      { completionDate: 'desc' }
    ]
  })

  return projects as PortfolioProject[]
}

export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
    include: {
      metrics: true
    }
  })

  return project as PortfolioProject | null
}

export async function getSportCategories(): Promise<{ name: string; displayName: string }[]> {
  const categories = await prisma.sportCategory.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  })

  return categories.map(cat => ({
    name: cat.name,
    displayName: cat.displayName
  }))
}

export async function getProjectTypes(): Promise<{ name: string; displayName: string }[]> {
  const types = await prisma.projectType.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  })

  return types.map(type => ({
    name: type.name,
    displayName: type.displayName
  }))
}

export async function getFeaturedProjects(limit: number = 6): Promise<PortfolioProject[]> {
  const projects = await prisma.portfolioProject.findMany({
    where: { 
      featured: true,
      status: 'completed'
    },
    include: {
      metrics: true
    },
    orderBy: [
      { sortOrder: 'asc' },
      { completionDate: 'desc' }
    ],
    take: limit
  })

  return projects as PortfolioProject[]
}
