import { PortfolioProject } from '@/lib/portfolio'
import { Badge } from '@/components/ui/badge'
import { Target, Zap, Trophy, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'

interface CaseStudySectionProps {
  project: PortfolioProject
}

export default function CaseStudySection({ project }: CaseStudySectionProps) {
  const getMetricIcon = (label: string) => {
    if (label.toLowerCase().includes('traffic') || label.toLowerCase().includes('roi')) {
      return <TrendingUp className="w-5 h-5" />
    }
    if (label.toLowerCase().includes('conversion')) {
      return <Target className="w-5 h-5" />
    }
    if (label.toLowerCase().includes('satisfaction')) {
      return <Users className="w-5 h-5" />
    }
    if (label.toLowerCase().includes('speed') || label.toLowerCase().includes('load')) {
      return <Clock className="w-5 h-5" />
    }
    return <CheckCircle className="w-5 h-5" />
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-red-600 text-white hover:bg-red-700 mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Case Study
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {project.title}: Success Story
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            How we helped {project.clientName} achieve remarkable results through innovative technology solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Challenge & Solution */}
          <div className="space-y-12">
            {/* Challenge Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The Challenge</h3>
              </div>
              <div className="prose prose-lg text-slate-600">
                <p>{project.challenges}</p>
              </div>
              
              {/* Challenge Details */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-slate-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span>Industry: {project.clientIndustry}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span>Sport Category: {project.sportCategory}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span>Project Type: {project.projectType}</span>
                </div>
              </div>
            </div>

            {/* Solution Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Solution</h3>
              </div>
              <div className="prose prose-lg text-slate-600">
                <p>{project.solutions}</p>
              </div>
              
              {/* Technologies Used */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results & Metrics */}
          <div className="space-y-12">
            {/* Key Metrics */}
            {project.metrics && (
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-3" />
                  Key Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.metrics.trafficIncrease && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        {getMetricIcon('traffic')}
                        <span className="ml-2 text-sm opacity-90">Traffic Increase</span>
                      </div>
                      <div className="text-2xl font-bold">{project.metrics.trafficIncrease}</div>
                    </div>
                  )}
                  {project.metrics.conversionRate && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        {getMetricIcon('conversion')}
                        <span className="ml-2 text-sm opacity-90">Conversion Rate</span>
                      </div>
                      <div className="text-2xl font-bold">{project.metrics.conversionRate}</div>
                    </div>
                  )}
                  {project.metrics.pageLoadSpeed && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        {getMetricIcon('speed')}
                        <span className="ml-2 text-sm opacity-90">Page Load Speed</span>
                      </div>
                      <div className="text-2xl font-bold">{project.metrics.pageLoadSpeed}</div>
                    </div>
                  )}
                  {project.metrics.clientSatisfaction && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        {getMetricIcon('satisfaction')}
                        <span className="ml-2 text-sm opacity-90">Client Satisfaction</span>
                      </div>
                      <div className="text-2xl font-bold">{project.metrics.clientSatisfaction}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Results & Impact</h3>
              </div>
              <div className="prose prose-lg text-slate-600">
                <p>{project.results}</p>
              </div>
              
              {/* Additional Metrics */}
              {project.metrics && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {project.metrics.roi && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{project.metrics.roi}</div>
                      <div className="text-sm text-slate-600">Return on Investment</div>
                    </div>
                  )}
                  {project.metrics.pagesCreated && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{project.metrics.pagesCreated}</div>
                      <div className="text-sm text-slate-600">Pages Created</div>
                    </div>
                  )}
                  {project.metrics.featuresImplemented && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{project.metrics.featuresImplemented}</div>
                      <div className="text-sm text-slate-600">Features Implemented</div>
                    </div>
                  )}
                  {project.metrics.customIntegrations && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{project.metrics.customIntegrations}</div>
                      <div className="text-sm text-slate-600">Custom Integrations</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Testimonial */}
            {project.testimonial && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl text-white">
                <div className="mb-6">
                  <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <blockquote className="text-lg italic mb-6">
                  &ldquo;{project.testimonial}&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{project.testimonialAuthor}</div>
                  <div className="text-slate-300">{project.testimonialRole}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
