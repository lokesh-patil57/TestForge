export function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-800 rounded-lg animate-pulse ${className}`}
          style={{
            '--tw-animate-pulse': 'pulse',
          }}
        />
      ))}
    </>
  );
}
