import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import {
  ACHIEVEMENTS,
  CORE_SECTION_IDS,
  PROGRESS_EVENT,
  addXp,
  getLevel,
  markSectionVisited,
  readProgress,
  setMuted,
  unlockAchievement,
  updateProgress,
  type AchievementId,
  type GameProgress,
} from '../lib/gamification';

const EASTER_EGGS = [
  { id: 'bug', label: '🐞', top: '18%', left: '6%' },
  { id: 'code', label: '💻', top: '38%', right: '5%' },
  { id: 'coffee', label: '☕', top: '58%', left: '4%' },
  { id: 'rocket', label: '🚀', bottom: '18%', right: '7%' },
  { id: 'bolt', label: '⚡', bottom: '7%', left: '12%' },
];

function playTone(enabled: boolean, frequency = 660) {
  if (!enabled) return;
  const AudioContextClass: typeof window.AudioContext | undefined =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
}

function AchievementToast({ achievement }: { achievement: AchievementId | null }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.94 }}
          className="fixed right-5 top-24 z-[9998] max-w-xs rounded-2xl px-4 py-3 text-[#D7E2EA]"
          style={{
            background: 'rgba(18,0,0,0.92)',
            border: '1px solid rgba(255,180,180,0.22)',
            boxShadow: '0 18px 45px rgba(0,0,0,0.32)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="font-medium uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>
            Achievement Unlocked
          </p>
          <p className="mt-1 font-bold">{ACHIEVEMENTS[achievement].name}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function XpHud({ progress, onToggleMute }: { progress: GameProgress; onToggleMute: () => void }) {
  const level = getLevel(progress.xp);
  const percent = (level.currentLevelXp / level.nextLevelXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-[9997] flex items-center gap-3 rounded-2xl px-4 py-3 text-[#D7E2EA] md:bottom-6 md:right-6"
      style={{
        background: 'rgba(18,0,0,0.74)',
        border: '1px solid rgba(255,180,180,0.18)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.24)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="min-w-[138px]">
        <p className="font-medium uppercase tracking-widest" style={{ fontSize: '0.58rem' }}>
          Level {level.level} Developer
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(215,226,234,0.12)' }}>
          <motion.div
            className="h-full"
            animate={{ width: `${percent}%` }}
            style={{ background: 'linear-gradient(90deg, #ff3333, #ffb84d)' }}
          />
        </div>
        <p className="mt-1 font-light" style={{ fontSize: '0.62rem', opacity: 0.55 }}>
          {level.currentLevelXp}/{level.nextLevelXp} XP
        </p>
      </div>
      <button
        onClick={onToggleMute}
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: 'rgba(215,226,234,0.08)', border: '1px solid rgba(215,226,234,0.12)' }}
        aria-label={progress.muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {progress.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </motion.div>
  );
}

function EasterEggs({ progress }: { progress: GameProgress }) {
  const found = useMemo(() => new Set(progress.easterEggs), [progress.easterEggs]);
  const allFound = found.size >= EASTER_EGGS.length;

  const collect = (id: string) => {
    if (found.has(id)) return;
    playTone(!progress.muted, 840);
    const nextCount = found.size + 1;
    addXp(100);
    updateProgress((current) => ({
      ...current,
      easterEggs: current.easterEggs.includes(id) ? current.easterEggs : [...current.easterEggs, id],
    }));
    if (nextCount >= EASTER_EGGS.length) unlockAchievement('secret-finder');
  };

  return (
    <>
      {EASTER_EGGS.map((egg) => (
        <motion.button
          key={egg.id}
          onClick={() => collect(egg.id)}
          initial={{ opacity: 0.18, scale: 0.88 }}
          animate={{ opacity: found.has(egg.id) ? 0 : 0.42, scale: [0.88, 1, 0.88] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="fixed z-[60] flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{
            ...egg,
            pointerEvents: found.has(egg.id) ? 'none' : 'auto',
            background: 'rgba(215,226,234,0.045)',
            border: '1px solid rgba(215,226,234,0.08)',
            filter: found.has(egg.id) ? 'blur(5px)' : 'none',
          }}
          aria-label={`Find hidden ${egg.id}`}
        >
          {egg.label}
        </motion.button>
      ))}

      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 z-[9998] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl p-5 text-center text-[#D7E2EA]"
            style={{
              background: 'rgba(18,0,0,0.94)',
              border: '1px solid rgba(255,180,180,0.22)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            <p className="font-black uppercase tracking-tight" style={{ fontSize: '1.3rem' }}>
              Secret Unlocked!
            </p>
            <p className="mt-2 font-light" style={{ opacity: 0.62 }}>
              You explored everything. Resume unlocked below.
            </p>
            <a
              href="/Akash_finalresume_2026.pdf"
              onClick={() => addXp(25)}
              className="mt-4 inline-flex rounded-full px-5 py-3 font-medium uppercase tracking-widest text-white"
              style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #cc0000, #7a0000, #ff4500)' }}
            >
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GamificationLayer() {
  const [progress, setProgress] = useState<GameProgress>(() => readProgress());
  const [toast, setToast] = useState<AchievementId | null>(null);

  useEffect(() => {
    let previous = new Set(progress.achievements);
    const onProgress = () => {
      const next = readProgress();
      const unlocked = next.achievements.find((achievement) => !previous.has(achievement));
      previous = new Set(next.achievements);
      setProgress(next);
      if (unlocked) {
        setToast(unlocked);
        playTone(!next.muted, 1040);
        window.setTimeout(() => setToast(null), 2400);
      }
    };

    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, [progress.achievements]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) markSectionVisited(entry.target.id);
        });
      },
      { threshold: 0.34 }
    );

    CORE_SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('#work a')) addXp(20);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <XpHud
        progress={progress}
        onToggleMute={() => {
          setMuted(!progress.muted);
          playTone(progress.muted, 600);
        }}
      />
      <EasterEggs progress={progress} />
      <AchievementToast achievement={toast} />
    </>
  );
}
