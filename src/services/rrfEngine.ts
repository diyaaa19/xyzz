import { SearchResult } from '../types/ir';
import { BM25Engine } from './bm25Engine';
import { DenseEngine } from './denseEngine';
import { TfidfEngine } from './tfidfEngine';

export interface RRFConfig {
  k: number; // standard constant, default 60
  sparseModel: 'bm25' | 'tfidf';
}

export class RRFEngine {
  private bm25Engine: BM25Engine;
  private denseEngine: DenseEngine;
  private tfidfEngine: TfidfEngine;
  private k: number = 60;

  constructor(bm25: BM25Engine, dense: DenseEngine, tfidf: TfidfEngine, k: number = 60) {
    this.bm25Engine = bm25;
    this.denseEngine = dense;
    this.tfidfEngine = tfidf;
    this.k = k;
  }

  public setK(k: number): void {
    this.k = k;
  }

  public getK(): number {
    return this.k;
  }

  /**
   * Performs Reciprocal Rank Fusion:
   * RRF_Score(d) = sum_{m in M} 1 / (k + r_m(d))
   */
  public search(
    query: string,
    topN: number = 10,
    sparseType: 'bm25' | 'tfidf' = 'bm25'
  ): SearchResult[] {
    const candidatePool = 25; // query top-N from both engines

    // 1. Query sparse system
    const sparseResults = sparseType === 'bm25'
      ? this.bm25Engine.search(query, candidatePool)
      : this.tfidfEngine.search(query, candidatePool);

    // 2. Query dense system
    const denseResults = this.denseEngine.search(query, candidatePool);

    // Map docId -> rank & score
    const sparseRanks = new Map<string, { rank: number; score: number; result: SearchResult }>();
    sparseResults.forEach((res, idx) => {
      sparseRanks.set(res.docId, { rank: idx + 1, score: res.score, result: res });
    });

    const denseRanks = new Map<string, { rank: number; score: number; result: SearchResult }>();
    denseResults.forEach((res, idx) => {
      denseRanks.set(res.docId, { rank: idx + 1, score: res.score, result: res });
    });

    // 3. Collect unique candidate doc IDs
    const allDocIds = new Set<string>([...sparseRanks.keys(), ...denseRanks.keys()]);

    const fusedList: SearchResult[] = [];

    for (const docId of allDocIds) {
      const sparseData = sparseRanks.get(docId);
      const denseData = denseRanks.get(docId);

      const rSparse = sparseData ? sparseData.rank : 999;
      const rDense = denseData ? denseData.rank : 999;

      // Reciprocal Rank Fusion score:
      // 1 / (k + r_sparse) + 1 / (k + r_dense)
      const sparseContribution = sparseData ? 1.0 / (this.k + rSparse) : 0;
      const denseContribution = denseData ? 1.0 / (this.k + rDense) : 0;
      const rrfScore = sparseContribution + denseContribution;

      // Base doc reference
      const docRef = (sparseData ? sparseData.result.document : denseData?.result.document)!;
      const matchedTerms = Array.from(new Set([
        ...(sparseData?.result.matchedTerms || []),
        ...(denseData?.result.matchedTerms || [])
      ]));

      fusedList.push({
        docId,
        document: docRef,
        score: Number(rrfScore.toFixed(6)),
        rank: 0, // will assign after sorting
        sparseScore: sparseData?.score,
        sparseRank: sparseData?.rank,
        denseScore: denseData?.score,
        denseRank: denseData?.rank,
        matchedTerms,
        snippet: sparseData?.result.snippet || denseData?.result.snippet || ''
      });
    }

    // Sort descending by RRF score
    fusedList.sort((a, b) => b.score - a.score);

    // Assign final hybrid rank
    const topFused = fusedList.slice(0, topN).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    return topFused;
  }
}
