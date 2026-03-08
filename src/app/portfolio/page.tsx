import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy, Search } from "lucide-react";
import { getPortfolioProjects, getSportCategories, getProjectTypes, type PortfolioFilter } from "@/lib/portfolio";
import PortfolioFilterComponent from "@/components/portfolio/portfolio-filter";
import PortfolioProjectCard from "@/components/portfolio/portfolio-project-card";

export default async function PortfolioPage() {
  // Fetch initial data
  const projects = await getPortfolioProjects();
  const sportCategories = await getSportCategories();
  const projectTypes = await getProjectTypes();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-red-600 text-white hover:bg-red-700 mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Our Success Stories
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Champion Results for Sports Organizations
            </h1>
            
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
              Discover how we&apos;ve helped sports organizations transform their digital presence 
              and achieve remarkable results through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioFilterComponent
            onFilterChange={async (filter: PortfolioFilter) => {
              'use server'
              console.log('Filter applied:', filter)
              // In a real implementation, this would update the displayed projects
            }}
            sportCategories={sportCategories}
            projectTypes={projectTypes}
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <PortfolioProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Results That Speak for Themselves
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our portfolio isn&apos;t just about pretty websites—it&apos;s about delivering measurable business results.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${projects.length}+`, label: "Projects Completed" },
              { value: "100K+", label: "Users Served" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "$2M+", label: "Revenue Generated" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join Our Success Stories?
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
