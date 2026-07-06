import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BadgeCheck, Bug, Code2, Download, Gamepad2, Puzzle, RotateCcw, Sparkles, Trophy, Zap } from 'lucide-react';
import {
  ACHIEVEMENTS,
  PROGRESS_EVENT,
  RESUME_PATH,
  addXp,
  getLevel,
  readProgress,
  unlockAchievement,
  type GameProgress,
} from '../lib/gamification';

type DebugPrompt = {
  title: string;
  code: string[];
  answer: number;
  fix: string;
};

type GameMode = 'debug' | 'space' | 'puzzle';

type Threat = {
  id: string;
  label: string;
  detail: string;
};

const PROMPTS: DebugPrompt[] = [
  {
    title: 'Wrong Operator',
    code: ['function add(a, b) {', '  return a - b;', '}'],
    answer: 1,
    fix: 'Line 2 should return a + b.',
  },
  {
    title: 'Variable Name',
    code: ['const numbers = [1, 2, 3];', 'console.log(number.length);'],
    answer: 1,
    fix: 'number should be numbers.',
  },
  {
    title: 'React State',
    code: ['const [score, setScore] = useState(0);', 'score = score + 1;', 'setMessage("fixed");'],
    answer: 1,
    fix: 'React state should be updated with setScore.',
  },
  {
    title: 'Async Fetch',
    code: ['async function load() {', '  const res = fetch("/api/projects");', '  return res.json();', '}'],
    answer: 1,
    fix: 'fetch should be awaited before calling json().',
  },
  {
    title: 'SQL Null',
    code: ['SELECT name FROM users', 'WHERE deleted_at = NULL;', 'ORDER BY created_at DESC;'],
    answer: 1,
    fix: 'SQL needs IS NULL instead of = NULL.',
  },
  {
    title: 'Array Bounds',
    code: ['const skills = ["Java", "React", "SQL"];', 'const last = skills[3];', 'console.log(last);'],
    answer: 1,
    fix: 'The last item is skills[2].',
  },
  {
    title: 'Strict Equality',
    code: ['const role = "developer";', 'if (role = "developer") {', '  ship();', '}'],
    answer: 1,
    fix: 'Use === for comparison.',
  },
];

const SPACE_THREATS: Threat[] = [
  { id: 'bug', label: 'Bug', detail: 'Unexpected behavior in the build' },
  { id: 'deadline', label: 'Deadline', detail: 'A launch window is closing fast' },
  { id: 'merge', label: 'Merge Conflict', detail: 'The repo wants to argue' },
  { id: 'null', label: 'NullPointer', detail: 'Someone forgot to initialize confidence' },
  { id: 'prod', label: 'Production Issue', detail: 'The site is on fire' },
  { id: 'slow', label: 'Slow Internet', detail: 'The request is taking forever' },
];

const PUZZLE_PIECES = ['React', 'Node', 'Next.js', 'MongoDB'];
const PUZZLE_ORDER = ['React', 'Node', 'Next.js', 'MongoDB'];

const MODE_OPTIONS: Array<{ id: GameMode; label: string; caption: string; icon: typeof Code2 }> = [
  { id: 'debug', label: 'Debug Lab', caption: 'Fix short bugs with speed and precision.', icon: Code2 },
  { id: 'space', label: 'Space Invaders', caption: 'Protect the portfolio from launch-day chaos.', icon: Gamepad2 },
  { id: 'puzzle', label: 'Stack Puzzle', caption: 'Build the stack and unlock the contact prompt.', icon: Puzzle },
];

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl px-3 py-2 text-right" style={{ background: 'rgba(215,226,234,0.07)', border: '1px solid rgba(215,226,234,0.1)' }}>
      <p className="text-[#D7E2EA] font-light uppercase tracking-widest" style={{ fontSize: '0.5rem', opacity: 0.45 }}>
        {label}
      </p>
      <p className="text-[#D7E2EA] font-bold" style={{ fontSize: '0.9rem' }}>
        {value}
      </p>
    </div>
  );
}

