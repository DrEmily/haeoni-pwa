export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 bg-[length:200%_100%] animate-shimmer rounded-md ${className}`}
      aria-hidden
    />
  );
}
