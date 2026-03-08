import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Trophy, Users, Target, Zap } from "lucide-react";
import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/portfolio";
import { notFound } from "next/navigation";
import Link from "next/link";
import CaseStudySection from "@/components/portfolio/case-study-section";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getPortfolioProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = await getPortfolioProjects({
    projectType: project.projectType
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 lg:h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-red-900/70"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                <Link href="/portfolio">
                  <Button variant="outline" className="btn-outline mb-6">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Portfolio
                  </Button>
                </Link>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-red-600 text-white hover:bg-red-700">
                    {project.projectType}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured Project
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  {project.title}
                </h1>
                
                <p className="text-xl text-slate-200 mb-8 max-w-3xl">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-6 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Completed: {formatDate(project.completionDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Client: {project.clientName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {(project.challenges || project.solutions || project.results || project.metrics) && (
        <CaseStudySection project={project} />
      )}

      {/* Project Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge */}
              {project.challenges && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Target className="w-8 h-8 mr-3 text-red-600" />
                    The Challenge
                  </h2>
                  <div className="prose prose-lg text-slate-600">
                    <p>{project.challenges}</p>
                  </div>
                </div>
              )}

              {/* Solution */}
              {project.solutions && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Zap className="w-8 h-8 mr-3 text-red-600" />
                    Our Solution
                  </h2>
                  <div className="prose prose-lg text-slate-600">
                    <p>{project.solutions}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {project.results && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Trophy className="w-8 h-8 mr-3 text-red-600" />
                    Results & Impact
                  </h2>
                  <div className="prose prose-lg text-slate-600">
                    <p>{project.results}</p>
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-red-600">
                  <blockquote className="text-lg text-slate-700 italic mb-4">
                    &ldquo;{project.testimonial}&rdquo;
                  </blockquote>
                  <div className="text-slate-900 font-semibold">
                    {project.testimonialAuthor}
                  </div>
                  <div className="text-slate-600">
                    {project.testimonialRole}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Metrics */}
              {project.metrics && (
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Key Metrics</h3>
                  <div className="space-y-4">
                    {project.metrics.trafficIncrease && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Traffic Increase</span>
                        <span className="font-bold text-red-600">{project.metrics.trafficIncrease}</span>
                      </div>
                    )}
                    {project.metrics.conversionRate && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Conversion Rate</span>
                        <span className="font-bold text-red-600">{project.metrics.conversionRate}</span>
                      </div>
                    )}
                    {project.metrics.pageLoadSpeed && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Page Load Speed</span>
                        <span className="font-bold text-red-600">{project.metrics.pageLoadSpeed}</span>
                      </div>
                    )}
                    {project.metrics.mobileScore && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Mobile Score</span>
                        <span className="font-bold text-red-600">{project.metrics.mobileScore}</span>
                      </div>
                    )}
                    {project.metrics.clientSatisfaction && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Client Satisfaction</span>
                        <span className="font-bold text-red-600">{project.metrics.clientSatisfaction}</span>
                      </div>
                    )}
                    {project.metrics.roi && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">ROI</span>
                        <span className="font-bold text-red-600">{project.metrics.roi}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Project Details</h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">Industry:</span> {project.clientIndustry}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Sport Category:</span> {project.sportCategory}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Project Type:</span> {project.projectType}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Timeline:</span> {formatDate(project.startDate)} - {formatDate(project.completionDate)}
                  </div>
                </div>
              </div>

              {/* Live Site Link */}
              {project.projectUrl && (
                <Button className="btn-primary w-full">
                  <ExternalLink className="mr-2 w-4 h-4" />
                  Visit Live Site
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 1 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((relatedProject) => (
                  <div key={relatedProject.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${relatedProject.thumbnailImage})` }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {relatedProject.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {relatedProject.description}
                      </p>
                      <Link href={`/portfolio/${relatedProject.slug}`}>
                        <Button variant="outline" className="btn-outline w-full">
                          View Project
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Let&apos;s discuss how we can create similar results for your sports organization.
            </p>
            <Button className="btn-primary text-lg px-8 py-4">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
