import React, { useState } from 'react';
import { Database, Cpu, GitMerge, ArrowRight } from 'lucide-react';
import { preprocessPipeline } from '../services/preprocessor';
import { TfidfEngine } from '../services/tfidfEngine';
import { BM25Engine } from '../services/bm25Engine';
import { DenseEngine } from '../services/denseEngine';
import { RRFEngine } from '../services/rrfEngine';
import { InvertedIndex } from '../types/ir';

interface ProcessFlowViewProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  tfidfEngine: TfidfEngine;
  bm25Engine: BM25Engine;
  denseEngine: DenseEngine;
  rrfEngine: RRFEngine;
}

const PRESET_QUERIES = [
  "Central bank raises interest rates to curb persistent inflation",
  "Generative AI neural search engines and dense retrieval",
  "Premier League derby thriller decided by stoppage-time goal",
  "BAFTA film awards honor independent cinema and drama"
];

export const ProcessFlowView: React.FC<ProcessFlowViewProps> = ({
  query,
  onQueryChange,
  tfidfEngine,
  bm25Engine,
  denseEngine,
  rrfEngine
}) => {
  const [localInput, setLocalInput] = useState(query);

  React.useEffect(() => {
    setLocalInput(query);
  }, [query]);

  const effectiveQuery = query.trim() || PRESET_QUERIES[0];
  const processed = preprocessPipeline(effectiveQuery);
  const invertedIndex: InvertedIndex = tfidfEngine.getInvertedIndex();

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(localInput.trim());
  };

  // Live top-3 results for this query
  const liveBm25Top = bm25Engine.search(effectiveQuery, 3);
  const liveDenseTop = denseEngine.search(effectiveQuery, 3);
  const liveRrfTop = rrfEngine.search(effectiveQuery, 3);

  // Extract query stems
  const uniqueStems = Array.from(new Set(processed.stemmedTokens.map(t => t.stemmed)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Input Form */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Information Retrieval Process Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step walkthrough of how text is ingested, indexed, and fused into final rankings.
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleQuerySubmit} className="flex gap-2">
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Type any sentence or query to trace through the pipeline..."
            className="flex-1 px-4 py-2 bg-[#0a0c12] border border-[#262b3a] focus:border-red-600 rounded-lg text-white font-mono text-xs sm:text-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Trace Pipeline
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Example inputs:</span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setLocalInput(preset); onQueryChange(preset); }}
              className={`px-2.5 py-1 rounded border text-xs transition-colors truncate max-w-[240px] cursor-pointer ${
                effectiveQuery === preset
                  ? 'bg-red-950/70 text-red-300 border-red-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: PREPROCESSING */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222634] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-red-400 tracking-wider">Step 1</span>
            <h2 className="text-base font-semibold text-white">Text Ingestion &amp; Preprocessing</h2>
            <p className="text-xs text-slate-400">Lowercasing, punctuation stripping, NLTK stop-words removal, and Porter stemming</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            {processed.reductionPercentage}% Token Reduction
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Phase 1 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">1. Noise Stripped</span>
            <div className="p-2 bg-[#12151f] rounded border border-[#222634] text-xs font-mono text-slate-300 min-h-[50px] break-words">
              {processed.noiseRemoved || '<empty>'}
            </div>
            <p className="text-[11px] text-slate-500">Lowercased, non-words removed</p>
          </div>

          {/* Phase 2 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1.5">
            <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">2. Token Stream ({processed.tokens.length})</span>
            <div className="p-2 bg-[#12151f] rounded border border-[#222634] text-xs font-mono text-slate-300 min-h-[50px] flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {processed.tokens.map((t, i) => (
                <span key={i} className="bg-slate-800 px-1 py-0.2 rounded text-[11px]">{t}</span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">Whitespace tokenization</p>
          </div>

          {/* Phase 3 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">3. Stop-words ({processed.stopWordsRemoved.length})</span>
            <div className="p-2 bg-[#12151f] rounded border border-[#222634] text-xs font-mono text-amber-300 min-h-[50px] flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {processed.stopWordsRemoved.map((t, i) => (
                <span key={i} className="bg-amber-950/40 px-1 py-0.2 rounded text-[11px] border border-amber-900/40">{t}</span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">179 NLTK words discarded</p>
          </div>

          {/* Phase 4 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">4. Porter Stems ({uniqueStems.length})</span>
            <div className="p-2 bg-[#12151f] rounded border border-[#222634] text-xs font-mono text-emerald-300 min-h-[50px] flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {uniqueStems.map((stem, i) => (
                <span key={i} className="bg-emerald-950/50 px-1.5 py-0.2 rounded text-[11px] border border-emerald-900/50 font-bold">{stem}</span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">Morphological root forms</p>
          </div>
        </div>
      </div>

      {/* STEP 2: SEARCH INDEXERS */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
        <div className="border-b border-[#222634] pb-3">
          <span className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">Step 2</span>
          <h2 className="text-base font-semibold text-white">Dual-Track Index Representations</h2>
          <p className="text-xs text-slate-400">Sparse lexical indexing (Inverted index, BM25) and dense continuous neural representations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sparse Postings Dictionary */}
          <div className="p-4 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                <span>Sparse Inverted Index Lookup for Query Stems</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Vocabulary: {tfidfEngine.getVocabularySize()} terms</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uniqueStems.length === 0 ? (
                <p className="text-xs text-slate-500">No stems to look up.</p>
              ) : (
                uniqueStems.map(stem => {
                  const entry = invertedIndex[stem];
                  return (
                    <div key={stem} className="p-2 bg-[#12151f] border border-[#222634] rounded flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-amber-400 font-bold">{stem}</span>
                        {entry ? (
                          <span className="text-slate-400 text-[11px] ml-2">({entry.df} docs containing stem)</span>
                        ) : (
                          <span className="text-slate-500 text-[11px] ml-2">(not in vocabulary)</span>
                        )}
                      </div>
                      <div>
                        {entry ? (
                          <span className="text-emerald-400 font-semibold">IDF: {entry.idf.toFixed(3)}</span>
                        ) : (
                          <span className="text-slate-600">IDF: 0</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              BM25Okapi scoring: score(d) = ∑ IDF(qᵢ) · (f(qᵢ,d) · (k₁+1)) / (f(qᵢ,d) + k₁·(1-b + b·|d|/avgdl))
            </p>
          </div>

          {/* Dense Semantic Vectors */}
          <div className="p-4 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Dense Neural Vector Embedding</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">48-dim Latent Space</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Encodes the semantic meaning of the query into a continuous high-dimensional vector. Evaluated against document embeddings using cosine similarity to capture conceptual matches without exact keywords.
            </p>

            <div className="p-2.5 bg-[#12151f] border border-[#222634] rounded space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Vector Dimension:</span>
                <strong className="text-white">48</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Similarity Metric:</span>
                <strong className="text-purple-400">Cosine Similarity (Normalized Dot Product)</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Overcomes vocabulary mismatch (e.g., &quot;central bank&quot; matching &quot;monetary policy&quot;)
            </p>
          </div>
        </div>
      </div>

      {/* STEP 3: RECIPROCAL RANK FUSION */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
        <div className="border-b border-[#222634] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">Step 3</span>
            <h2 className="text-base font-semibold text-white">Reciprocal Rank Fusion (RRF)</h2>
            <p className="text-xs text-slate-400">Combines ordinal rank positions from BM25 and Dense models without uncalibrated score normalization</p>
          </div>

          <div className="p-2 bg-[#0a0c12] rounded border border-[#262b3a] font-mono text-xs text-slate-300 self-start sm:self-auto">
            <span className="text-amber-400 font-bold">RRF(d)</span> = 1/(60 + r_BM25) + 1/(60 + r_Dense)
          </div>
        </div>

        {/* 3-Column Demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Column 1: BM25 Top 3 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-2 font-mono tabular-nums">
            <div className="flex justify-between items-center text-xs border-b border-[#222634] pb-1.5">
              <span className="text-sky-400 font-bold uppercase tracking-wider">1. Sparse BM25</span>
              <span className="text-slate-500 text-[10px]">Top 3</span>
            </div>
            <div className="space-y-1.5">
              {liveBm25Top.map((res) => (
                <div key={res.docId} className="p-2 bg-[#12151f] border border-[#222634] rounded space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-sky-400">Rank #{res.rank}</span>
                    <span className="text-slate-400 text-[11px] font-semibold">{res.score.toFixed(2)}</span>
                  </div>
                  <p className="font-serif text-xs font-semibold text-white truncate news-headline">{res.document.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Dense Top 3 */}
          <div className="p-3.5 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-2 font-mono tabular-nums">
            <div className="flex justify-between items-center text-xs border-b border-[#222634] pb-1.5">
              <span className="text-purple-400 font-bold uppercase tracking-wider">2. Dense Semantic</span>
              <span className="text-slate-500 text-[10px]">Top 3</span>
            </div>
            <div className="space-y-1.5">
              {liveDenseTop.map((res) => (
                <div key={res.docId} className="p-2 bg-[#12151f] border border-[#222634] rounded space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-purple-400">Rank #{res.rank}</span>
                    <span className="text-slate-400 text-[11px] font-semibold">{res.score.toFixed(3)}</span>
                  </div>
                  <p className="font-serif text-xs font-semibold text-white truncate news-headline">{res.document.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Hybrid Fused Top 3 */}
          <div className="p-3.5 bg-red-950/20 border border-red-900/50 rounded-lg space-y-2 font-mono tabular-nums">
            <div className="flex justify-between items-center text-xs border-b border-red-900/40 pb-1.5">
              <span className="text-red-400 font-bold uppercase tracking-wider">3. Merged Hybrid RRF</span>
              <span className="text-red-300 text-[10px]">Top 3</span>
            </div>
            <div className="space-y-1.5">
              {liveRrfTop.map((res) => (
                <div key={res.docId} className="p-2 bg-[#12151f] border border-red-900/60 rounded space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-red-400">Final #{res.rank}</span>
                    <span className="text-red-300 font-bold text-[11px]">{res.score.toFixed(5)}</span>
                  </div>
                  <p className="font-serif text-xs font-semibold text-white truncate news-headline">{res.document.title}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>BM25: #{res.sparseRank}</span>
                    <span>Dense: #{res.denseRank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
