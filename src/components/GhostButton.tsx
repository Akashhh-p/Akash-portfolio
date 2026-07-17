interface GhostButtonProps {
  href?: string;
  label?: string;
  target?: string;
}

export default function GhostButton({
  href = '#',
  label = 'View on GitHub',
  target = '_blank',
}: GhostButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest
        inline-block transition-colors duration-200 hover:bg-[#D7E2EA]/10
        px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base"
    >
      {label}
    </a>
  );
}
