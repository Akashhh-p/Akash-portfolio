export type AchievementId =
  | 'debug-master'
  | 'portfolio-defender'
  | 'puzzle-solver'
  | 'recruiter-favorite'
  | 'bug-hunter'
  | 'secret-finder'
  | 'explorer';

export type GameProgress = {
  xp: number;
  highScore: number;
  achievements: AchievementId[];
  easterEggs: string[];
  muted: boolean;
  startedAt: number;
};

export const ACHIEVEMENTS: Record<AchievementId, { name: string; description: string }> = {
  'debug-master': { name: 'Debug Master', description: 'Solved every debugging prompt in the lab.' },
  'portfolio-defender': { name: 'Portfolio Defender', description: 'Protected the portfolio from launch-day chaos in Space Invaders.' },
  'puzzle-solver': { name: 'Puzzle Solver', description: 'Unlocked contact by building the stack in the puzzle mode.' },
  'recruiter-favorite': { name: 'Recruiter Favorite', description: 'Discovered the hidden arcade modes and extra portfolio surprises.' },
  'bug-hunter': { name: 'Bug Hunter', description: 'Cleared enough blockers and bugs across the arcade.' },
  'secret-finder': { name: 'Secret Finder', description: 'Found all hidden easter eggs across the site.' },
  'explorer': { name: 'Explorer', description: 'Visited the core portfolio sections.' },
};

export const CORE_SECTION_IDS = ['about', 'work', 'skills', 'certifications', 'play', 'contact'];
export const PROGRESS_EVENT = 'portfolio-progress-updated';
export const RESUME_PATH = '/Akash_finalresume_2026.pdf';

const STORAGE_KEY = 'akash-portfolio-game-progress';
const VISITED_KEY = 'akash-portfolio-visited-sections';
let clearedForThisPageLoad = false;

function getStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const storage = window.localStorage;
    const testKey = `${STORAGE_KEY}-test`;
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function clearStoredProgressOnPageLoad() {
  if (typeof window === 'undefined' || clearedForThisPageLoad) return;
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
  storage?.removeItem(VISITED_KEY);
  clearedForThisPageLoad = true;
}

export function getDefaultProgress(): GameProgress {
  return {
    xp: 0,
    highScore: 0,
    achievements: [],
    easterEggs: [],
    muted: false,
    startedAt: Date.now(),
  };
}

export function readProgress(): GameProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  clearStoredProgressOnPageLoad();

  try {
    const storage = getStorage();
    const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null') as Partial<GameProgress> | null;
    return {
      ...getDefaultProgress(),
      ...parsed,
      achievements: parsed?.achievements ?? [],
      easterEggs: parsed?.easterEggs ?? [],
      startedAt: parsed?.startedAt ?? Date.now(),
    };
  } catch {
    return getDefaultProgress();
  }
}

export function writeProgress(progress: GameProgress) {
  getStorage()?.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: progress }));
}

export function updateProgress(updater: (progress: GameProgress) => GameProgress) {
  const next = updater(readProgress());
  writeProgress(next);
  return next;
}

export function addXp(amount: number) {
  updateProgress((progress) => ({ ...progress, xp: progress.xp + amount }));
}

export function unlockAchievement(id: AchievementId) {
  updateProgress((progress) => {
    if (progress.achievements.includes(id)) return progress;
    return { ...progress, achievements: [...progress.achievements, id], xp: progress.xp + 40 };
  });
}

export function setMuted(muted: boolean) {
  updateProgress((progress) => ({ ...progress, muted }));
}

export function getLevel(xp: number) {
  const level = Math.floor(xp / 150) + 1;
  const currentLevelXp = xp % 150;
  return { level, currentLevelXp, nextLevelXp: 150 };
}

export function readVisitedSections() {
  try {
    return JSON.parse(getStorage()?.getItem(VISITED_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function markSectionVisited(id: string) {
  const visited = new Set(readVisitedSections());
  const sizeBefore = visited.size;
  visited.add(id);
  getStorage()?.setItem(VISITED_KEY, JSON.stringify([...visited]));

  if (visited.size > sizeBefore) {
    addXp(id === 'about' ? 10 : 15);
  }

  const exploredAll = CORE_SECTION_IDS.every((sectionId) => visited.has(sectionId));
  if (exploredAll) {
    unlockAchievement('explorer');
  }
}
