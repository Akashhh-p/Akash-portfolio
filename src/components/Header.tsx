import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NAV = [
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'work' },
  { label: 'Skills', id: 'skills' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Play', id: 'play' },
  { label: 'Contact', id: 'contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-14"
      style={{
        paddingTop: scrolled ? '1rem' : '1.5rem',
        paddingBottom: scrolled ? '1rem' : '1.5rem',
        background: scrolled ? 'rgba(26,0,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <nav className="flex items-center justify-between">
        {/* Logo / Name */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex flex-col items-start gap-0 group"
          style={{ background: 'none', border: 'none' }}
        >
          <span
            className="text-[#D7E2EA] font-black uppercase tracking-tight leading-none
              group-hover:opacity-70 transition-opacity duration-200"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)' }}
          >
            Akash Pentakota
          </span>
          <span
            className="font-light uppercase tracking-widest"
            style={{ fontSize: '0.55rem', color: 'rgba(215,226,234,0.4)' }}
          >
            AI &amp; ML Engineer
          </span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-12">
          {NAV.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className="flex items-center gap-2 group"
                style={{ background: 'none', border: 'none' }}
              >
                <span
                  className="font-light text-[#D7E2EA] opacity-30 group-hover:opacity-100
                    transition-opacity duration-200"
                  style={{ fontSize: '0.6rem' }}
                >
                  0{i + 1}
                </span>
                <span
                  className="text-[#D7E2EA] font-medium uppercase tracking-widest
                    group-hover:opacity-70 transition-opacity duration-200"
                  style={{ fontSize: 'clamp(0.7rem, 1vw, 0.85rem)' }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
          <li>
            <a
              href="mailto:akashp3620@gmail.com"
              className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] font-medium
                uppercase tracking-widest px-5 py-2 hover:bg-[#D7E2EA]/10
                transition-colors duration-200"
              style={{ fontSize: '0.7rem' }}
            >
              Hire Me
            </a>
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none' }}
          aria-label="Menu"
        >
          <span
            className="block h-px bg-[#D7E2EA] transition-all duration-300"
            style={{
              width: 24,
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-px bg-[#D7E2EA] transition-all duration-300"
            style={{ width: 16, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-px bg-[#D7E2EA] transition-all duration-300"
            style={{
              width: 24,
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden pt-6 pb-4 flex flex-col gap-5"
          style={{ borderTop: '1px solid rgba(215,226,234,0.1)', marginTop: '1rem' }}
        >
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-[#D7E2EA] font-medium uppercase tracking-widest
                hover:opacity-70 transition-opacity duration-200"
              style={{ fontSize: '1rem', background: 'none', border: 'none' }}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
