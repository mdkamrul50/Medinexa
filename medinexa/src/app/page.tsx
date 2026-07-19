import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main content sections */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero />
        
        {/* Section 2: Why Choose Us */}
        <WhyChooseUs />
      </main>
    </div>
  );
}
