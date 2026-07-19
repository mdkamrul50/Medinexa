import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import DepartmentsSection from "@/components/DepartmentsSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AppointmentCTA from "@/components/AppointmentCTA";

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

        {/* Section 3: Medical Departments */}
        <DepartmentsSection />

        {/* Section 4: Meet Our Expert Doctors */}
        <DoctorsSection />

        {/* Section 5: Patient Testimonials */}
        <TestimonialsSection />

        {/* Section 6: Appointment Call-to-Action */}
        <AppointmentCTA />
      </main>
    </div>
  );
}
