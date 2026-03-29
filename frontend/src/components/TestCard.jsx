import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Bot, AlertTriangle, Lightbulb, Clock, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function TestCard({ test, index }) {
  const [expanded, setExpanded] = useState(false);
  const isPass = test.status === 'PASS';

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <motion.div 
      layout
      variants={cardVariants}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={twMerge(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isPass 
          ? "bg-gray-900/50 hover:bg-gray-900 border-gray-800 hover:border-emerald-900/50" 
          : "bg-red-950/20 hover:bg-red-950/30 border-red-900/50"
      )}
    >
      <div 
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={clsx("p-2 rounded-full hidden sm:block", isPass ? "bg-emerald-500/10" : "bg-red-500/10")}>
            {isPass ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
          </div>
          <div className="flex-1 w-full">
            <h4 className="font-bold text-gray-200 text-[15px] truncate max-w-[200px] sm:max-w-[400px]">{test.name}</h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <span className="text-xs font-mono text-gray-500 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                Expected: {test.expectedStatus}
              </span>
              <span className={clsx("text-xs font-mono px-2 py-0.5 rounded border", isPass ? "text-emerald-400 border-emerald-900/50 bg-emerald-950/30" : "text-red-400 border-red-900/50 bg-red-950/30")}>
                Actual: {test.actualStatus}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{test.responseTime}ms</span>
              </div>
              {test.retryCount > 0 && (
                <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Retries: {test.retryCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sm:pl-4 text-gray-500 hover:text-gray-300 transition-colors flex justify-end">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800 bg-gray-950/50"
          >
            <div className="p-5 space-y-6">
              
              {/* Request & Response Grids */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    Request Payload
                  </div>
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs font-mono text-cyan-300 overflow-x-auto max-h-60">
                    {test.requestBody ? JSON.stringify(test.requestBody, null, 2) : 'No payload'}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    Response Data
                  </div>
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-60">
                    {JSON.stringify(test.responseBody, null, 2)}
                  </pre>
                </div>
              </div>

              {/* AI Explanation for Failures */}
              {!isPass && test.aiExplanation && (
                <div className="bg-gradient-to-br from-indigo-950/50 to-purple-900/20 rounded-xl border border-indigo-500/30 overflow-hidden shadow-inner flex flex-col">
                  <div className="bg-indigo-950/50 px-4 py-3 border-b border-indigo-500/30 flex items-center gap-3">
                    <Bot className="text-indigo-400 w-5 h-5" />
                    <h5 className="font-bold text-indigo-300 uppercase tracking-wider text-xs">AI Root Cause Analysis</h5>
                  </div>
                  <div className="p-5 space-y-5 flex-1">
                    <div className="flex gap-3 text-sm text-indigo-200/90 leading-relaxed">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-red-400 mb-1">Failure Explanation:</strong>
                        {test.aiExplanation}
                      </div>
                    </div>
                    <div className="w-full h-px bg-indigo-500/20"></div>
                    <div className="flex gap-3 text-sm text-indigo-200/90 leading-relaxed items-start">
                      <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-emerald-400 mb-1">Suggested Fix:</strong>
                        {test.aiFixSuggestion}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
