import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import DepartmentsSection from "@/components/DepartmentsSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AppointmentCTA from "@/components/AppointmentCTA";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main content sections */}
      <main className="flex-1">
        <div id="home">
          <Hero />
        </div>
        
        <div id="why-choose-us">
          <WhyChooseUs />
        </div>

        <div id="services">
          <DepartmentsSection />
        </div>

        <div id="doctors">
          <DoctorsSection />
        </div>

        <TestimonialsSection />

        <AppointmentCTA />

        <div id="faq">
          <FAQSection />
        </div>
      </main>

      <div id="contact">
        <Footer />
      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
