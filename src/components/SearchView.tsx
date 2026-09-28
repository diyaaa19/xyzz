import React, { useState } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { BBCDocument, Category, RankingModelType, SearchResult } from '../types/ir';
import { BM25Engine } from '../services/bm25Engine';
import { DenseEngine } from '../services/denseEngine';
import { RRFEngine } from '../services/rrfEngine';
import { TfidfEngine } from '../services/tfidfEngine';

interface SearchViewProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  documents: BBCDocument[];
  tfidfEngine: TfidfEngine;
  bm25Engine: BM25Engine;
  denseEngine: DenseEngine;
  rrfEngine: RRFEngine;
}

const CATEGORY_STYLES: Record<Category, { badge: string; border: string }> = {
  business: { badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60', border: 'hover:border-emerald-700/60' },
  entertainment: { badge: 'bg-rose-950/70 text-rose-300 border-rose-800/60', border: 'hover:border-rose-700/60' },
  politics: { badge: 'bg-amber-950/70 text-amber-300 border-amber-800/60', border: 'hover:border-amber-700/60' },
  sport: { badge: 'bg-sky-950/70 text-sky-300 border-sky-800/60', border: 'hover:border-sky-700/60' },
  tech: { badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60', border: 'hover:border-indigo-700/60' },
};

const EXAMPLE_SEARCHES = [
  'central bank interest rate hikes and inflation',
  'generative AI neural search engines and dense retrieval',
  'premier league title race stoppage time derby winner',
  'BAFTA film awards independent cinema and director',
  'NHS public healthcare hospital reform bill'
];

export const SearchView: React.FC<SearchViewProps> = ({
  query,
  onQueryChange,
  tfidfEngine,
  bm25Engine,
  denseEngine,
  rrfEngine
}) => {
  const [searchInput, setSearchInput] = useState(query);
  const [selectedModel, setSelectedModel] = useState<RankingModelType>('rrf');
  const [selectedDocForModal, setSelectedDocForModal] = useState<BBCDocument | null>(null);

  // Keep searchInput in sync when query prop changes
  React.useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onQueryChange(searchInput.trim());
  };

  const handlePresetClick = (preset: string) => {
    setSearchInput(preset);
    onQueryChange(preset);
  };

  // Execute search based on active ranking model
  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return [];
    if (selectedModel === 'tfidf') return tfidfEngine.search(query, 10);
    if (selectedModel === 'bm25') return bm25Engine.search(query, 10);
    if (selectedModel === 'dense') return denseEngine.search(query, 10);
    return rrfEngine.search(query, 10, 'bm25');
  }, [query, selectedModel, tfidfEngine, bm25Engine, denseEngine, rrfEngine]);

  const highlightSnippet = (snippet: string, matchedTerms: string[]) => {
    if (!matchedTerms || matchedTerms.length === 0) return snippet;
    const regex = new RegExp(`(${matchedTerms.join('|')})`, 'gi');
    const parts = snippet.split(regex);
    return parts.map((part, i) => {
      const isMatch = matchedTerms.some(
        t => part.toLowerCase().startsWith(t.toLowerCase()) || t.toLowerCase().startsWith(part.toLowerCase())
      );
      return isMatch ? (
        <mark key={i} className="bg-amber-400/20 text-amber-200 px-0.5 py-0.2 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Bar & Model Selection Card */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            BBC News Information Retrieval
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Retrieve relevant news documents using lexical matching, dense embeddings, or reciprocal rank fusion.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search BBC articles (e.g., inflation, artificial intelligence, football)..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#0a0c12] border border-[#262b3a] focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-white placeholder-slate-500 text-sm outline-none transition-colors font-sans"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); onQueryChange(''); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Example Queries */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Try:</span>
          {EXAMPLE_SEARCHES.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(example)}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs transition-colors truncate max-w-[260px] cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>

        {/* Model Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1e222e]">
          <button
            onClick={() => setSelectedModel('rrf')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedModel === 'rrf'
                ? 'bg-red-950/40 border-red-600 text-white'
                : 'bg-[#0f1117] border-[#222634] text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">Hybrid Fusion</div>
            <div className="text-sm font-semibold text-white mt-0.5">Reciprocal Rank Fusion</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Blends BM25 + Dense ranks (k=60)</p>
          </button>

          <button
            onClick={() => setSelectedModel('bm25')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedModel === 'bm25'
                ? 'bg-sky-950/40 border-sky-600 text-white'
                : 'bg-[#0f1117] border-[#222634] text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">Sparse Lexical</div>
            <div className="text-sm font-semibold text-white mt-0.5">BM25Okapi</div>
            <p className="text-[11px] text-slate-400 mt-0.5">TF saturation &amp; length penalty</p>
          </button>

          <button
            onClick={() => setSelectedModel('dense')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedModel === 'dense'
                ? 'bg-purple-950/40 border-purple-600 text-white'
                : 'bg-[#0f1117] border-[#222634] text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">Dense Semantic</div>
            <div className="text-sm font-semibold text-white mt-0.5">Sentence Transformer</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Embeddings vector cosine similarity</p>
          </button>

          <button
            onClick={() => setSelectedModel('tfidf')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedModel === 'tfidf'
                ? 'bg-emerald-950/40 border-emerald-600 text-white'
                : 'bg-[#0f1117] border-[#222634] text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Vector Space</div>
            <div className="text-sm font-semibold text-white mt-0.5">TF-IDF Model</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Smooth IDF with sublinear TF</p>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>
            Ranked results for &quot;<strong className="text-white">{query}</strong>&quot; ({results.length} documents retrieved)
          </span>
          <span className="font-mono uppercase text-red-400 font-bold">
            {selectedModel === 'rrf' ? 'Reciprocal Rank Fusion' : selectedModel.toUpperCase()}
          </span>
        </div>

        {/* Results List */}
        {results.length === 0 ? (
          <div className="p-12 text-center bg-[#12151f] border border-[#222634] rounded-xl space-y-2">
            <p className="text-slate-300 text-sm">No documents found matching this query.</p>
            <button
              onClick={() => handlePresetClick(EXAMPLE_SEARCHES[0])}
              className="text-xs text-red-400 hover:underline cursor-pointer"
            >
              Search for &quot;{EXAMPLE_SEARCHES[0]}&quot;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => {
              const catStyle = CATEGORY_STYLES[result.document.category];
              return (
                <article
                  key={result.docId}
                  className={`bg-[#12151f] border border-[#222634] ${catStyle.border} rounded-xl p-5 transition-all shadow-sm space-y-3`}
                >
                  {/* Top Bar: Rank, Category, Date, Score */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        #{result.rank}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${catStyle.badge}`}>
                            {result.document.category}
                          </span>
                          <span className="text-slate-400 font-sans">
                            {result.document.author} • {result.document.date}
                          </span>
                        </div>

                        <h2
                          onClick={() => setSelectedDocForModal(result.document)}
                          className="font-serif text-lg sm:text-xl font-bold text-white hover:text-red-400 transition-colors cursor-pointer leading-snug news-headline"
                        >
                          {result.document.title}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                        {result.score.toFixed(selectedModel === 'rrf' ? 5 : 4)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        {selectedModel === 'rrf' ? 'RRF Score' : 'Relevance'}
                      </div>
                    </div>
                  </div>

                  {/* RRF Rank Decomposition Bar */}
                  {selectedModel === 'rrf' && result.sparseRank !== undefined && result.denseRank !== undefined && (
                    <div className="p-2.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg text-xs font-mono tabular-nums text-slate-400 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span>BM25 Rank: <strong className="text-sky-300">#{result.sparseRank}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span>Dense Rank: <strong className="text-purple-300">#{result.denseRank}</strong></span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        1/(60+{result.sparseRank}) + 1/(60+{result.denseRank}) = <span className="text-red-400 font-bold">{result.score.toFixed(5)}</span>
                      </div>
                    </div>
                  )}

                  {/* Excerpt Snippet */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {highlightSnippet(result.snippet, result.matchedTerms)}
                  </p>

                  {/* Footer Terms & Article Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e222e] text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {result.matchedTerms.length > 0 ? (
                        <>
                          <span className="text-slate-400 text-[11px]">Matched terms:</span>
                          {result.matchedTerms.map((term, i) => (
                            <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-amber-300 rounded border border-slate-700">
                              {term}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Dense semantic vector similarity</span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedDocForModal(result.document)}
                      className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Read article</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedDocForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12151f] border border-[#222634] max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#222634] pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${CATEGORY_STYLES[selectedDocForModal.category].badge}`}>
                    {selectedDocForModal.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedDocForModal.author} • {selectedDocForModal.date}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight news-headline">
                  {selectedDocForModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDocForModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line space-y-3">
              {selectedDocForModal.body}
            </div>

            <div className="pt-4 border-t border-[#222634] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">ID: {selectedDocForModal.id}</span>
              <button
                onClick={() => setSelectedDocForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
