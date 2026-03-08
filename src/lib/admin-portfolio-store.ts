export type AdminPortfolioProject = {
  id: string
  title: string
  slug: string
  clientName: string
  sportCategory: string
  projectType: string
  status: string
  featured: boolean
  createdAt: string
  thumbnailImage: string
  description?: string
  technologies?: string
}

const STORAGE_KEY = 'grit_admin_portfolio_projects_v1'

const defaultProjects: AdminPortfolioProject[] = [
  {
    id: '1',
    title: 'Football Club Website',
    slug: 'football-club-website',
    clientName: 'Denver United FC',
    sportCategory: 'football',
    projectType: 'website-redesign',
    status: 'completed',
    featured: true,
    createdAt: '2024-01-15',
    thumbnailImage: '/images/projects/football-club-thumb.jpg',
    description: 'Modernized website redesign with a focus on mobile performance.',
    technologies: 'Next.js, TailwindCSS',
  },
  {
    id: '2',
    title: 'Basketball Tournament Platform',
    slug: 'basketball-tournament-platform',
    clientName: 'Colorado Basketball Association',
    sportCategory: 'basketball',
    projectType: 'event-platform',
    status: 'completed',
    featured: false,
    createdAt: '2024-02-20',
    thumbnailImage: '/images/projects/basketball-platform-thumb.jpg',
    description: 'Event platform with registrations, brackets, and payments.',
    technologies: 'Next.js, Stripe',
  },
  {
    id: '3',
    title: 'Soccer League Management',
    slug: 'soccer-league-management',
    clientName: 'Rocky Mountain Soccer',
    sportCategory: 'soccer',
    projectType: 'new-website',
    status: 'in-progress',
    featured: false,
    createdAt: '2024-03-10',
    thumbnailImage: '/images/projects/soccer-league-thumb.jpg',
    description: 'League management tools and admin workflows.',
    technologies: 'React, TypeScript',
  },
]

function safeParse(json: string): AdminPortfolioProject[] | null {
  try {
    const value = JSON.parse(json)
    if (!Array.isArray(value)) return null
    return value as AdminPortfolioProject[]
  } catch {
    return null
  }
}

export function getPortfolioProjects(): AdminPortfolioProject[] {
  if (typeof window === 'undefined') return defaultProjects
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultProjects
  return safeParse(raw) ?? defaultProjects
}

export function setPortfolioProjects(projects: AdminPortfolioProject[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function getPortfolioProjectById(id: string): AdminPortfolioProject | null {
  const projects = getPortfolioProjects()
  return projects.find((p) => p.id === id) ?? null
}

export function upsertPortfolioProject(project: AdminPortfolioProject) {
  const projects = getPortfolioProjects()
  const idx = projects.findIndex((p) => p.id === project.id)
  const next = [...projects]
  if (idx === -1) next.unshift(project)
  else next[idx] = project
  setPortfolioProjects(next)
  return next
}

export function deletePortfolioProject(id: string) {
  const next = getPortfolioProjects().filter((p) => p.id !== id)
  setPortfolioProjects(next)
  return next
}
