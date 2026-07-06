import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, ExternalLink } from 'lucide-react';

const STATS = [
  { value: '8.8', label: 'GPA Score', suffix: '/10' },
  { value: '8', label: 'GitHub Projects', suffix: '' },
  { value: '87%', label: 'Multimodal Accuracy', suffix: '' },
  { value: '1', label: 'AI Internship', suffix: '' },
];

const EXPERIENCE = {
  role: 'AI/ML Intern',
  company: 'Oceanautics',
  period: '2026',
  description:
    'Completed an applied AI internship focused on marine robotics workflows, contributing to AwakeMate, an AI wellness and focus-monitoring platform that analyzes behavioral and sleep patterns to generate personalized recommendations.',
  certificate: '/oceanautics_internship.pdf',
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      ref={ref}
      className="px-6 md:px-10 lg:px-14 py-24 md:py-32 relative z-10"
      style={{
        background: '#fff',
        borderRadius: 'clamp(40px, 5vw, 70px) clamp(40px, 5vw, 70px) 0 0',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-16 md:mb-20"
      >
        <div style={{ width: 24, height: 1, background: '#0C0C0C', opacity: 0.3 }} />
        <span
          className="font-light uppercase tracking-widest text-[#0C0C0C] opacity-40"
          style={{ fontSize: '0.6rem' }}
        >
          About Me
        </span>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-black uppercase leading-none tracking-tight text-[#0C0C0C] mb-10"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
          >
            Turning Data<br />Into Systems<br />
            <span style={{
              background: 'linear-gradient(90deg, #cc0000, #8b0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              That Work.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[#0C0C0C] font-light leading-relaxed mb-8"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)', opacity: 0.7, maxWidth: '52ch' }}
          >
            I&apos;m a B.Tech Computer Science &amp; Machine Learning student at Centurion University,
            focused on AI/ML engineering, computer vision, generative AI, and intelligent assistants
            that turn raw data, camera streams, and natural language into usable products.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#0C0C0C] font-light leading-relaxed mb-12"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)', opacity: 0.7, maxWidth: '52ch' }}
          >
            My work includes YOLOv8/OpenCV object detection, real-time drowsiness and focus monitoring,
            multimodal emotion recognition, AI health and student assistant chatbots, visual search, and
            local meeting AI with transcription, speaker diarization, and Q&amp;A.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.36, duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-2xl p-5 md:p-6 mb-10"
            style={{
              maxWidth: '56ch',
              background: 'linear-gradient(135deg, #fff 0%, #f8eeee 100%)',
              border: '1px solid rgba(180,0,0,0.12)',
              boxShadow: '0 20px 45px rgba(45,0,0,0.08)',
            }}
          >
            <div
              className="absolute -right-10 -top-10 h-28 w-28 rounded-full"
              style={{ background: 'rgba(204,0,0,0.08)' }}
            />
            <div className="relative flex items-start gap-4">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #cc0000, #7a0000)',
                  boxShadow: '0 14px 30px rgba(160,0,0,0.22)',
                }}
              >
                <Briefcase size={20} color="#fff" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="font-light uppercase tracking-widest text-[#0C0C0C]"
                    style={{ fontSize: '0.58rem', opacity: 0.5 }}
                  >
                    Experience
                  </span>
                  <span
                    className="rounded-full px-3 py-1 font-medium uppercase tracking-widest"
                    style={{ fontSize: '0.55rem', color: '#cc0000', background: 'rgba(204,0,0,0.08)' }}
                  >
                    {EXPERIENCE.period}
                  </span>
                </div>
                <h3 className="text-[#0C0C0C] font-bold" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)' }}>
                  {EXPERIENCE.role} - {EXPERIENCE.company}
                </h3>
                <p
                  className="text-[#0C0C0C] font-light leading-relaxed mt-3"
                  style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.05rem)', opacity: 0.68 }}
                >
                  {EXPERIENCE.description}
                </p>
                <a
                  href={EXPERIENCE.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-70"
                  style={{ fontSize: '0.62rem', color: '#cc0000' }}
                >
                  Internship Certificate
                  <ExternalLink size={13} strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="mailto:akashp3620@gmail.com"
              className="inline-flex items-center gap-2 rounded-full font-medium uppercase tracking-widest
                text-white px-7 py-3 transition-opacity duration-200 hover:opacity-85"
              style={{
                fontSize: '0.7rem',
                background: 'linear-gradient(123deg, #1a0000 7%, #cc0000 37%, #8b0000 72%, #ff4500 100%)',
                boxShadow: '0px 4px 20px rgba(200,0,0,0.3)',
              }}
            >
              Get In Touch
            </a>
            <a
              href="https://www.linkedin.com/in/akash-pentakota/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full font-medium uppercase tracking-widest
                text-[#0C0C0C] px-7 py-3 border border-[#0C0C0C]/20 hover:bg-[#0C0C0C]/5
                transition-colors duration-200"
              style={{ fontSize: '0.7rem' }}
            >
              LinkedIn
            </a>
          </motion.div>
        </div>

        <div className="flex flex-col gap-10 lg:w-[38%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden"
            style={{
              borderRadius: 'clamp(20px, 3vw, 36px)',
              aspectRatio: '4/5',
              background: 'linear-gradient(160deg, #f5f0f0 0%, #fde8e8 60%, #f5e0e0 100%)',
            }}
          >
            <img
              src="/Akash-removebg-preview.png"
              alt="Akash Pentakota"
              className="w-full h-full object-contain object-bottom"
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="flex flex-col gap-1 p-5 rounded-2xl"
                style={{ background: '#f5f0f0', border: '1px solid rgba(180,0,0,0.1)' }}
              >
                <span
                  className="font-black leading-none"
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    background: 'linear-gradient(135deg, #cc0000, #8b0000)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}<span style={{ fontSize: '0.5em', WebkitTextFillColor: 'transparent' }}>{stat.suffix}</span>
                </span>
                <span
                  className="text-[#0C0C0C] font-light uppercase tracking-widest"
                  style={{ fontSize: '0.6rem', opacity: 0.5 }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
