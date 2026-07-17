import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const SKILL_CATEGORIES = [
  {
    num: '01',
    title: 'Machine Learning',
    tools: ['Scikit-learn', 'PyTorch', 'NumPy', 'Pandas', 'Jupyter'],
    description: 'Building ML workflows for classification, prediction, behavioral analysis, and data-driven recommendations across portfolio projects.',
  },
  {
    num: '02',
    title: 'Computer Vision',
    tools: ['OpenCV', 'YOLOv8', 'Eye Tracking', 'Image Processing', 'Webcam AI'],
    description: 'Real-time object detection, motion tracking, drowsiness detection, and camera-based monitoring systems optimized for low-latency inference.',
  },
  {
    num: '03',
    title: 'Gen AI & NLP',
    tools: ['Transformers', 'BERT', 'LLM Apps', 'Chatbots', 'Prompting'],
    description: 'Designing conversational AI systems including student assistants, health assistants, visual search experiences, and natural-language app generation workflows.',
  },
  {
    num: '04',
    title: 'Audio & Multimodal AI',
    tools: ['Transcription', 'Speaker Diarization', 'Audio AI', 'Vision + Text', 'Q&A'],
    description: 'Combining audio, text, and vision for emotion recognition and local meeting intelligence with transcription, speaker separation, and contextual Q&A.',
  },
  {
    num: '05',
    title: 'Engineering Stack',
    tools: ['Python', 'TypeScript', 'JavaScript', 'React', 'SQL', 'GitHub'],
    description: 'Building end-to-end AI products with Python backends, TypeScript/React interfaces, version-controlled workflows, and deployable project structure.',
  },
];

interface SkillRowProps {
  category: (typeof SKILL_CATEGORIES)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function SkillRow({ category, index, isOpen, onToggle }: SkillRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 md:py-8 text-left group"
        style={{ background: 'none', border: 'none' }}
      >
        <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
          <span
            className="font-light text-[#0C0C0C] flex-shrink-0"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', opacity: 0.3, width: '3ch' }}
          >
            {category.num}
          </span>
          <span
            className="font-black uppercase text-[#0C0C0C] leading-none
              group-hover:text-[#cc0000] transition-colors duration-300"
            style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2.8rem)' }}
          >
            {category.title}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {!isOpen && category.tools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              className="font-light uppercase tracking-widest"
              style={{
                fontSize: '0.55rem',
                color: '#cc0000',
                background: 'rgba(180,0,0,0.08)',
                padding: '3px 9px',
                borderRadius: 99,
                border: '1px solid rgba(180,0,0,0.2)',
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(12,12,12,0.2)',
            fontSize: '1rem',
            color: '#0C0C0C',
            fontWeight: 300,
          }}
        >
          +
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div className="pb-8 pl-0 sm:pl-[calc(3ch+1.5rem)] md:pl-[calc(3ch+2.5rem)]">
          <p
            className="text-[#0C0C0C] font-light leading-relaxed mb-5"
            style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)', opacity: 0.6, maxWidth: '60ch' }}
          >
            {category.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.tools.map((tool) => (
              <span
                key={tool}
                className="font-medium uppercase tracking-widest"
                style={{
                  fontSize: '0.6rem',
                  color: '#cc0000',
                  background: 'rgba(180,0,0,0.08)',
                  padding: '5px 12px',
                  borderRadius: 99,
                  border: '1px solid rgba(180,0,0,0.25)',
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="skills"
      ref={ref}
      className="px-6 md:px-10 lg:px-14 py-24 md:py-32 relative z-10"
      style={{
        background: '#fff',
        borderTop: '1px solid rgba(12,12,12,0.06)',
      }}
    >
      <div className="flex items-end justify-between mb-16 md:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-black uppercase leading-none tracking-tight text-[#0C0C0C]"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}
        >
          My<br />Skills
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="hidden sm:block text-[#0C0C0C] font-light text-right"
          style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', opacity: 0.45, maxWidth: '22ch', lineHeight: 1.6 }}
        >
          5 core domains powering my AI/ML engineering work
        </motion.p>
      </div>

      <div>
        {SKILL_CATEGORIES.map((cat, i) => (
          <SkillRow
            key={cat.num}
            category={cat}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
        <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }} />
      </div>
    </section>
  );
}
