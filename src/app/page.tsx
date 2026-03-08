import Layout from "@/components/layout/layout";
import SportsStats from "@/components/ui/sports-stats";
import SportsCard from "@/components/ui/sports-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "Website Development",
      description: "Custom, high-performance websites built specifically for sports organizations to engage fans and drive growth.",
      category: "Web Services",
      stats: [
        { label: "Projects Completed", value: "50+" },
        { label: "Client Satisfaction", value: "98%" }
      ]
    },
    {
      title: "Event Registration",
      description: "Seamless online registration systems with payment processing that handle everything from sign-ups to check-ins.",
      category: "Event Management",
      stats: [
        { label: "Registrations Processed", value: "100K+" },
        { label: "Revenue Generated", value: "$2M+" }
      ]
    },
    {
      title: "Sports Consulting",
      description: "Strategic digital consulting to help sports organizations maximize their online presence and fan engagement.",
      category: "Consulting",
      stats: [
        { label: "Organizations Helped", value: "30+" },
        { label: "Growth Rate", value: "300%" }
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                Industry Leaders
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Digital Excellence for Sports Organizations
                </h1>
                
                <h2 className="text-xl lg:text-2xl text-red-400 font-semibold">
                  We Build Champions Online
                </h2>
              </div>

              <p className="text-xl text-slate-200 leading-relaxed max-w-lg">
                Transform your sports organization with cutting-edge websites and event registration systems that drive engagement and revenue.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-primary text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button variant="outline" className="btn-outline text-lg px-8 py-4">
                  View Our Work
                </Button>
              </div>
            </div>
            {/* test push */}

            {/* Visual Element */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-600 to-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-red-300" />
                  <div className="text-2xl font-bold mb-2">Champion Results</div>
                  <div className="text-slate-300">Trusted by 50+ Sports Organizations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <SportsStats />

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Services That Win
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From website development to event registration, we provide comprehensive digital solutions for sports organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <SportsCard
                key={index}
                title={service.title}
                description={service.description}
                category={service.category}
                stats={service.stats}
              >
                <div className="pt-4">
                  <Button className="btn-primary w-full">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </SportsCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Champion Your Digital Presence?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join 50+ sports organizations that trust Grit Digital Performance to deliver exceptional digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary text-lg px-8 py-4">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-slate-900">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
