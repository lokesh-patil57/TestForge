import { useState } from 'react';
import { generateTests, runTests } from '../api';
import { Play, Webhook } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestInputForm({ setResults, setLoading, setError }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // 1. Generate Tests
      const testCases = await generateTests(url, method, body);
      
      // 2. Run Tests
      const resultsData = await runTests(url, method, testCases);
      
      setResults(resultsData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-950 p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 transform origin-left transition-transform duration-500 hover:scale-x-100"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 shadow-inner group-hover:border-emerald-500/30 transition-colors">
          <Webhook className="text-emerald-400 w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Configure API Target</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Endpoint URL</label>
          <input
            type="url"
            required
            placeholder="https://api.example.com/users"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner font-mono text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">HTTP Method</label>
          <div className="relative">
            <select
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none transition-all shadow-inner font-bold tracking-wide"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                <option key={m} value={m} className="bg-gray-900">{m}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
              ▼
            </div>
          </div>
        </div>

        <motion.div 
          animate={{ height: method !== 'GET' ? 'auto' : 0, opacity: method !== 'GET' ? 1 : 0 }}
          className="overflow-hidden"
        >
          <label className="block text-sm font-medium text-gray-400 mt-2 mb-2">Request Body (JSON / Text)</label>
          <textarea
            rows={5}
            placeholder='{"key": "value"}'
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner font-mono text-xs resize-none"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </motion.div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mt-6"
        >
          <Play fill="currentColor" className="w-5 h-5" />
          Generate & Run AI Tests
        </button>
      </form>
    </motion.div>
  );
}
