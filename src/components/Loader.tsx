import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#1a0000',
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Animated ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            style={{ position: 'relative', width: 80, height: 80 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#ff3333',
                borderRightColor: '#cc0000',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 8,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,0,0,0.3), transparent)',
              }}
            />
          </motion.div>

          {/* Name reveal */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              color: '#D7E2EA',
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 300,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
            }}
          >
            Akash Pentakota
          </motion.p>

          {/* Progress bar */}
          <div
            style={{
              width: 120,
              height: 1,
              background: 'rgba(215,226,234,0.15)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #8b0000, #ff3333)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
