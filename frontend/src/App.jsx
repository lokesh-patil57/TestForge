import { useState } from 'react';
import TestInputForm from './components/TestInputForm';
import ResultsView from './components/ResultsView';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <header className="border-b border-gray-800 p-6 bg-gray-950 flex items-center gap-3 shadow-md z-10">
        <Activity className="text-emerald-500 w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          AI TestPilot (TestForge)
        </h1>
      </header>

      <main className="flex-1 p-6 lg:p-10 grid lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        <div className="lg:col-span-4 space-y-6">
          <TestInputForm setResults={setResults} setLoading={setLoading} setError={setError} />
        </div>
        
        <div className="lg:col-span-8 bg-gray-950 rounded-2xl border border-gray-800 p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 border-4 border-gray-800 border-t-emerald-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <p className="text-emerald-400 font-medium animate-pulse text-lg tracking-wide">
                  Generating & Executing AI Tests...
                </p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 shadow-sm"
            >
              <h3 className="font-bold">Execution Failed</h3>
              <p className="mt-1 opacity-90">{error}</p>
            </motion.div>
          )}

          {!results && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Enter an endpoint and generate tests to see results</p>
            </div>
          )}

          {results && <ResultsView results={results} />}
        </div>
      </main>
    </div>
  );
}

export default App;
