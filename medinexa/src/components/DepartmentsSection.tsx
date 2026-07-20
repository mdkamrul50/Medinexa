'use client';

import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { 
  FaHeartbeat, FaBrain, FaBone, FaBaby, 
  FaXRay, FaAmbulance, FaTooth, FaStethoscope 
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

interface Department {
  icon: IconType;
  name: string;
  description: string;
  doctorsCount: number;
  color: string;
}

const departments: Department[] = [
  {
    icon: FaHeartbeat,
    name: 'Cardiology',
    description: 'Expert care for your heart, from preventative health checkups to advanced treatment options.',
    doctorsCount: 12,
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    icon: FaBrain,
    name: 'Neurology',
    description: 'Comprehensive diagnosis and therapeutic services for complex brain and nervous system conditions.',
    doctorsCount: 8,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: FaBone,
    name: 'Orthopedics',
    description: 'Specialized diagnosis, treatment, and rehabilitation of musculoskeletal injuries and conditions.',
    doctorsCount: 15,
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: FaBaby,
    name: 'Pediatrics',
    description: 'Dedicated and compassionate medical care for infants, children, and growing adolescents.',
    doctorsCount: 10,
    color: 'from-amber-500/20 to-orange-500/20'
  },
  {
    icon: FaXRay,
    name: 'Radiology',
    description: 'Advanced diagnostic imaging services using cutting-edge MRI, CT, and digital X-ray technology.',
    doctorsCount: 6,
    color: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    icon: FaAmbulance,
    name: 'Emergency Care',
    description: 'Critical, rapid-response medical attention available 24/7 with dedicated trauma specialists.',
    doctorsCount: 18,
    color: 'from-rose-500/20 to-red-500/20'
  },
  {
    icon: FaTooth,
    name: 'Dental Care',
    description: 'Full-spectrum oral healthcare, from routine cleaning and whitening to complex surgery.',
    doctorsCount: 7,
    color: 'from-teal-500/20 to-cyan-500/20'
  },
  {
    icon: FaStethoscope,
    name: 'General Medicine',
    description: 'Primary healthcare services focusing on preventative medicine, diagnosis, and long-term health.',
    doctorsCount: 22,
    color: 'from-indigo-500/20 to-sky-500/20'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
  }
};

export default function DepartmentsSection() {
  return (
    <section id="departments" className="relative py-28 overflow-hidden bg-white dark:bg-slate-950/20 border-t border-border/30">
      {/* Background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-4"
          >
            <span>Our Expertise</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-5 leading-tight"
          >
            Our Medical Departments
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-body font-medium"
          >
            Provide world-class healthcare services through specialized medical departments.
          </motion.p>
        </div>

        {/* Departments Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col justify-between bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-border/80 hover:border-primary/30 p-6 shadow-sm hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Accent Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                <div>
                  {/* Icon Area */}
                  <div className="inline-flex items-center justify-center p-3.5 rounded-xl bg-primary/10 text-primary mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-heading mb-3 group-hover:text-primary transition-colors duration-200">
                    {dept.name}
                  </h3>
                  
                  <p className="text-sm text-body leading-relaxed mb-6 font-medium">
                    {dept.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-xs font-semibold text-muted">
                    {dept.doctorsCount} Doctors Available
                  </span>
                  
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-body group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
