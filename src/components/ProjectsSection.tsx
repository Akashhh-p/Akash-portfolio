import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';
import GhostButton from './GhostButton';

const PROJECTS = [
  {
    num: '01',
    name: 'Motion Guard AI',
    category: 'Computer Vision / Personal Project',
    description: 'Real-time surveillance with OpenCV & YOLOv8 -- automated motion detection, multi-object tracking, and low-latency video analytics.',
    github: 'https://github.com/Akashhh-p',
    accent: 'rgba(200,0,0,0.5)',
    images: {
      col1a: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
      col1b: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      col2: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  },
  {
    num: '02',
    name: 'Multimodal Emotion Recognition',
    category: 'NLP / Computer Vision / Personal Project',
    description: 'Fuses BERT text (90%), audio transformer (82%), and CNN/ViT vision (88%) into a unified pipeline achieving 87% accuracy at 15-20 FPS.',
    github: 'https://github.com/Akashhh-p',
    accent: 'rgba(180,0,0,0.4)',
    images: {
      col1a: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
      col1b: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
      col2: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  },
  {
    num: '03',
    name: 'AwakeMate',
    category: 'Applied AI / Internship -- Oceanautics',
    description: 'Oceanautics internship project: an AI wellness platform analyzing behavioral and sleep patterns to deliver personalized recommendations for marine robotics workflows.',
    github: 'https://github.com/Akashhh-p',
    accent: 'rgba(160,0,0,0.35)',
    images: {
      col1a: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800',
      col1b: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
      col2: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  },
];

const TOTAL = PROJECTS.length;

interface ProjectCardProps {
  project: (typeof PROJECTS)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function ProjectCard({ project, index, scrollYProgress }: ProjectCardProps) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03;
  const scale = useTransform(
    scrollYProgress,
    [index / TOTAL, (index + 1) / TOTAL],
    [1, targetScale]
  );

  const br = 'clamp(30px, 4vw, 55px)';

  return (
    <div className="h-[85vh] flex items-start" style={{ paddingTop: `${index * 28}px` }}>
      <motion.div
        className="sticky top-24 md:top-32 w-full p-4 sm:p-6 md:p-8"
        style={{
          scale,
          borderRadius: br,
          background: '#120000',
          transformOrigin: 'top center',
          border: '1px solid rgba(200,50,50,0.25)',
          boxShadow: `0 0 60px ${project.accent}, inset 0 0 30px rgba(100,0,0,0.15)`,
        }}
      >
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-baseline gap-4 md:gap-6 flex-wrap flex-1 min-w-0">
            <span
              className="font-black leading-none flex-shrink-0"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 100px)',
                background: 'linear-gradient(180deg, #8b3a3a 0%, #ff4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.num}
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span
                className="text-[#D7E2EA] font-light uppercase tracking-wider opacity-50"
                style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.85rem)' }}
              >
                {project.category}
              </span>
              <span
                className="text-[#D7E2EA] font-medium uppercase leading-tight"
                style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.8rem)' }}
              >
                {project.name}
              </span>
              <span
                className="text-[#D7E2EA] font-light leading-relaxed opacity-50 hidden md:block"
                style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', maxWidth: '40ch' }}
              >
                {project.description}
              </span>
            </div>
          </div>
          <GhostButton href={project.github} label="View on GitHub" target="_blank" />
        </div>

        {/* Image grid */}
        <div className="flex gap-3 md:gap-4">
          {/* Left column — 40% */}
          <div className="flex flex-col gap-3 md:gap-4" style={{ width: '40%' }}>
            <img
              src={project.images.col1a}
              alt={project.name}
              loading="lazy"
              className="w-full object-cover"
              style={{ height: 'clamp(130px, 16vw, 230px)', borderRadius: br }}
            />
            <img
              src={project.images.col1b}
              alt={project.name}
              loading="lazy"
              className="w-full object-cover"
              style={{ height: 'clamp(160px, 22vw, 340px)', borderRadius: br }}
            />
          </div>
          {/* Right column — 60% */}
          <div style={{ width: '60%' }}>
            <img
              src={project.images.col2}
              alt={project.name}
              loading="lazy"
              className="w-full object-cover"
              style={{ height: 'clamp(300px, 40vw, 590px)', borderRadius: br }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 relative z-10
        px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-10"
      style={{ background: '#1a0000' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.num}
            project={project}
            index={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
