export function WaveBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-20 animate-wave-1"
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,40 Q100,10 200,40 T400,40 T600,40 T800,40 L800,80 L0,80 Z"
          fill="rgba(125,211,252,0.30)"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-16 animate-wave-2"
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 L800,80 L0,80 Z"
          fill="rgba(56,189,248,0.18)"
        />
      </svg>
    </div>
  );
}
