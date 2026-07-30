import { motion, type Variants } from 'framer-motion';
import ThreeDSphere from './ThreeDSphere';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col justify-end overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* 3D Sphere — top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-0 right-0 pointer-events-none z-0"
        style={{ transform: 'translate(15%, -15%)' }}
      >
        <div className="relative">
          <div
            style={{
              position: 'absolute',
              inset: '-15%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,0,0,0.2) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />
          <div className="hidden lg:block">
            <ThreeDSphere size={560} />
          </div>
          <div className="hidden sm:block lg:hidden">
            <ThreeDSphere size={400} />
          </div>
          <div className="block sm:hidden">
            <ThreeDSphere size={260} />
          </div>
        </div>
      </motion.div>

      {/* Bottom content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-14 pb-14 md:pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 md:gap-8"
        >
          {/* Availability badge */}
          <motion.div variants={item} className="flex items-center gap-2">
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.7)',
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-[#D7E2EA] font-light uppercase tracking-widest"
              style={{ fontSize: '0.65rem', opacity: 0.7 }}
            >
              Available for internships &amp; projects
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden">
            <motion.h1
              variants={item}
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
            >
              Akash
            </motion.h1>
          </div>
          <div className="overflow-hidden" style={{ marginTop: '-0.5rem' }}>
            <motion.h1
              variants={item}
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
            >
              Pentakota
            </motion.h1>
          </div>

          {/* Bottom row */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-2"
          >
            <div className="flex flex-col gap-1">
              <p
                className="text-[#D7E2EA] font-light uppercase tracking-widest"
                style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)', opacity: 0.5 }}
              >
                Role
              </p>
              <p
                className="text-[#D7E2EA] font-medium"
                style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)' }}
              >
                AI &amp; ML Engineer
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p
                className="text-[#D7E2EA] font-light uppercase tracking-widest"
                style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)', opacity: 0.5 }}
              >
                Based in
              </p>
              <p
                className="text-[#D7E2EA] font-medium"
                style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)' }}
              >
                India — Centurion University
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p
                className="text-[#D7E2EA] font-light uppercase tracking-widest"
                style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)', opacity: 0.5 }}
              >
                GPA
              </p>
              <p
                className="text-[#D7E2EA] font-medium"
                style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)' }}
              >
                8.8 / 10.0
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 right-6 md:right-10 lg:right-14 flex items-center gap-3 z-10"
        style={{ pointerEvents: 'none' }}
      >
        <span
          className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-30"
          style={{ fontSize: '0.55rem', writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
        >
          scroll down
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(215,226,234,0.5), transparent)' }}
        />
      </motion.div>

      {/* Horizontal separator line */}
      <div
        className="absolute bottom-0 left-6 md:left-10 lg:left-14 right-0 z-10"
        style={{ height: 1, background: 'linear-gradient(to right, rgba(215,226,234,0.15), transparent)' }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
