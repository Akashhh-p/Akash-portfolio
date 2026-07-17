export default function BackgroundOrbs() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top-right orb */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(180,0,0,0.22) 0%, rgba(120,0,0,0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat1 12s ease-in-out infinite',
        }}
      />
      {/* Bottom-left orb */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(150,0,0,0.18) 0%, rgba(80,0,0,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orbFloat2 15s ease-in-out infinite',
        }}
      />
      {/* Center subtle orb */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(200,30,30,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'orbFloat3 20s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-3%, 5%) scale(1.05); }
          66% { transform: translate(4%, -3%) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, -4%) scale(1.06); }
          66% { transform: translate(-3%, 5%) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6%, 8%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
