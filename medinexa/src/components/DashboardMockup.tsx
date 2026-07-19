'use client';

import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiCalendar, FiActivity, FiSettings, 
  FiSearch, FiBell, FiPlus, FiTrendingUp, FiCheckCircle, FiClock 
} from 'react-icons/fi';

export default function DashboardMockup() {
  // Animation settings
  const containerVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    }
  };

  const chartBars = [35, 45, 60, 50, 75, 90, 65, 80, 95, 70, 85, 100];

  const appointments = [
    { name: 'Sarah Jenkins', type: 'Cardiology', time: '10:30 AM', status: 'Confirmed', color: 'text-primary bg-primary/10' },
    { name: 'David Miller', type: 'Pediatrics', time: '11:15 AM', status: 'In Progress', color: 'text-secondary bg-secondary/10' },
    { name: 'Elena Rostova', type: 'Neurology', time: '01:00 PM', status: 'Pending', color: 'text-accent bg-accent/10' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl dark:shadow-none transition-all duration-300"
    >
      {/* Top Mac-style bar */}
      <div className="flex items-center justify-between border-b border-border bg-slate-50/50 dark:bg-slate-900/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs font-medium text-muted select-none">medinexa-dashboard-v1.0.2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-1.5 w-6 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Main SaaS Interface */}
      <div className="flex h-[420px] md:h-[500px] lg:h-[540px] text-left">
        
        {/* Sidebar */}
        <aside className="hidden md:flex w-52 flex-col border-r border-border bg-slate-50/30 dark:bg-slate-900/20 p-4 shrink-0">
          {/* Mock Logo */}
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-heading tracking-tight text-sm">Medinexa</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1.5">
            {[
              { icon: FiHome, label: 'Overview', active: true },
              { icon: FiUsers, label: 'Patients', active: false },
              { icon: FiCalendar, label: 'Schedule', active: false },
              { icon: FiActivity, label: 'Analytics', active: false },
              { icon: FiSettings, label: 'Settings', active: false }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  item.active 
                    ? 'bg-primary/5 text-primary shadow-sm shadow-primary/5' 
                    : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-heading'
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted'}`} />
                {item.label}
              </div>
            ))}
          </nav>

          {/* Doctor Profile Widget */}
          <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-border/50 bg-card p-2.5 shadow-sm">
            <div className="relative h-7 w-7 rounded-full bg-slate-250 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80')` }} />
              <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white dark:border-slate-800 bg-green-500" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-body leading-none">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">Cardiology</p>
            </div>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-card">
          
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search patient, medical records..."
                className="w-full rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40 py-1.5 pl-9 pr-4 text-xs text-body placeholder-muted outline-none transition-all focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800"
                readOnly
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-heading transition-colors">
                <FiBell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/95 transition-all shadow-sm shadow-primary/20">
                <FiPlus className="h-3.5 w-3.5" />
                <span>Admit Patient</span>
              </button>
            </div>
          </header>

          {/* Panel Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Total Patients', value: '12,840', change: '+12.5%', icon: FiUsers, color: 'text-primary bg-primary/5' },
                { label: 'Active Admissions', value: '42', change: '8 in queue', icon: FiActivity, color: 'text-secondary bg-secondary/5' },
                { label: 'OPD Availability', value: '94%', change: 'Available', icon: FiCheckCircle, color: 'text-green-650 dark:text-green-400 bg-green-500/10' }
              ].map((stat, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">{stat.label}</span>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-heading tracking-tight">{stat.value}</span>
                    <span className="text-[10px] font-medium text-green-500 flex items-center gap-0.5">
                      {stat.change.startsWith('+') && <FiTrendingUp className="h-2.5 w-2.5" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Analytics Graph */}
              <div className="lg:col-span-3 rounded-xl border border-border/80 p-4 bg-card shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-heading">Weekly Patient Intake</h3>
                    <select className="border border-border/80 rounded-md text-[10px] text-muted py-0.5 px-1 bg-card dark:bg-slate-800 outline-none">
                      <option>This Week</option>
                      <option>Last Week</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">Monitored metrics for emergency vs outpatient</p>
                </div>
                
                {/* SVG Visual Chart */}
                <div className="mt-4 flex h-28 items-end gap-1.5 justify-between px-1">
                  {chartBars.map((height, idx) => (
                    <div key={idx} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                      <div 
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          idx === 8 
                            ? 'bg-gradient-to-t from-primary to-blue-400' 
                            : idx === 10
                            ? 'bg-gradient-to-t from-secondary to-teal-400'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`} 
                      />
                      <span className="text-[8px] text-muted mt-1 font-medium select-none">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today Appointments List */}
              <div className="lg:col-span-2 rounded-xl border border-border/80 p-4 bg-card shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-bold text-heading">Queue Schedule</h3>
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    3 Active
                  </span>
                </div>
                <div className="flex-1 space-y-2.5">
                  {appointments.map((appt, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 bg-slate-50/20 dark:bg-slate-800/10 p-2.5 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/25">
                      <div className="overflow-hidden pr-2">
                        <p className="text-[11px] font-bold text-heading truncate">{appt.name}</p>
                        <p className="text-[9px] text-muted font-medium">{appt.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-semibold text-muted flex items-center justify-end gap-1 mb-1">
                          <FiClock className="h-2.5 w-2.5" />
                          {appt.time}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wide ${appt.color}`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>

      </div>
    </motion.div>
  );
}
