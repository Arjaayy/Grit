import Layout from "@/components/layout/layout";
import Hero from "./home/sections/hero";
import CTASection from "@/components/cta";
import Stats from "./home/sections/stats";
import Services from "./home/sections/services";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Services />
      <CTASection />
    </Layout>
  );
}
