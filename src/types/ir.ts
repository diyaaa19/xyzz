export type Category = 'business' | 'entertainment' | 'politics' | 'sport' | 'tech';

export type RankingModelType = 'tfidf' | 'bm25' | 'dense' | 'rrf';

export interface BBCDocument {
  id: string;
  category: Category;
  title: string;
  body: string;
  author: string;
  date: string;
  rawWordCount?: number;
  tokens?: string[];
  stemmedTokens?: string[];
  denseVector?: number[];
}

export interface SearchResult {
  docId: string;
  document: BBCDocument;
  score: number;
  rank: number;
  sparseScore?: number;
  sparseRank?: number;
  denseScore?: number;
  denseRank?: number;
  matchedTerms: string[];
  snippet: string;
}

export interface Posting {
  docId: string;
  tf: number;
  positions: number[];
}

export interface InvertedIndex {
  [term: string]: {
    df: number;
    idf: number;
    postings: { [docId: string]: Posting };
  };
}

export interface GroundTruthJudgment {
  docId: string;
  relevance: number; // 0: Not relevant, 1: Marginally, 2: Relevant, 3: Highly relevant
}

export interface BenchmarkQuery {
  id: string;
  query: string;
  category: Category;
  description: string;
  expectedKeywords: string[];
  relevanceJudgments: GroundTruthJudgment[];
}

export interface PRCurvePoint {
  recall: number;
  precision: number;
}

export interface QueryMetricResult {
  queryId: string;
  queryText: string;
  precisionAt10: number;
  recallAt20: number;
  averagePrecision: number; // AP
  ndcgAt10: number;
  reciprocalRank: number; // RR
  retrievedCount: number;
  relevantCount: number;
  prCurve: PRCurvePoint[];
}

export interface ModelEvaluationSummary {
  modelType: RankingModelType;
  modelName: string;
  precisionAt10: number;
  recallAt20: number;
  meanAveragePrecision: number; // MAP
  meanNdcgAt10: number;
  mrr: number; // Mean Reciprocal Rank
  avgLatencyMs: number;
  interpolatedPRCurve: PRCurvePoint[];
  queryResults: QueryMetricResult[];
}

export interface PreprocessingStepResult {
  raw: string;
  lowercased: string;
  noiseRemoved: string;
  tokens: string[];
  stopWordsRemoved: string[];
  stemmedTokens: { original: string; stemmed: string }[];
  vocabularySize: number;
  reductionPercentage: number;
}
