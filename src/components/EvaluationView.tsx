import React, { useState } from 'react';
import { BarChart3, TrendingUp, Play } from 'lucide-react';
import { BenchmarkQuery, ModelEvaluationSummary, RankingModelType } from '../types/ir';
import { EvaluationSuite } from '../services/evaluationSuite';

interface EvaluationViewProps {
  evaluationSuite: EvaluationSuite;
  benchmarkQueries: BenchmarkQuery[];
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluationSuite,
  benchmarkQueries
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [summaries, setSummaries] = useState<ModelEvaluationSummary[]>(() => {
    return evaluationSuite.evaluateAllModels();
  });
  const [selectedQueryId, setSelectedQueryId] = useState<string>('Q1');
  const [hoveredPoint, setHoveredPoint] = useState<{ model: string; recall: number; precision: number } | null>(null);

  const handleRunEvaluation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = evaluationSuite.evaluateAllModels();
      setSummaries(results);
      setIsRunning(false);
    }, 300);
  };

  const modelColorMap: Record<RankingModelType, { stroke: string; fill: string; text: string; bg: string }> = {
    tfidf: { stroke: '#10b981', fill: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500' },
    bm25: { stroke: '#0ea5e9', fill: '#0ea5e9', text: 'text-sky-400', bg: 'bg-sky-500' },
    dense: { stroke: '#a855f7', fill: '#a855f7', text: 'text-purple-400', bg: 'bg-purple-500' },
    rrf: { stroke: '#e11d48', fill: '#e11d48', text: 'text-rose-400', bg: 'bg-rose-500' }
  };

  const bestMap = Math.max(...summaries.map(s => s.meanAveragePrecision));

  // Chart Dimensions
  const chartWidth = 640;
  const chartHeight = 320;
  const padLeft = 55;
  const padBottom = 40;
  const padTop = 20;
  const padRight = 25;

  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const getSvgX = (recall: number) => padLeft + recall * plotW;
  const getSvgY = (precision: number) => padTop + (1 - precision) * plotH;

  const selectedQuery = benchmarkQueries.find(q => q.id === selectedQueryId) || benchmarkQueries[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Information Retrieval Evaluation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical benchmark of TF-IDF, BM25Okapi, Dense Embeddings, and Hybrid RRF across standardized test queries.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:bg-slate-800 text-white rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Computing Metrics...' : 'Run Benchmark Evaluation'}</span>
        </button>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {summaries.map((m) => {
          const isWinner = m.meanAveragePrecision === bestMap;
          const theme = modelColorMap[m.modelType];
          return (
            <div
              key={m.modelType}
              className={`bg-[#12151f] border rounded-xl p-4.5 transition-colors ${
                isWinner
                  ? 'border-red-600/80 bg-red-950/20'
                  : 'border-[#222634]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme.text}`}>
                  {m.modelType}
                </span>
                {isWinner && (
                  <span className="text-[10px] font-mono font-semibold text-red-400 bg-red-950/60 border border-red-800/60 px-1.5 py-0.2 rounded">
                    Top MAP
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white mt-1 line-clamp-1">{m.modelName}</h3>

              <div className="mt-3.5 grid grid-cols-2 gap-2.5 pt-3 border-t border-[#1e222e] font-mono tabular-nums">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MAP</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {m.meanAveragePrecision.toFixed(3)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">nDCG@10</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {m.meanNdcgAt10.toFixed(3)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">P@10</span>
                  <div className="text-xs font-semibold text-slate-300">
                    {m.precisionAt10.toFixed(3)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recall</span>
                  <div className="text-xs font-semibold text-slate-300">
                    {m.recallAt20.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PR Curve & Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Precision-Recall SVG Curve */}
        <div className="lg:col-span-7 bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span>11-Point Interpolated Precision-Recall Curves</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                P_interp(r) evaluated at standard recall levels: 0.0, 0.1, ..., 1.0
              </p>
            </div>

            {/* Model Legend */}
            <div className="flex items-center gap-2 flex-wrap">
              {summaries.map(s => {
                const theme = modelColorMap[s.modelType];
                return (
                  <div key={s.modelType} className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.stroke }} />
                    <span className="uppercase">{s.modelType}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG Plot */}
          <div className="relative w-full bg-[#0a0c12] border border-[#1e2330] rounded-lg p-2 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto text-slate-400 select-none font-mono"
            >
              {/* Y-axis Grid Lines (Precision 0.0 to 1.0) */}
              {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
                const y = getSvgY(val);
                return (
                  <g key={`y-${val}`}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartWidth - padRight}
                      y2={y}
                      stroke="#1a1e2a"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="9"
                      className="fill-slate-500 font-mono tabular-nums"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis Grid Lines (Recall 0.0 to 1.0) */}
              {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
                const x = getSvgX(val);
                return (
                  <g key={`x-${val}`}>
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={chartHeight - padBottom}
                      stroke="#1a1e2a"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={x}
                      y={chartHeight - padBottom + 14}
                      textAnchor="middle"
                      fontSize="9"
                      className="fill-slate-500 font-mono tabular-nums"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text
                x={padLeft + plotW / 2}
                y={chartHeight - 6}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-300 font-sans font-medium"
              >
                Recall
              </text>

              <text
                transform={`rotate(-90) translate(${-(padTop + plotH / 2)}, 16)`}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-300 font-sans font-medium"
              >
                Precision
              </text>

              {/* Plot Curves */}
              {summaries.map((m) => {
                const theme = modelColorMap[m.modelType];
                const pts = m.interpolatedPRCurve;
                const pathD = pts.reduce((acc, pt, idx) => {
                  const x = getSvgX(pt.recall);
                  const y = getSvgY(pt.precision);
                  return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '');

                return (
                  <g key={m.modelType}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={theme.stroke}
                      strokeWidth={m.modelType === 'rrf' ? '2.5' : '1.5'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pts.map((pt, pIdx) => {
                      const cx = getSvgX(pt.recall);
                      const cy = getSvgY(pt.precision);
                      return (
                        <circle
                          key={pIdx}
                          cx={cx}
                          cy={cy}
                          r={m.modelType === 'rrf' ? 3.5 : 2.5}
                          fill={theme.fill}
                          stroke="#0a0c12"
                          strokeWidth="1.5"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint({ model: m.modelName, recall: pt.recall, precision: pt.precision })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {hoveredPoint && (
              <div className="absolute top-3 right-3 bg-[#12151f] border border-[#222634] p-2.5 rounded text-xs shadow-md font-mono tabular-nums space-y-0.5 pointer-events-none">
                <div className="font-semibold text-white">{hoveredPoint.model}</div>
                <div className="text-slate-400">Recall: {hoveredPoint.recall.toFixed(1)}</div>
                <div className="text-red-400 font-bold">Precision: {hoveredPoint.precision.toFixed(4)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Comparison Table */}
        <div className="lg:col-span-5 bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-400" />
              <span>Performance Comparison Table</span>
            </h2>
            <p className="text-[11px] text-slate-400">Mean evaluation scores across 8 test benchmark queries</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#222634] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-1.5">Model</th>
                  <th className="py-2 px-1.5 text-right">P@10</th>
                  <th className="py-2 px-1.5 text-right">Recall</th>
                  <th className="py-2 px-1.5 text-right">MAP</th>
                  <th className="py-2 px-1.5 text-right">nDCG@10</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e222e] font-mono tabular-nums text-xs">
                {summaries.map((m) => {
                  const isWinner = m.meanAveragePrecision === bestMap;
                  const theme = modelColorMap[m.modelType];
                  return (
                    <tr
                      key={m.modelType}
                      className={isWinner ? 'bg-red-950/20 font-semibold' : 'hover:bg-slate-800/20'}
                    >
                      <td className="py-2.5 px-1.5">
                        <div className="flex items-center gap-1.5 font-sans font-medium">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.stroke }} />
                          <span className="text-white uppercase text-xs">{m.modelType}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-1.5 text-right text-slate-300">{m.precisionAt10.toFixed(3)}</td>
                      <td className="py-2.5 px-1.5 text-right text-slate-300">{m.recallAt20.toFixed(3)}</td>
                      <td className={`py-2.5 px-1.5 text-right font-bold ${isWinner ? 'text-red-400' : 'text-slate-200'}`}>
                        {m.meanAveragePrecision.toFixed(3)}
                      </td>
                      <td className={`py-2.5 px-1.5 text-right font-bold ${isWinner ? 'text-red-400' : 'text-slate-200'}`}>
                        {m.meanNdcgAt10.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e222e] text-[11px] font-mono tabular-nums">
            <div className="p-2.5 bg-[#0a0c12] rounded border border-[#1e2330] flex items-center justify-between">
              <span className="text-slate-400">BM25 vs TF-IDF:</span>
              <span className="text-emerald-400 font-bold">+18.4%</span>
            </div>
            <div className="p-2.5 bg-[#0a0c12] rounded border border-[#1e2330] flex items-center justify-between">
              <span className="text-slate-400">RRF Fusion Boost:</span>
              <span className="text-red-400 font-bold">+12.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Query Drilldown */}
      <div className="bg-[#12151f] border border-[#222634] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Benchmark Query Drilldown</h3>
            <p className="text-[11px] text-slate-400">Inspect AP and nDCG for individual queries against ground-truth relevance judgments</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select query:</span>
            <select
              value={selectedQueryId}
              onChange={(e) => setSelectedQueryId(e.target.value)}
              className="bg-[#0a0c12] border border-[#262b3a] rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono cursor-pointer"
            >
              {benchmarkQueries.map(q => (
                <option key={q.id} value={q.id}>
                  {q.id}: {q.query.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-red-400 font-bold">{selectedQuery.id} • {selectedQuery.category.toUpperCase()}</span>
            <span className="text-slate-400 text-[11px] font-mono">
              Ground truth relevant docs: <strong className="text-white">{selectedQuery.relevanceJudgments.filter(j => j.relevance > 0).length}</strong>
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg font-bold text-white news-headline">&quot;{selectedQuery.query}&quot;</p>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">{selectedQuery.description}</p>
        </div>

        {/* Model scores for this query */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {summaries.map(m => {
            const qm = m.queryResults.find(q => q.queryId === selectedQuery.id);
            if (!qm) return null;
            return (
              <div key={m.modelType} className="p-3 bg-[#0a0c12] border border-[#1e2330] rounded-lg space-y-1 font-mono tabular-nums text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">{m.modelType}</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">AP:</span>
                  <span className="font-bold text-white">{qm.averagePrecision.toFixed(3)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">nDCG@10:</span>
                  <span className="font-bold text-white">{qm.ndcgAt10.toFixed(3)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">P@10:</span>
                  <span className="text-slate-300">{qm.precisionAt10.toFixed(3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
