import { BBCDocument, SearchResult } from '../types/ir';
import { tokenizeAndStem } from './preprocessor';

export class BM25Engine {
  private documents: BBCDocument[] = [];
  private docTokens: Map<string, string[]> = new Map();
  private docLengths: Map<string, number> = new Map();
  private docFreqs: Map<string, number> = new Map();
  private idfCache: Map<string, number> = new Map();
  private avgdl: number = 0;
  private k1: number = 1.5;
  private b: number = 0.75;

  constructor(docs: BBCDocument[], k1: number = 1.5, b: number = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.indexDocuments(docs);
  }

  public setParameters(k1: number, b: number): void {
    this.k1 = k1;
    this.b = b;
  }

  public getParameters(): { k1: number; b: number; avgdl: number } {
    return { k1: this.k1, b: this.b, avgdl: Math.round(this.avgdl) };
  }

  public indexDocuments(docs: BBCDocument[]): void {
    this.documents = docs;
    this.docTokens.clear();
    this.docLengths.clear();
    this.docFreqs.clear();
    this.idfCache.clear();

    const N = docs.length;
    let totalLength = 0;

    for (const doc of docs) {
      // Weight title slightly higher by repeating it in document stream
      const tokens = tokenizeAndStem(`${doc.title} ${doc.title} ${doc.body}`);
      this.docTokens.set(doc.id, tokens);
      this.docLengths.set(doc.id, tokens.length);
      totalLength += tokens.length;

      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        this.docFreqs.set(term, (this.docFreqs.get(term) || 0) + 1);
      }
    }

    this.avgdl = N > 0 ? totalLength / N : 0;

    // Standard BM25Okapi IDF: ln((N - df + 0.5) / (df + 0.5) + 1)
    for (const [term, df] of this.docFreqs.entries()) {
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1.0);
      this.idfCache.set(term, Math.max(0, idf));
    }
  }

  public search(query: string, topN: number = 10): SearchResult[] {
    const queryTokens = tokenizeAndStem(query);
    if (queryTokens.length === 0) return [];

    const scoredDocs: { doc: BBCDocument; score: number; matchedTerms: string[] }[] = [];

    for (const doc of this.documents) {
      const tokens = this.docTokens.get(doc.id);
      const docLen = this.docLengths.get(doc.id) || this.avgdl;
      if (!tokens) continue;

      // Count term frequencies in this document
      const termFreqs = new Map<string, number>();
      for (const t of tokens) {
        termFreqs.set(t, (termFreqs.get(t) || 0) + 1);
      }

      let score = 0;
      const matchedTerms: string[] = [];

      for (const qTerm of queryTokens) {
        const tf = termFreqs.get(qTerm) || 0;
        if (tf > 0) {
          const idf = this.idfCache.get(qTerm) || 0;
          // BM25Okapi equation:
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgdl));
          score += idf * (numerator / denominator);
          matchedTerms.push(qTerm);
        }
      }

      if (score > 0) {
        scoredDocs.push({
          doc,
          score,
          matchedTerms: Array.from(new Set(matchedTerms))
        });
      }
    }

    // Sort descending by score
    scoredDocs.sort((a, b) => b.score - a.score);

    return scoredDocs.slice(0, topN).map((item, idx) => ({
      docId: item.doc.id,
      document: item.doc,
      score: Number(item.score.toFixed(4)),
      rank: idx + 1,
      matchedTerms: item.matchedTerms,
      snippet: this.generateSnippet(item.doc.body, item.matchedTerms)
    }));
  }

  private generateSnippet(body: string, matchedTerms: string[]): string {
    const sentences = body.split(/(?<=[.?!])\s+/);
    for (const s of sentences) {
      const sTokens = tokenizeAndStem(s);
      if (matchedTerms.some(term => sTokens.includes(term))) {
        return s.length > 200 ? s.slice(0, 197) + '...' : s;
      }
    }
    return sentences[0] || body.slice(0, 180) + '...';
  }
}
