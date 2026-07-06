import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Bug, Play, RotateCcw, X } from 'lucide-react';
import ThreeDSphere from './ThreeDSphere';
import { addXp, readProgress, updateProgress } from '../lib/gamification';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

type BugTarget = {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'normal' | 'speed' | 'freeze' | 'gold' | 'life';
};

const BUG_TIME = 30;

function tone(frequency: number) {
  if (readProgress().muted) return;
  const AudioContextClass: typeof window.AudioContext | undefined =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.14);
}

function getRank(score: number) {
  if (score >= 55) return 'Principal Debugger';
  if (score >= 35) return 'Senior Debugger';
  if (score >= 20) return 'Bug Hunter';
  return 'Junior Fixer';
}

function makeBug(elapsed: number): BugTarget {
  const roll = Math.random();
  const type: BugTarget['type'] =
    elapsed > 20 && roll > 0.9 ? 'gold' :
      roll > 0.82 ? 'freeze' :
        roll > 0.72 ? 'speed' :
          roll > 0.64 ? 'life' :
            'normal';

  return {
    id: Date.now() + Math.random(),
    x: 8 + Math.random() * 84,
    y: 12 + Math.random() * 74,
    size: elapsed > 20 && type === 'normal' ? 26 + Math.random() * 12 : 34 + Math.random() * 18,
    type,
  };
}

function CatchBugModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BUG_TIME);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bugs, setBugs] = useState<BugTarget[]>([]);
  const [freezeUntil, setFreezeUntil] = useState(0);
  const [boostUntil, setBoostUntil] = useState(0);
  const [finished, setFinished] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);

  const elapsed = BUG_TIME - timeLeft;
  const highScore = readProgress().highScore;
  const frozen = Date.now() < freezeUntil;
  const boosted = Date.now() < boostUntil;

  const reset = useCallback(() => {
    setStarted(true);
    setFinished(false);
    setTimeLeft(BUG_TIME);
    setScore(0);
    setLives(3);
    setBugs([]);
    setFreezeUntil(0);
    setBoostUntil(0);
    setEndTime(Date.now() + BUG_TIME * 1000);
    addXp(50);
  }, []);

  useEffect(() => {
    if (!open) return;
    setStarted(false);
    setFinished(false);
    setTimeLeft(BUG_TIME);
    setScore(0);
    setLives(3);
    setBugs([]);
    setEndTime(null);
  }, [open]);

  useEffect(() => {
    if (!started || finished || endTime === null) return;

    const tick = () => {
      const next = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(next);
      if (next === 0) {
        setFinished(true);
      }
    };

    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [endTime, finished, started]);

  useEffect(() => {
    if (!started || finished || timeLeft <= 0) return;
    const spawnDelay = elapsed < 10 ? 900 : elapsed < 20 ? 640 : 430;
    const visibleFor = elapsed < 10 ? 1500 : elapsed < 20 ? 1120 : 850;

    const spawn = window.setInterval(() => {
      const bug = makeBug(elapsed);
      setBugs((current) => [...current.slice(-9), bug]);
      window.setTimeout(() => {
        setBugs((current) => {
          if (!current.some((item) => item.id === bug.id)) return current;
          if (bug.type === 'normal') setLives((value) => Math.max(0, value - 1));
          return current.filter((item) => item.id !== bug.id);
        });
      }, visibleFor);
    }, spawnDelay);

    return () => window.clearInterval(spawn);
  }, [elapsed, finished, started, timeLeft]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft > 0 && lives > 0) return;

    setFinished(true);
    setBugs([]);
    tone(940);
    updateProgress((progress) => ({ ...progress, highScore: Math.max(progress.highScore, score), xp: progress.xp + Math.max(10, score) }));
  }, [finished, lives, score, started, timeLeft]);

  const catchBug = (bug: BugTarget) => {
    setBugs((current) => current.filter((item) => item.id !== bug.id));
    tone(bug.type === 'gold' ? 1040 : 620);

    if (bug.type === 'freeze') {
      setFreezeUntil(Date.now() + 2000);
      setScore((value) => value + 1);
      return;
    }

    if (bug.type === 'speed') {
      setBoostUntil(Date.now() + 3000);
      setScore((value) => value + 2);
      return;
    }

    if (bug.type === 'life') {
      setLives((value) => Math.min(5, value + 1));
      setScore((value) => value + 1);
      return;
    }

    setScore((value) => value + (bug.type === 'gold' ? 10 : boosted ? 2 : 1));
  };

  const subtitle = useMemo(() => {
    if (finished) return `Rank: ${getRank(score)}. Think you can beat this? Explore my projects below.`;
    if (!started) return 'Cute bugs appear at random. Tap them before they disappear.';
    if (elapsed < 10) return 'Warm-up: slow bugs.';
    if (elapsed < 20) return 'Ramp-up: faster bugs.';
    return 'Final sprint: tiny bugs and bonus bugs.';
  }, [elapsed, finished, score, started]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8"
          style={{ background: 'rgba(8,0,0,0.76)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl"
            style={{
              background: 'radial-gradient(circle at 22% 8%, rgba(204,0,0,0.32), transparent 34%), #100000',
              border: '1px solid rgba(215,226,234,0.14)',
              boxShadow: '0 34px 90px rgba(0,0,0,0.45)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full text-[#D7E2EA]"
              style={{ background: 'rgba(215,226,234,0.08)', border: '1px solid rgba(215,226,234,0.12)' }}
              aria-label="Close challenge"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
              <div>
                <p className="text-[#D7E2EA] font-black uppercase tracking-tight" style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)' }}>
                  Catch the Bug
                </p>
                <p className="text-[#D7E2EA] font-light" style={{ opacity: 0.56 }}>
                  {subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[#D7E2EA]">
                {[
                  ['Score', score],
                  ['Time', `${timeLeft}s`],
                  ['Lives', '❤️'.repeat(lives)],
                  ['Best', Math.max(highScore, score)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl px-3 py-2 text-right" style={{ background: 'rgba(215,226,234,0.07)', border: '1px solid rgba(215,226,234,0.1)' }}>
                    <p className="font-light uppercase tracking-widest" style={{ fontSize: '0.5rem', opacity: 0.45 }}>{label}</p>
                    <p className="font-bold" style={{ fontSize: '0.85rem' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-4 mb-4 h-[430px] overflow-hidden rounded-2xl md:mx-6" style={{ background: 'rgba(215,226,234,0.035)' }}>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,180,180,0.07) 1px, transparent 1px), linear-gradient(rgba(255,180,180,0.05) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                  pointerEvents: 'none',
                }}
              />
              {Array.from({ length: 18 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute h-1 w-1 rounded-full bg-[#D7E2EA]"
                  animate={{ y: [0, -24, 0], opacity: [0.18, 0.55, 0.18] }}
                  transition={{ duration: 2.2 + index * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ left: `${(index * 17) % 96}%`, top: `${(index * 31) % 90}%` }}
                />
              ))}

              {bugs.map((bug) => {
                const label = bug.type === 'gold' ? '💎' : bug.type === 'freeze' ? '⏰' : bug.type === 'speed' ? '⚡' : bug.type === 'life' ? '❤️' : null;
                const bg = bug.type === 'gold'
                  ? 'linear-gradient(135deg, #ffe680, #ff9f1a)'
                  : bug.type === 'freeze'
                    ? 'linear-gradient(135deg, #7cc7ff, #1f7cff)'
                    : bug.type === 'speed'
                      ? 'linear-gradient(135deg, #ffdf6e, #ff4500)'
                      : bug.type === 'life'
                        ? 'linear-gradient(135deg, #ff9bb3, #cc0040)'
                        : 'linear-gradient(135deg, #ff6b6b, #cc0000)';

                return (
                  <motion.button
                    key={bug.id}
                    onClick={() => catchBug(bug)}
                    initial={{ scale: 0, rotate: -18 }}
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.65, repeat: Infinity }}
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      width: bug.size,
                      height: bug.size,
                      transform: 'translate(-50%, -50%)',
                      background: bg,
                      border: '1px solid rgba(255,220,220,0.5)',
                      boxShadow: '0 0 28px rgba(255,80,80,0.45)',
                      zIndex: 5,
                    }}
                    aria-label={`Catch ${bug.type} bug`}
                  >
                    {label ?? <Bug size={Math.max(16, bug.size * 0.48)} color="#fff" />}
                    {label && <span style={{ fontSize: bug.size * 0.45 }}>{label}</span>}
                  </motion.button>
                );
              })}

              {(!started || finished) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center" style={{ background: 'rgba(16,0,0,0.64)' }}>
                  {finished && Array.from({ length: 28 }).map((_, index) => (
                    <motion.span
                      key={index}
                      className="absolute h-2 w-2 rounded-sm"
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos(index) * (90 + index * 4),
                        y: Math.sin(index * 1.7) * (80 + index * 3),
                        rotate: 280 + index * 18,
                        opacity: 0,
                      }}
                      transition={{ duration: 1.35, ease: 'easeOut' }}
                      style={{
                        left: '50%',
                        top: '42%',
                        background: index % 3 === 0 ? '#ffb84d' : index % 3 === 1 ? '#ff3333' : '#7cc7ff',
                      }}
                    />
                  ))}
                  <div>
                    <p className="text-[#D7E2EA] font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                      {finished ? `Bugs Fixed: ${score}` : '30s Challenge'}
                    </p>
                    <p className="mx-auto mt-3 max-w-lg text-[#D7E2EA] font-light" style={{ opacity: 0.62 }}>
                      {finished ? subtitle : 'Power-ups: speed boost, freeze time, golden bug, and extra life.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-wrap justify-center gap-3 px-5 pb-6">
              <button
                onClick={reset}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
                style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #cc0000, #7a0000, #ff4500)' }}
              >
                {started ? <RotateCcw size={18} /> : <Play size={18} />}
                {started ? 'Restart' : 'Start Game'}
              </button>
              {finished && (
                <button
                  onClick={() => {
                    onClose();
                    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 font-medium uppercase tracking-widest text-[#D7E2EA]"
                  style={{ fontSize: '0.65rem', borderColor: 'rgba(215,226,234,0.18)', background: 'rgba(215,226,234,0.06)' }}
                >
                  Explore Projects
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeroSection() {
  const [gameOpen, setGameOpen] = useState(false);

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

          <motion.button
            variants={item}
            onClick={() => setGameOpen(true)}
            className="inline-flex w-fit items-center gap-3 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
            style={{
              fontSize: '0.7rem',
              background: 'linear-gradient(123deg, #cc0000 0%, #7a0000 72%, #ff4500 100%)',
              boxShadow: '0 14px 35px rgba(200,0,0,0.28)',
            }}
          >
            <Play size={16} />
            Play a 30s Challenge
          </motion.button>

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
      <CatchBugModal open={gameOpen} onClose={() => setGameOpen(false)} />
    </section>
  );
}
