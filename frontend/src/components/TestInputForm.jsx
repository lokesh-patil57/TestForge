import { useState } from 'react';
import { generateTests, runTests } from '../api';
import { Play, Webhook, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { HTTP_METHODS } from '../lib/constants';
import { useTestStore } from '../store/testStore';

export default function TestInputForm() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [localError, setLocalError] = useState(null);

  const setResults = useTestStore(s => s.setResults);
  const setLoading = useTestStore(s => s.setLoading);
  const setError = useTestStore(s => s.setError);
  const addToHistory = useTestStore(s => s.addToHistory);

  const loading = useTestStore(s => s.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setLocalError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setLocalError(null);
    setError(null);
    setResults(null);

    try {
      // 1. Generate Tests
      const testCases = await generateTests(url, method, body);
      
      // 2. Run Tests
      const resultsData = await runTests(url, method, testCases);
      
      setResults(resultsData);
      addToHistory(resultsData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'An unknown error occurred.';
      setError(errorMsg);
      setLocalError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full flex flex-col" withGradient>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-500/30">
            <Webhook className="text-emerald-400 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">API Endpoint Configuration</h2>
            <p className="text-xs text-gray-500 mt-1">Enter details to generate and run tests</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2.5">Endpoint URL *</label>
            <input
              type="url"
              required
              placeholder="https://api.example.com/users"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setLocalError(null);
              }}
            />
          </div>

          {/* HTTP Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2.5">HTTP Method</label>
            <div className="relative">
              <select
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none transition-all font-semibold"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                ▼
              </div>
            </div>
          </div>

          {/* Request Body - Animated */}
          <motion.div 
            animate={{ height: method !== 'GET' ? 'auto' : 0, opacity: method !== 'GET' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2.5">Request Body (JSON)</label>
            <textarea
              rows={4}
              placeholder='{"key": "value"}'
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-xs resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </motion.div>

          {/* Error Display */}
          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm"
            >
              {localError}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-auto py-3.5 text-base font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play fill="currentColor" className="w-4 h-4" />
                Generate & Run Tests
              </>
            )}
          </Button>

          {/* Quick Tips */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>AI generates intelligent test cases automatically</span>
              </div>
              <div className="flex gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Parallel execution with retry logic included</span>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
