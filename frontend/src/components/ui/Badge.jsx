import { cn } from '../../lib/cn';

export function Badge({ 
  children, 
  variant = 'neutral',
  className,
  ...props 
}) {
  const variants = {
    neutral: 'bg-gray-800 text-gray-200 border border-gray-700',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
