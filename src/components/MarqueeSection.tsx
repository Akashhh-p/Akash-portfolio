import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ROW1_IMAGES = [
  { src: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Deep Learning' },
  { src: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Multimodal AI' },
  { src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Machine Learning' },
  { src: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Neural Networks' },
  { src: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Computer Vision' },
  { src: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Transformers' },
  { src: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Data Science' },
  { src: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'AI Pipelines' },
  { src: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Analytics' },
  { src: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Python Data Stack' },
];

const ROW2_IMAGES = [
  { src: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'YOLOv8 Detection' },
  { src: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'AI Research' },
  { src: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Motion Tracking' },
  { src: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Data Visualization' },
  { src: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'NLP Models' },
  { src: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Model Code' },
  { src: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'PyTorch' },
  { src: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Data Engineering' },
  { src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Python Systems' },
  { src: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'GitHub Workflow' },
];

// Hybrid: scroll-based offset + CSS for smoothness
interface RowProps {
  images: typeof ROW1_IMAGES;
  offset: number;
  direction: 'left' | 'right';
}

function MarqueeRow({ images, offset, direction }: RowProps) {
  const tripled = [...images, ...images, ...images];
  const translateX = direction === 'right' ? offset - 200 : -(offset - 200);

  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(${translateX}px)`,
          willChange: 'transform',
          width: 'max-content',
          transition: 'transform 0.05s linear',
        }}
      >
        {tripled.map((img, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden relative group"
            whileHover={{ y: -10, rotateX: 5, rotateY: direction === 'right' ? -7 : 7, scale: 1.02 }}
            transition={{ duration: 0.28 }}
            style={{
              width: 420,
              height: 270,
              transformStyle: 'preserve-3d',
              boxShadow: '0 26px 70px rgba(0,0,0,0.24)',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(26,0,0,0.32), rgba(180,0,0,0.16) 50%, rgba(0,0,0,0.5))',
              }}
            />
            <motion.div
              aria-hidden="true"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 14 + (i % 4), repeat: Infinity, ease: 'linear' }}
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-70"
              style={{
                border: '1px solid rgba(255,180,180,0.28)',
                boxShadow: 'inset 0 0 30px rgba(255,80,80,0.15)',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute left-6 top-6 h-16 w-28"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,180,180,0.45) 1px, transparent 1px), linear-gradient(rgba(255,180,180,0.25) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                maskImage: 'linear-gradient(90deg, #000, transparent)',
                opacity: 0.65,
              }}
            />
            <div
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{
                background: 'rgba(20,0,0,0.64)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                transform: 'translateZ(34px)',
              }}
            >
              <span className="text-white font-medium uppercase tracking-widest text-xs">
                {img.alt}
              </span>
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: '#ff4d4d', boxShadow: '0 0 14px rgba(255,77,77,0.9)' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(200);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const newOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(newOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: 'transparent' }}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden relative z-10"
    >
      {/* Section label */}
      <div className="flex items-center gap-4 px-6 md:px-10 mb-10">
        <div style={{ width: 32, height: 1, background: 'rgba(215,226,234,0.3)' }} />
        <span className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-40"
          style={{ fontSize: '0.65rem' }}>
          Tech Stack &amp; Projects
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow images={ROW1_IMAGES} offset={offset} direction="right" />
        <MarqueeRow images={ROW2_IMAGES} offset={offset} direction="left" />
      </div>
    </section>
  );
}
