import { PortfolioProject } from '@/lib/portfolio'
import SportsCard from '@/components/ui/sports-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, ExternalLink, Trophy } from 'lucide-react'

interface PortfolioProjectCardProps {
  project: PortfolioProject
}

export default function PortfolioProjectCard({ project }: PortfolioProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const getProjectStats = () => {
    const stats = []
    
    if (project.metrics?.trafficIncrease) {
      stats.push({ label: 'Traffic Increase', value: project.metrics.trafficIncrease })
    }
    
    if (project.metrics?.conversionRate) {
      stats.push({ label: 'Conversion Rate', value: project.metrics.conversionRate })
    }
    
    if (project.metrics?.pageLoadSpeed) {
      stats.push({ label: 'Page Load', value: project.metrics.pageLoadSpeed })
    }
    
    if (project.metrics?.clientSatisfaction) {
      stats.push({ label: 'Client Satisfaction', value: project.metrics.clientSatisfaction })
    }
    
    if (project.metrics?.roi) {
      stats.push({ label: 'ROI', value: project.metrics.roi })
    }

    return stats
  }

  const stats = getProjectStats()

  return (
    <SportsCard
      title={project.title}
      description={project.description}
      category={project.projectType}
      stats={stats}
      image={project.thumbnailImage}
    >
      <div className="space-y-4">
        {/* Project Meta */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.completionDate)}</span>
          </div>
          {project.featured && (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
              <Trophy className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="btn-primary w-full">
            View Case Study
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          {project.projectUrl && (
            <Button variant="outline" className="btn-outline w-full">
              <ExternalLink className="mr-2 w-4 h-4" />
              Visit Live Site
            </Button>
          )}
        </div>
      </div>
    </SportsCard>
  )
}
