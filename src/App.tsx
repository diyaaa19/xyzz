import React, { useMemo, useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { SearchView } from './components/SearchView';
import { ProcessFlowView } from './components/ProcessFlowView';
import { EvaluationView } from './components/EvaluationView';
import { BBC_DOCUMENTS, BENCHMARK_QUERIES } from './data/bbcDataset';
import { TfidfEngine } from './services/tfidfEngine';
import { BM25Engine } from './services/bm25Engine';
import { DenseEngine } from './services/denseEngine';
import { RRFEngine } from './services/rrfEngine';
import { EvaluationSuite } from './services/evaluationSuite';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [query, setQuery] = useState<string>('central bank interest rate hikes and inflation');

  // Initialize IR Engines
  const { tfidfEngine, bm25Engine, denseEngine, rrfEngine, evaluationSuite, corpusMetrics } = useMemo(() => {
    const tfidf = new TfidfEngine(BBC_DOCUMENTS);
    const bm25 = new BM25Engine(BBC_DOCUMENTS, 1.5, 0.75);
    const dense = new DenseEngine(BBC_DOCUMENTS);
    const rrf = new RRFEngine(bm25, dense, tfidf, 60);
    const evalSuite = new EvaluationSuite(tfidf, bm25, dense, rrf, BENCHMARK_QUERIES);

    const vocabSize = tfidf.getVocabularySize();
    const totalWords = BBC_DOCUMENTS.reduce((acc, d) => acc + (d.body.split(/\s+/).length), 0);
    const avgDocLen = Math.round(totalWords / BBC_DOCUMENTS.length);

    return {
      tfidfEngine: tfidf,
      bm25Engine: bm25,
      denseEngine: dense,
      rrfEngine: rrf,
      evaluationSuite: evalSuite,
      corpusMetrics: {
        corpusCount: BBC_DOCUMENTS.length,
        vocabCount: vocabSize,
        avgDocLen
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        corpusCount={corpusMetrics.corpusCount}
        vocabCount={corpusMetrics.vocabCount}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'search' && (
          <SearchView
            query={query}
            onQueryChange={setQuery}
            documents={BBC_DOCUMENTS}
            tfidfEngine={tfidfEngine}
            bm25Engine={bm25Engine}
            denseEngine={denseEngine}
            rrfEngine={rrfEngine}
          />
        )}

        {activeTab === 'pipeline' && (
          <ProcessFlowView
            query={query}
            onQueryChange={setQuery}
            tfidfEngine={tfidfEngine}
            bm25Engine={bm25Engine}
            denseEngine={denseEngine}
            rrfEngine={rrfEngine}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationView
            evaluationSuite={evaluationSuite}
            benchmarkQueries={BENCHMARK_QUERIES}
          />
        )}
      </main>

      {/* Clean Human Footer */}
      <footer className="border-t border-[#1e222e] bg-[#0c0e15] py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">BBC News IR Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">BM25Okapi + Sentence-Transformers + Reciprocal Rank Fusion</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <button
              onClick={() => setActiveTab('search')}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'search' ? 'text-red-400 font-bold' : 'text-slate-400'}`}
            >
              Search
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'pipeline' ? 'text-red-400 font-bold' : 'text-slate-400'}`}
            >
              Process Flow
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'evaluation' ? 'text-red-400 font-bold' : 'text-slate-400'}`}
            >
              Evaluation &amp; Curves
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
