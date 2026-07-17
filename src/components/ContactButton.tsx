interface ContactButtonProps {
  href?: string;
  label?: string;
}

export default function ContactButton({
  href = 'mailto:akashp3620@gmail.com',
  label = 'Contact Me',
}: ContactButtonProps) {
  return (
    <a
      href={href}
      className="rounded-full font-medium uppercase tracking-widest text-white inline-block
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        transition-opacity duration-200 hover:opacity-90"
      style={{
        background: 'linear-gradient(123deg, #1a0000 7%, #cc0000 37%, #8b0000 72%, #ff4500 100%)',
        boxShadow:
          '0px 4px 4px rgba(180, 0, 0, 0.25), inset 4px 4px 12px #8b0000',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </a>
  );
}
