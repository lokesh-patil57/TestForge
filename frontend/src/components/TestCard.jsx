import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Bot, AlertTriangle, Lightbulb, Clock, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';

export default function TestCard({ test, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isPass 
          ? "bg-gray-900/50 hover:bg-gray-900 border-emerald-900/30 hover:border-emerald-900/60" 
          : "bg-red-950/20 hover:bg-red-950/30 border-red-900/50 hover:border-red-900/70"
      )}
    >
      <div 
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <motion.div 
            className={cn("p-2.5 rounded-full hidden sm:flex items-center justify-center shrink-0", 
              isPass ? "bg-emerald-500/20" : "bg-red-500/20"
            )}
            whileHover={{ scale: 1.1 }}
          >
            {isPass ? (
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-200 text-[15px] truncate">{test.name}</h4>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="neutral">
                Expected: {test.expectedStatus}
              </Badge>
              <Badge variant={isPass ? 'success' : 'error'}>
                Actual: {test.actualStatus}
              </Badge>
              <Badge variant="info" className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {test.responseTime}ms
              </Badge>
              {test.retryCount > 0 && (
                <Badge variant="warning">
                  Retries: {test.retryCount}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <motion.div 
          className="sm:pl-4 text-gray-500 hover:text-gray-300 transition-colors flex justify-end shrink-0"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-800 bg-gray-950/50"
          >
            <div className="p-6 space-y-6">
              
              {/* Request & Response Grids */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Request Payload</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(test.requestBody, null, 2))}
                      className="p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                  </div>
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs font-mono text-cyan-300 overflow-x-auto max-h-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" tabIndex={0}>
                    {test.requestBody ? JSON.stringify(test.requestBody, null, 2) : 'No payload'}
                  </pre>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Response Data</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(test.responseBody, null, 2))}
                      className="p-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                  </div>
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" tabIndex={0}>
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
