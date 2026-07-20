'use client';

import { motion } from 'framer-motion';
import { FaStar, FaUserFriends } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

interface Doctor {
  image: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  patients: string;
  availability: 'Today' | 'Tomorrow';
  badge: string;
  badgeColor: string;
}

const doctors: Doctor[] = [
  {
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    name: 'Dr. Sarah Johnson',
    specialization: 'Chief Cardiologist',
    experience: '12+ Years Exp',
    rating: 4.9,
    patients: '1.5k+',
    availability: 'Today',
    badge: 'Top Rated',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    name: 'Dr. Michael Chen',
    specialization: 'Senior Neurologist',
    experience: '10+ Years Exp',
    rating: 4.8,
    patients: '1.2k+',
    availability: 'Today',
    badge: 'Specialist',
    badgeColor: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=600&q=80',
    name: 'Dr. Emily Taylor',
    specialization: 'Consultant Pediatrician',
    experience: '8+ Years Exp',
    rating: 4.9,
    patients: '950+',
    availability: 'Tomorrow',
    badge: 'Highly Rated',
    badgeColor: 'bg-secondary/10 text-secondary border-secondary/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    name: 'Dr. David Kim',
    specialization: 'Orthopedic Specialist',
    experience: '15+ Years Exp',
    rating: 4.7,
    patients: '2k+',
    availability: 'Today',
    badge: 'Dept Head',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 15 }
  }
};

export default function DoctorsSection() {
  return (
    <section id="doctors" className="relative py-28 overflow-hidden bg-slate-50 dark:bg-slate-900/20">
      {/* Background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-slate-200/40 dark:from-slate-800/10 to-transparent blur-3xl -z-10 opacity-70" />

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
            <span>Our Specialists</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-5 leading-tight"
          >
            Meet Our Expert Doctors
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-body font-medium"
          >
            Experienced specialists dedicated to providing exceptional healthcare.
          </motion.p>
        </div>

        {/* Doctors Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {doctors.map((doc, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group p-[1px] bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary hover:to-secondary shadow-sm hover:shadow-xl rounded-2xl transition-all duration-500 h-full flex flex-col"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-5 h-full flex flex-col justify-between overflow-hidden relative">
                
                {/* Doctor Image Block */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={doc.image} 
                    alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${doc.badgeColor}`}>
                    {doc.badge}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-heading mb-1.5 transition-colors duration-200 group-hover:text-primary">
                    {doc.name}
                  </h3>
                  
                  <p className="text-xs font-bold text-primary mb-3">
                    {doc.specialization} • {doc.experience}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <FaStar className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold text-heading">{doc.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaUserFriends className="h-4 w-4 text-muted" />
                      <span className="text-xs font-semibold text-body">{doc.patients} Patients</span>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${doc.availability === 'Today' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${doc.availability === 'Today' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                    <span className="text-xs font-semibold text-body">
                      Available {doc.availability}
                    </span>
                  </div>
                </div>

                {/* View Profile Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-primary bg-primary/5 hover:bg-primary hover:text-white border border-primary/10 transition-all duration-300 cursor-pointer"
                >
                  <span>View Full Profile</span>
                  <FiArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
