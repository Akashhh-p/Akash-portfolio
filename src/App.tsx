import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Cursor from './components/Cursor';
import GrainOverlay from './components/GrainOverlay';
import BackgroundOrbs from './components/BackgroundOrbs';
import Loader from './components/Loader';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import WorkSection from './components/WorkSection';
import AIMiniGameSection from './components/AIMiniGameSection';
import AboutSection from './components/AboutSection';
import CertificationsSection from './components/CertificationsSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import GamificationLayer from './components/GamificationLayer';

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      id="scroll-progress"
      style={{ scaleX, width: '100%' }}
    />
  );
}

export default function App() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  return (
    <>
      <Loader />
      <Cursor />
      <GrainOverlay />
      <BackgroundOrbs />
      <ScrollProgressBar />
      <GamificationLayer />
      <Header />

      <div
        style={{
          background: '#1a0000',
          overflowX: 'clip',
          fontFamily: "'Kanit', sans-serif",
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Padded for fixed header */}
        <div style={{ paddingTop: 0 }}>
          <HeroSection />
        </div>

        <MarqueeSection />

        <div style={{ background: '#1a0000' }}>
          <AboutSection />
        </div>

        <WorkSection />

        <div style={{ background: '#1a0000' }}>
          <SkillsSection />
          <CertificationsSection />
        </div>

        <AIMiniGameSection />
        <ContactSection />
      </div>
    </>
  );
}
