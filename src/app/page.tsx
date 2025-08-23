import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <HeroSection />
        <ServicesGrid />
        <WhyUs />
        <Testimonials />
      </main>
    </div>
  );
}
