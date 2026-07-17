import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

const CERTIFICATIONS = [
  {
    title: 'Generative AI & Artificial Intelligence',
    issuer: 'Shared on LinkedIn',
    date: 'Jun 2026',
    focus: 'Generative AI concepts, applied artificial intelligence workflows, and modern AI use cases.',
    url: 'https://www.linkedin.com/posts/akash-pentakota_generativeai-artificialintelligence-ai-share-7473260064603287553-UUOD/',
  },
  {
    title: 'Gen AI Powered Data Analytics',
    issuer: 'Shared on LinkedIn',
    date: 'Feb 2026',
    focus: 'Using generative AI to accelerate data analysis, insight generation, and analytics workflows.',
    url: 'https://www.linkedin.com/posts/akash-pentakota_gen-ai-powered-data-analytics-ugcPost-7428363491993890816-1vId/',
  },
  {
    title: 'Deloitte Certificate of Completion',
    issuer: 'Shared on LinkedIn',
    date: 'Dec 2025',
    focus: 'Completed professional learning and shared the credential through LinkedIn.',
    url: 'https://www.linkedin.com/posts/akash-pentakota_certificate-of-completion-ugcPost-7404492067172683777-PAQ-/',
  },
  {
    title: 'SimplilearnSkillUp Certification',
    issuer: 'Simplilearn SkillUp',
    date: 'Jan 2025',
    focus: 'SkillUp learning credential focused on practical technology and professional development skills.',
    url: 'https://www.linkedin.com/posts/akash-pentakota_skillup-simplilearn-skillup-share-7281004370601631744-sndV/',
  },
];

export default function CertificationsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="certifications"
      ref={ref}
      className="px-6 md:px-10 lg:px-14 py-20 md:py-28 relative z-10"
      style={{ background: '#fff' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-12 md:mb-16"
      >
        <div style={{ width: 24, height: 1, background: '#0C0C0C', opacity: 0.3 }} />
        <span
          className="font-light uppercase tracking-widest text-[#0C0C0C] opacity-40"
          style={{ fontSize: '0.6rem' }}
        >
          Certifications
        </span>
      </motion.div>

      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
        <div className="lg:sticky lg:top-28">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-black uppercase leading-none tracking-tight text-[#0C0C0C]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
          >
            Verified
            <br />
            Learning.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 18, rotateY: -18 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0, rotateY: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mt-10 h-64 hidden md:block"
            style={{ perspective: 900 }}
          >
            <motion.div
              animate={{ rotateY: [-8, 8, -8], rotateX: [4, -3, 4] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {[0, 1, 2].map((layer) => (
                <div
                  key={layer}
                  className="absolute left-4 right-10 top-6 h-40 rounded-lg"
                  style={{
                    transform: `translate3d(${layer * 18}px, ${layer * 18}px, ${-layer * 34}px) rotateZ(${-4 + layer * 4}deg)`,
                    background: layer === 0
                      ? 'linear-gradient(135deg, #ffffff 0%, #fde8e8 100%)'
                      : 'linear-gradient(135deg, #f7eded 0%, #eadada 100%)',
                    border: '1px solid rgba(180,0,0,0.12)',
                    boxShadow: layer === 0 ? '0 28px 70px rgba(45,0,0,0.16)' : '0 18px 45px rgba(45,0,0,0.1)',
                  }}
                >
                  {layer === 0 && (
                    <div className="h-full p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Award size={30} strokeWidth={1.5} color="#cc0000" />
                        <span
                          className="font-medium uppercase tracking-widest"
                          style={{ fontSize: '0.55rem', color: '#cc0000' }}
                        >
                          Certified
                        </span>
                      </div>
                      <div>
                        <div className="h-2 w-28 rounded-full mb-3" style={{ background: 'rgba(204,0,0,0.2)' }} />
                        <div className="h-2 w-44 rounded-full mb-3" style={{ background: 'rgba(12,12,12,0.12)' }} />
                        <div className="h-2 w-32 rounded-full" style={{ background: 'rgba(12,12,12,0.1)' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <motion.div
                animate={{ y: [-6, 8, -6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-8 top-2 rounded-full px-4 py-2 font-medium uppercase tracking-widest"
                style={{
                  transform: 'translateZ(80px)',
                  fontSize: '0.6rem',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #cc0000, #7a0000)',
                  boxShadow: '0 18px 35px rgba(150,0,0,0.25)',
                }}
              >
                4 Credentials
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid gap-5" style={{ perspective: 1200 }}>
          {CERTIFICATIONS.map((cert, i) => (
            <motion.article
              key={cert.title}
              initial={{ opacity: 0, y: 38, rotateX: 14, z: -80 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0, z: 0 } : {}}
              whileHover={{
                y: -8,
                rotateX: 3,
                rotateY: i % 2 === 0 ? -3 : 3,
                z: 36,
                transition: { duration: 0.25 },
              }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative overflow-hidden p-6 md:p-7 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #f8f1f1 0%, #fff 56%, #f3e6e6 100%)',
                border: '1px solid rgba(180,0,0,0.12)',
                boxShadow: '0 18px 45px rgba(45,0,0,0.08)',
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.div
                aria-hidden="true"
                animate={{ x: ['-120%', '130%'] }}
                transition={{ delay: 1.2 + i * 0.45, duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-24"
                style={{
                  transform: 'skewX(-18deg) translateZ(24px)',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
                }}
              />
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div>
                  <p
                    className="text-[#0C0C0C] font-light uppercase tracking-widest mb-2"
                    style={{ fontSize: '0.6rem', opacity: 0.5 }}
                  >
                    {cert.issuer}
                  </p>
                  <h3 className="text-[#0C0C0C] font-bold" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)' }}>
                    {cert.title}
                  </h3>
                </div>
                <span
                  className="inline-flex w-fit rounded-full px-4 py-2 font-medium uppercase tracking-widest"
                  style={{ fontSize: '0.6rem', color: '#cc0000', background: 'rgba(204,0,0,0.08)' }}
                >
                  {cert.date}
                </span>
              </div>
              <p
                className="text-[#0C0C0C] font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', opacity: 0.68 }}
              >
                {cert.focus}
              </p>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-70"
                style={{ fontSize: '0.65rem', color: '#cc0000' }}
              >
                View Credential
                <ExternalLink size={14} strokeWidth={1.8} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