function DebugChallenge() {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Click the buggy line.');
  const [locked, setLocked] = useState(false);
  const [complete, setComplete] = useState(false);
  const prompt = PROMPTS[index];

  useEffect(() => {
    if (locked || complete) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setLocked(true);
          setMessage(`Time. ${prompt.fix}`);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [complete, locked, prompt.fix]);

  const next = () => {
    if (index === PROMPTS.length - 1) {
      setComplete(true);
      addXp(score >= PROMPTS.length - 1 ? 80 : 30);
      if (score >= PROMPTS.length - 1) unlockAchievement('debug-master');
      return;
    }

    setIndex((value) => value + 1);
    setTimeLeft(Math.max(6, 10 - Math.floor((index + 1) / 2)));
    setMessage('Click the buggy line.');
    setLocked(false);
  };

  const reset = () => {
    setIndex(0);
    setTimeLeft(10);
    setScore(0);
    setMessage('Click the buggy line.');
    setLocked(false);
    setComplete(false);
  };

  const chooseLine = (line: number) => {
    if (locked || complete) return;
    setLocked(true);

    if (line === prompt.answer) {
      setScore((value) => value + 1);
      setMessage(`Bug Fixed! ${prompt.fix}`);
      addXp(15);
    } else {
      setMessage(`Almost. ${prompt.fix}`);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        minHeight: 520,
        background: 'radial-gradient(circle at 25% 15%, rgba(204,0,0,0.34), transparent 34%), #100000',
        border: '1px solid rgba(215,226,234,0.12)',
        boxShadow: '0 34px 90px rgba(0,0,0,0.35), inset 0 0 40px rgba(180,0,0,0.12)',
      }}
    >
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(215,226,234,0.08)', border: '1px solid rgba(215,226,234,0.12)' }}>
            <Code2 size={22} color="#ffb3b3" />
          </div>
          <div>
            <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
              Debug the Code
            </p>
            <p className="text-[#D7E2EA] font-light" style={{ fontSize: '0.75rem', opacity: 0.45 }}>
              7 short questions. 10 seconds each.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Stat label="Question" value={`${Math.min(index + 1, PROMPTS.length)}/${PROMPTS.length}`} />
          <Stat label="Score" value={score} />
          <Stat label="Timer" value={complete ? '--' : `${timeLeft}s`} />
        </div>
      </div>

      <div className="relative z-10 mx-4 mb-4 min-h-[350px] rounded-2xl p-4 md:mx-6 md:p-6" style={{ background: 'rgba(215,226,234,0.035)' }}>
        {complete ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <Trophy size={58} color="#ffb3b3" />
            <p className="mt-4 text-[#D7E2EA] font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              Debug Complete
            </p>
            <p className="mt-3 max-w-lg text-[#D7E2EA] font-light" style={{ opacity: 0.62 }}>
              You fixed {score}/{PROMPTS.length} prompts. {score >= PROMPTS.length - 1 ? 'Debug Master unlocked.' : 'Try again for Debug Master.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
              <Bug size={18} color="#ffb3b3" />
              <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.68rem' }}>
                {prompt.title}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(215,226,234,0.1)' }}>
              {prompt.code.map((line, lineIndex) => {
                const correct = locked && lineIndex === prompt.answer;
                return (
                  <button
                    key={`${prompt.title}-${line}`}
                    onClick={() => chooseLine(lineIndex)}
                    className="grid w-full grid-cols-[4.5rem_1fr] items-center text-left transition-colors duration-200"
                    style={{
                      minHeight: 54,
                      background: correct
                        ? 'rgba(40,190,120,0.18)'
                        : lineIndex % 2
                          ? 'rgba(215,226,234,0.035)'
                          : 'rgba(215,226,234,0.055)',
                      borderBottom: lineIndex === prompt.code.length - 1 ? 'none' : '1px solid rgba(215,226,234,0.07)',
                    }}
                  >
                    <span className="text-center text-[#D7E2EA] font-light" style={{ opacity: 0.45, fontSize: '0.72rem' }}>
                      Line {lineIndex + 1}
                    </span>
                    <code className="pr-4 text-[#D7E2EA]" style={{ fontSize: 'clamp(0.82rem, 1.45vw, 1rem)', whiteSpace: 'pre-wrap' }}>
                      {line}
                    </code>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl p-5" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
              <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.66rem' }}>
                {locked && message.startsWith('Bug Fixed') ? 'Bug Fixed!' : 'Challenge'}
              </p>
              <p className="mt-2 text-[#D7E2EA] font-light leading-relaxed" style={{ opacity: 0.58, fontSize: '0.9rem' }}>
                {message}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-3 px-5 pb-6">
        <button
          onClick={complete ? reset : locked ? next : reset}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
          style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #cc0000, #7a0000, #ff4500)' }}
        >
          {complete ? <RotateCcw size={18} /> : locked ? <Zap size={18} /> : <RotateCcw size={18} />}
          {complete ? 'Replay' : locked ? 'Next' : 'Restart'}
        </button>
      </div>
    </div>
  );
}

function SpaceInvadersGame() {
  const [threats, setThreats] = useState<Threat[]>(SPACE_THREATS);
  const [shots, setShots] = useState(0);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('Click fire to defend the portfolio.');

  const fireShot = () => {
    if (won) return;

    if (threats.length === 0) {
      setWon(true);
      addXp(75);
      unlockAchievement('portfolio-defender');
      setMessage('Portfolio Defender unlocked. The portfolio survived.');
      return;
    }

    const nextThreats = [...threats];
    nextThreats.shift();
    setThreats(nextThreats);
    setShots((value) => value + 1);
    setMessage(nextThreats.length > 0 ? 'Shot down a blocker. Keep going.' : 'All threats cleared. The portfolio is safe.');

    if (nextThreats.length === 0) {
      setWon(true);
      addXp(75);
      unlockAchievement('portfolio-defender');
    }
  };

  const reset = () => {
    setThreats(SPACE_THREATS);
    setShots(0);
    setWon(false);
    setMessage('Click fire to defend the portfolio.');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 520, background: 'radial-gradient(circle at 20% 10%, rgba(0,132,255,0.25), transparent 28%), #050816', border: '1px solid rgba(215,226,234,0.12)', boxShadow: '0 34px 90px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,119,255,0.12)' }}>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(215,226,234,0.08)', border: '1px solid rgba(215,226,234,0.12)' }}>
            <Gamepad2 size={22} color="#77d8ff" />
          </div>
          <div>
            <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
              Space Invaders: Portfolio Edition
            </p>
            <p className="text-[#D7E2EA] font-light" style={{ fontSize: '0.75rem', opacity: 0.45 }}>
              Defend the launch from developer chaos.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Stat label="Shots" value={shots} />
          <Stat label="Threats" value={threats.length} />
        </div>
      </div>

      <div className="relative z-10 mx-4 mb-4 min-h-[350px] rounded-2xl p-4 md:mx-6 md:p-6" style={{ background: 'rgba(215,226,234,0.035)' }}>
        <div className="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
          <Sparkles size={18} color="#77d8ff" />
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.68rem' }}>
            Incoming threats
          </p>
        </div>

        <div className="space-y-3">
          {threats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
              <div>
                <p className="text-[#D7E2EA] font-medium">{threat.label}</p>
                <p className="text-[#D7E2EA] font-light" style={{ opacity: 0.48, fontSize: '0.8rem' }}>{threat.detail}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#D7E2EA]" style={{ background: 'rgba(119,216,255,0.16)', border: '1px solid rgba(119,216,255,0.24)' }}>
                Incoming
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl p-5" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.66rem' }}>
            Mission
          </p>
          <p className="mt-2 text-[#D7E2EA] font-light leading-relaxed" style={{ opacity: 0.58, fontSize: '0.9rem' }}>
            {message}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-3 px-5 pb-6">
        <button
          onClick={fireShot}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
          style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #1d4ed8, #0f172a, #38bdf8)' }}
        >
          <Zap size={18} />
          Fire Shot
        </button>
        <button
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
          style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #7c3aed, #4c1d95, #8b5cf6)' }}
        >
          <RotateCcw size={18} />
          Replay
        </button>
      </div>
    </div>
  );
}

function PuzzleUnlockGame() {
  const [slots, setSlots] = useState<Array<string | null>>(Array(4).fill(null));
  const [available, setAvailable] = useState(PUZZLE_PIECES);
  const [dragging, setDragging] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState('Drag the pieces into the correct order.');

  const placePiece = (index: number) => {
    if (!dragging) return;
    if (slots[index]) return;

    const nextSlots = [...slots];
    nextSlots[index] = dragging;
    setSlots(nextSlots);
    setAvailable((value) => value.filter((piece) => piece !== dragging));
    setDragging(null);

    const complete = nextSlots.every((piece, slotIndex) => piece === PUZZLE_ORDER[slotIndex]);
    if (complete) {
      setSolved(true);
      addXp(70);
      unlockAchievement('puzzle-solver');
      setMessage('Portfolio unlocked. Let\'s build something together.');
      return;
    }

    setMessage('Nice progress. Keep the stack aligned.');
  };

  const reset = () => {
    setSlots(Array(4).fill(null));
    setAvailable(PUZZLE_PIECES);
    setDragging(null);
    setSolved(false);
    setMessage('Drag the pieces into the correct order.');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 520, background: 'radial-gradient(circle at 20% 10%, rgba(160,0,255,0.24), transparent 30%), #12050f', border: '1px solid rgba(215,226,234,0.12)', boxShadow: '0 34px 90px rgba(0,0,0,0.35), inset 0 0 40px rgba(186,0,255,0.12)' }}>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(215,226,234,0.08)', border: '1px solid rgba(215,226,234,0.12)' }}>
            <Puzzle size={22} color="#f3b0ff" />
          </div>
          <div>
            <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
              Mini Puzzle Unlock
            </p>
            <p className="text-[#D7E2EA] font-light" style={{ fontSize: '0.75rem', opacity: 0.45 }}>
              Build the stack before the contact prompt appears.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Stat label="Pieces" value={available.length} />
          <Stat label="Status" value={solved ? 'Unlocked' : 'Pending'} />
        </div>
      </div>

      <div className="relative z-10 mx-4 mb-4 min-h-[350px] rounded-2xl p-4 md:mx-6 md:p-6" style={{ background: 'rgba(215,226,234,0.035)' }}>
        <div className="mb-4 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
          <Sparkles size={18} color="#f3b0ff" />
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.68rem' }}>
            Build my stack
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.62rem', opacity: 0.55 }}>
              Drop zone
            </p>
            {slots.map((slot, index) => (
              <button
                key={`slot-${index}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => placePiece(index)}
                className="flex h-14 w-full items-center justify-center rounded-2xl border px-4 text-[#D7E2EA]"
                style={{ background: slot ? 'rgba(40,190,120,0.16)' : 'rgba(215,226,234,0.055)', borderColor: 'rgba(215,226,234,0.1)' }}
              >
                {slot ?? `Slot ${index + 1}`}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.62rem', opacity: 0.55 }}>
              Available pieces
            </p>
            {available.map((piece) => (
              <button
                key={piece}
                draggable
                onDragStart={() => setDragging(piece)}
                onDragEnd={() => setDragging(null)}
                className="flex h-14 w-full items-center justify-center rounded-2xl border px-4 text-[#D7E2EA]"
                style={{ background: 'rgba(215,226,234,0.055)', borderColor: 'rgba(215,226,234,0.1)' }}
              >
                {piece}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl p-5" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.66rem' }}>
            Puzzle status
          </p>
          <p className="mt-2 text-[#D7E2EA] font-light leading-relaxed" style={{ opacity: 0.58, fontSize: '0.9rem' }}>
            {message}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-3 px-5 pb-6">
        <button
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium uppercase tracking-widest text-white"
          style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #9d4edd, #4c1d95, #ce89ff)' }}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
}

function ModeSwitcher({ activeMode, onSelect }: { activeMode: GameMode; onSelect: (mode: GameMode) => void }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {MODE_OPTIONS.map(({ id, label, caption, icon: Icon }) => {
        const active = activeMode === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="flex min-w-[140px] flex-1 flex-col items-start rounded-2xl px-4 py-3 text-left"
            style={{
              background: active ? 'rgba(215,226,234,0.12)' : 'rgba(215,226,234,0.045)',
              border: active ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(215,226,234,0.08)',
            }}
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(215,226,234,0.08)' }}>
              <Icon size={16} color="#D7E2EA" />
            </div>
            <span className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.66rem' }}>
              {label}
            </span>
            <span className="mt-1 text-[#D7E2EA] font-light" style={{ fontSize: '0.72rem', opacity: 0.5 }}>
              {caption}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProgressPanel() {
  const [progress, setProgress] = useState<GameProgress>(() => readProgress());
  const [view, setView] = useState<'run' | 'secrets'>('run');

  useEffect(() => {
    const update = () => setProgress(readProgress());
    window.addEventListener(PROGRESS_EVENT, update);
    return () => window.removeEventListener(PROGRESS_EVENT, update);
  }, []);

  const level = getLevel(progress.xp);

  const ALL_SECRETS = ['bug', 'code', 'coffee', 'rocket', 'bolt'];
  const found = new Set(progress.easterEggs || []);
  const remaining = ALL_SECRETS.filter((id) => !found.has(id));

  const SECRET_META: Record<string, { name: string; findHint: string; howToPlay: string }> = {
    bug: {
      name: 'Hidden Bug',
      findHint: 'Look for a small 🐞 icon near the header or project cards.',
      howToPlay: 'Click the bug icon to collect it. It rewards XP and counts toward Secret Finder.',
    },
    code: {
      name: 'Code Token',
      findHint: 'A 💻 emoji hides near code snippets or the Work section.',
      howToPlay: 'Click the icon to reveal it. Exploring project pages helps find it.',
    },
    coffee: {
      name: 'Coffee Cup',
      findHint: 'Search sidebars and footers for a ☕ cup.',
      howToPlay: 'Click to collect; a hint: check around contact or about sections.',
    },
    rocket: {
      name: 'Rocket',
      findHint: 'The 🚀 appears near animated sections or hero area.',
      howToPlay: 'Click when visible to add to your secrets list.',
    },
    bolt: {
      name: 'Lightning Bolt',
      findHint: 'A ⚡ may appear near interactive elements like the Play tab.',
      howToPlay: 'Click the bolt when you spot it during gameplay or browsing.',
    },
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(215,226,234,0.055)', border: '1px solid rgba(215,226,234,0.1)' }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView('run')}
            className={`rounded-full px-4 py-2 font-semibold text-sm ${view === 'run' ? 'bg-[#ff3b3b] text-white' : 'bg-transparent text-[#D7E2EA]/80'}`}
            style={{ border: view === 'run' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(215,226,234,0.06)' }}
          >
            Run
          </button>
          <button
            onClick={() => setView('secrets')}
            className={`rounded-full px-4 py-2 font-semibold text-sm ${view === 'secrets' ? 'bg-[#6b21a8] text-white' : 'bg-transparent text-[#D7E2EA]/80'}`}
            style={{ border: view === 'secrets' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(215,226,234,0.06)' }}
          >
            Secrets
          </button>
        </div>
        <div className="text-sm text-[#D7E2EA] opacity-60">Level {level.level}</div>
      </div>

      {view === 'run' ? (
        <div>
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>
            Current Run
          </p>
          <p className="mt-2 text-[#D7E2EA] font-light" style={{ opacity: 0.56 }}>
            Best this visit: {progress.highScore} bugs solved. XP: {progress.xp}
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl px-3 py-3" style={{ background: 'rgba(215,226,234,0.04)', border: '1px solid rgba(215,226,234,0.08)' }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(215,226,234,0.06)' }}>
                <BadgeCheck size={17} color="#D7E2EA" />
              </span>
              <span>
                <span className="block text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>
                  Achievements
                </span>
                <span className="block text-[#D7E2EA] font-light" style={{ fontSize: '0.76rem', opacity: 0.48 }}>
                  {progress.achievements.length} unlocked
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-3 py-3" style={{ background: 'rgba(215,226,234,0.04)', border: '1px solid rgba(215,226,234,0.08)' }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(215,226,234,0.06)' }}>
                <Download size={17} color="#D7E2EA" />
              </span>
              <span>
                <span className="block text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>
                  Resume
                </span>
                <a className="block text-[#D7E2EA] font-light" href={RESUME_PATH} onClick={() => addXp(25)} style={{ fontSize: '0.76rem', opacity: 0.48 }}>
                  Download resume (+25 XP)
                </a>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[#D7E2EA] font-medium uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>
            Secret Finder
          </p>
          <p className="mt-2 text-[#D7E2EA] font-light" style={{ opacity: 0.56 }}>
            {found.size} found • {remaining.length} remaining
          </p>

          <div className="mt-5 space-y-3">
            {remaining.length === 0 ? (
              <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(40,190,120,0.14)', border: '1px solid rgba(40,190,120,0.34)' }}>
                <p className="text-[#D7E2EA] font-medium">All secrets found</p>
                <p className="text-[#D7E2EA] font-light" style={{ opacity: 0.6 }}>Nice exploring!</p>
              </div>
            ) : (
              remaining.map((id) => {
                const meta = SECRET_META[id] || { name: id, findHint: 'Hidden somewhere on the site.', howToPlay: '' };
                return (
                  <div key={id} className="rounded-2xl px-3 py-3" style={{ background: 'rgba(215,226,234,0.03)', border: '1px solid rgba(215,226,234,0.08)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-[#D7E2EA] font-bold">{meta.name.split(' ')[0].charAt(0)}</span>
                        <div>
                          <div className="text-[#D7E2EA] font-semibold">{meta.name}</div>
                          <div className="text-[#D7E2EA] text-sm opacity-60">{meta.findHint}</div>
                        </div>
                      </div>
                      <div className="text-sm text-[#D7E2EA] opacity-60">How to play</div>
                    </div>

                    <p className="mt-3 text-[#D7E2EA] font-light" style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                      {meta.howToPlay}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIMiniGameSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const ALL_MODES: GameMode[] = ['debug', 'space', 'puzzle'];
  const [activeMode, setActiveMode] = useState<GameMode>(() => {
    return ALL_MODES[Math.floor(Math.random() * ALL_MODES.length)];
  });

  return (
    <section
      id="play"
      ref={ref}
      className="relative z-10 overflow-hidden px-6 py-24 md:px-10 md:py-32 lg:px-14"
      style={{ background: '#1a0000' }}
    >
      <div className="mb-12 flex items-center gap-3 md:mb-16">
        <div style={{ width: 24, height: 1, background: 'rgba(215,226,234,0.35)' }} />
        <span className="font-light uppercase tracking-widest text-[#D7E2EA]" style={{ fontSize: '0.6rem', opacity: 0.45 }}>
          Play
        </span>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="hero-heading mb-7 font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.7rem, 7vw, 6.5rem)' }}>
            Arcade<br />Lab.
          </h2>
          <p className="mb-8 text-[#D7E2EA] font-light leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.1rem)', opacity: 0.62, maxWidth: '48ch' }}>
            The hero challenge is for speed. This lab is for curiosity: pick a mode or let the site surprise you with a fresh arcade pick on every refresh.
          </p>
          <ProgressPanel />
        </motion.div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <ModeSwitcher activeMode={activeMode} onSelect={setActiveMode} />
            <div>
              <button
                onClick={() => setActiveMode(ALL_MODES[Math.floor(Math.random() * ALL_MODES.length)])}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 font-medium uppercase tracking-widest text-white"
                style={{ fontSize: '0.65rem', background: 'linear-gradient(123deg, #06b6d4, #7c3aed)' }}
              >
                Random
              </button>
            </div>
          </div>

          {activeMode === 'debug' ? <DebugChallenge /> : activeMode === 'space' ? <SpaceInvadersGame /> : <PuzzleUnlockGame />}
        </div>
      </div>
    </section>
  );
}
