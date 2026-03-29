import { CheckCircle2, XCircle } from 'lucide-react';
import TestCard from './TestCard';
import { motion } from 'framer-motion';

export default function ResultsView({ results }) {
  if (!results) return null;
  const { summary, results: tests } = results;

  const getStatusColor = (status) => {
    return status === 'PASS' 
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
      : 'border-red-500/30 bg-red-500/10 text-red-500';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <div className="space-y-8 flex-1">
      {/* Header Summary Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2 z-10">Total Tests</p>
          <p className="text-4xl font-bold font-mono text-gray-200 z-10">{summary.totalTests}</p>
        </div>
        <div className="bg-gray-900/50 border border-emerald-900/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-emerald-500/80 text-sm font-medium uppercase tracking-wider mb-2 z-10">Passed</p>
          <div className="flex items-center gap-2 z-10">
            <CheckCircle2 className="text-emerald-500 w-8 h-8" />
            <p className="text-4xl font-bold font-mono text-emerald-400">{summary.passedTests}</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-red-900/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-red-500/80 text-sm font-medium uppercase tracking-wider mb-2 z-10">Failed</p>
          <div className="flex items-center gap-2 z-10">
            <XCircle className="text-red-500 w-8 h-8" />
            <p className="text-4xl font-bold font-mono text-red-500">{summary.failedTests}</p>
          </div>
        </div>
      </motion.div>

      {/* Target Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`px-6 py-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${getStatusColor(summary.overallStatus)}`}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold px-3 py-1 rounded bg-gray-950/50 text-sm tracking-widest">{summary.method}</span>
          <span className="font-mono text-sm opacity-90 break-all">{summary.url}</span>
        </div>
        <div className="font-bold tracking-widest text-lg md:text-xl">
          {summary.overallStatus}
        </div>
      </motion.div>

      {/* Test List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-gray-300 border-b border-gray-800 pb-2 mb-4">Execution Details</h3>
        {tests.map((test, index) => (
          <TestCard key={index} test={test} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
