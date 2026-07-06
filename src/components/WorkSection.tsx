import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye } from 'lucide-react';
import { logProjectView, getProjectViewCounts } from '../lib/supabase';

const PROJECTS = [
  {
    slug: 'motion-guard-ai',
    num: '01',
    name: 'Motion Guard AI',
    category: 'Computer Vision',
    year: '2025',
    tags: ['Python', 'OpenCV', 'YOLOv8'],
    description: 'Real-time surveillance platform with automated motion detection, multi-object tracking, and scalable video analytics pipelines optimized for low-latency inference.',
    github: 'https://github.com/Akashhh-p',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'multimodal-emotion-recognition',
    num: '02',
    name: 'Multimodal Emotion Recognition',
    category: 'NLP / Computer Vision',
    year: '2025',
    tags: ['BERT', 'Transformers', 'CNN/ViT'],
    description: 'Fuses text (90%), audio (82%), and vision (88%) modalities into a single pipeline achieving 87% accuracy at 15-20 FPS with sub-300ms latency.',
    github: 'https://github.com/Akashhh-p',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'awakemate',
    num: '03',
    name: 'AwakeMate',
    category: 'Applied AI',
    year: '2026',
    tags: ['ML', 'NumPy', 'Pandas'],
    description: 'Oceanautics internship project: built AwakeMate, an AI wellness monitoring platform analyzing behavioral and sleep patterns to deliver personalized recommendations for marine robotics workflows.',
    github: 'https://github.com/Akashhh-p',
    image: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

interface ProjectRowProps {
  project: (typeof PROJECTS)[0];
  index: number;
  viewCount: number;
  onView: (slug: string, name: string) => void;
}

function ProjectRow({ project, index, viewCount, onView }: ProjectRowProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: '-60px' });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleClick = () => {
    onView(project.slug, project.name);
  };

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{ borderTop: '1px solid rgba(215,226,234,0.1)', overflow: 'visible' }}
    >
      {/* Hover image preview */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.92,
          x: mousePos.x - 160,
          y: mousePos.y - 100,
        }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { duration: 0.3 },
          x: { duration: 0.12, ease: 'linear' },
          y: { duration: 0.12, ease: 'linear' },
        }}
        className="absolute z-30 pointer-events-none rounded-2xl overflow-hidden"
        style={{ width: 320, height: 200, top: 0, left: 0 }}
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,0,0,0.55), rgba(180,0,0,0.14), transparent)' }} />
        <motion.div
          aria-hidden="true"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full"
          style={{
            border: '1px solid rgba(255,180,180,0.3)',
            boxShadow: 'inset 0 0 28px rgba(255,80,80,0.16)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-4 bottom-4 h-12 w-24"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,180,180,0.44) 1px, transparent 1px), linear-gradient(rgba(255,180,180,0.22) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            maskImage: 'linear-gradient(90deg, #000, transparent)',
          }}
        />
      </motion.div>

      {/* Row content */}
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-between gap-4 py-6 md:py-8 lg:py-10 px-0 group"
        style={{ textDecoration: 'none', display: 'flex' }}
      >
        {/* Number */}
        <span
          className="font-light text-[#D7E2EA] flex-shrink-0 hidden sm:block"
          style={{ fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', opacity: 0.35, width: '3ch' }}
        >
          {project.num}
        </span>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <motion.p
            animate={{ x: hovered ? 8 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#D7E2EA] font-black uppercase leading-none"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 3.5rem)' }}
          >
            {project.name}
          </motion.p>
        </div>

        {/* Meta */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="text-[#D7E2EA] font-light uppercase tracking-widest"
            style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)', opacity: 0.4 }}
          >
            {project.category}
          </span>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-light uppercase tracking-widest hidden md:block"
                style={{
                  fontSize: '0.55rem',
                  color: '#cc2222',
                  background: 'rgba(180,0,0,0.15)',
                  padding: '2px 8px',
                  borderRadius: 99,
                  border: '1px solid rgba(180,0,0,0.3)',
                }}
              >
                {tag}
              </span>
            ))}
            <span
              className="text-[#D7E2EA] font-light"
              style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)', opacity: 0.35 }}
            >
              {project.year}
            </span>
          </div>
          {/* View count badge */}
          {viewCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
              style={{
                fontSize: '0.55rem',
                color: 'rgba(215,226,234,0.4)',
                background: 'rgba(215,226,234,0.06)',
                padding: '2px 7px',
                borderRadius: 99,
                border: '1px solid rgba(215,226,234,0.1)',
              }}
            >
              <Eye size={9} />
              {viewCount.toLocaleString()} view{viewCount !== 1 ? 's' : ''}
            </motion.div>
          )}
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 hidden sm:flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(215,226,234,0.3)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#D7E2EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </a>
    </motion.div>
  );
}

export default function WorkSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });

  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getProjectViewCounts()
      .then(setViewCounts)
      .catch(() => {/* non-critical — silently ignore */});
  }, []);

  const handleView = useCallback(async (slug: string, name: string) => {
    try {
      await logProjectView(slug, name);
      setViewCounts((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 }));
    } catch {
      // non-critical analytics — fail silently
    }
  }, []);

  return (
    <section
      id="work"
      className="px-6 md:px-10 lg:px-14 py-24 md:py-32 relative z-10"
      style={{ background: '#1a0000' }}
    >
      {/* Section header */}
      <div ref={headingRef} className="flex items-end justify-between mb-16 md:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}
        >
          Selected<br />Work
        </motion.h2>
        <motion.a
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          href="https://github.com/Akashhh-p"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-[#D7E2EA] rounded-full border
            border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 transition-colors duration-200
            px-6 py-3 font-medium uppercase tracking-widest"
          style={{ fontSize: '0.7rem' }}
        >
          View All
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="#D7E2EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      {/* Project rows */}
      <div>
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            viewCount={viewCounts[project.slug] ?? 0}
            onView={handleView}
          />
        ))}
        <div style={{ borderTop: '1px solid rgba(215,226,234,0.1)' }} />
      </div>
    </section>
  );
}
