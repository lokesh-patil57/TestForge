import { cn } from '../../lib/cn';

export function Card({ 
  children,
  className,
  withGradient = false,
  interactive = false,
  ...props 
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm transition-all duration-300',
        interactive && 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
        withGradient && 'bg-gradient-to-br from-emerald-500/5 to-cyan-500/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
