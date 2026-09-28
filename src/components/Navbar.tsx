import React from 'react';
import { Search, BarChart3, Workflow } from 'lucide-react';

export type ActiveTab = 'search' | 'pipeline' | 'evaluation';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  corpusCount: number;
  vocabCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  corpusCount,
  vocabCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f1117] border-b border-[#222634]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Authentic BBC Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 bg-white text-black font-extrabold text-sm flex items-center justify-center font-sans tracking-tight">
                B
              </span>
              <span className="w-6 h-6 bg-white text-black font-extrabold text-sm flex items-center justify-center font-sans tracking-tight">
                B
              </span>
              <span className="w-6 h-6 bg-white text-black font-extrabold text-sm flex items-center justify-center font-sans tracking-tight">
                C
              </span>
            </div>
            <div className="h-5 w-[1px] bg-slate-700 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm tracking-tight font-sans">
                  News IR Engine
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-red-950/70 text-red-300 border border-red-800/60 rounded">
                  Hybrid RRF
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                BM25Okapi • Dense Embeddings • TF-IDF • Reciprocal Rank Fusion
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Process Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'evaluation'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Evaluation &amp; Curves</span>
            </button>
          </nav>
        </div>

        {/* Compact Index Status */}
        <div className="py-1.5 border-t border-[#1e222e] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Corpus: <strong className="text-slate-200">{corpusCount} BBC Articles</strong></span>
            <span className="text-slate-600">•</span>
            <span>Vocabulary: <strong className="text-slate-200">{vocabCount} Porter Stems</strong></span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline">Parameters: <span className="text-slate-300 font-mono">BM25(k₁=1.5, b=0.75), RRF(k=60)</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[10px]">Pipeline Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
