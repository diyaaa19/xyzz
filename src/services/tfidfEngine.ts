import { BBCDocument, InvertedIndex, SearchResult } from '../types/ir';
import { tokenizeAndStem } from './preprocessor';

export class TfidfEngine {
  private documents: BBCDocument[] = [];
  private invertedIndex: InvertedIndex = {};
  private docVectors: Map<string, Map<string, number>> = new Map();
  private docNorms: Map<string, number> = new Map();
  private docLengths: Map<string, number> = new Map();

  constructor(docs: BBCDocument[]) {
    this.indexDocuments(docs);
  }

  public indexDocuments(docs: BBCDocument[]): void {
    this.documents = docs;
    this.invertedIndex = Object.create(null);
    this.docVectors.clear();
    this.docNorms.clear();
    this.docLengths.clear();

    const N = docs.length;

    // Step 1: Tokenize, stem, and populate postings
    for (const doc of docs) {
      const fullText = `${doc.title} ${doc.title} ${doc.body}`; // Title boosted x2
      const tokens = tokenizeAndStem(fullText);
      this.docLengths.set(doc.id, tokens.length);

      const termCounts = new Map<string, { count: number; positions: number[] }>();
      tokens.forEach((term, idx) => {
        let entry = termCounts.get(term);
        if (!entry) {
          entry = { count: 0, positions: [] };
          termCounts.set(term, entry);
        }
        entry.count += 1;
        entry.positions.push(idx);
      });

      for (const [term, data] of termCounts.entries()) {
        if (!Object.prototype.hasOwnProperty.call(this.invertedIndex, term)) {
          this.invertedIndex[term] = {
            df: 0,
            idf: 0,
            postings: Object.create(null)
          };
        }
        this.invertedIndex[term].df += 1;
        this.invertedIndex[term].postings[doc.id] = {
          docId: doc.id,
          tf: data.count,
          positions: data.positions
        };
      }
    }

    // Step 2: Compute Scikit-Learn smooth IDF: log((N + 1) / (df + 1)) + 1
    for (const term of Object.keys(this.invertedIndex)) {
      const df = this.invertedIndex[term].df;
      this.invertedIndex[term].idf = Math.log((N + 1) / (df + 1)) + 1;
    }

    // Step 3: Compute L2-normalized TF-IDF vector for every document
    for (const doc of docs) {
      const vec = new Map<string, number>();
      let sumSquares = 0;

      for (const [term, entry] of Object.entries(this.invertedIndex)) {
        const posting = entry.postings[doc.id];
        if (posting) {
          // Sublinear TF scaling: 1 + log(tf)
          const tf = 1 + Math.log(posting.tf);
          const tfidf = tf * entry.idf;
          vec.set(term, tfidf);
          sumSquares += tfidf * tfidf;
        }
      }

      const norm = Math.sqrt(sumSquares) || 1e-9;
      this.docVectors.set(doc.id, vec);
      this.docNorms.set(doc.id, norm);
    }
  }

  public search(query: string, topN: number = 10): SearchResult[] {
    const queryTokens = tokenizeAndStem(query);
    if (queryTokens.length === 0) return [];

    // Query term counts using Map to prevent prototype collision
    const qTermCounts = new Map<string, number>();
    for (const t of queryTokens) {
      qTermCounts.set(t, (qTermCounts.get(t) || 0) + 1);
    }

    // Query TF-IDF vector
    const qVec = new Map<string, number>();
    let qSumSquares = 0;
    for (const [term, count] of qTermCounts.entries()) {
      if (Object.prototype.hasOwnProperty.call(this.invertedIndex, term)) {
        const entry = this.invertedIndex[term];
        if (entry) {
          const tf = 1 + Math.log(count);
          const tfidf = tf * entry.idf;
          qVec.set(term, tfidf);
          qSumSquares += tfidf * tfidf;
        }
      }
    }
    const qNorm = Math.sqrt(qSumSquares) || 1e-9;

    // Score documents via Cosine Similarity
    const scoredDocs: { doc: BBCDocument; score: number; matchedTerms: string[] }[] = [];

    for (const doc of this.documents) {
      const dVec = this.docVectors.get(doc.id);
      const dNorm = this.docNorms.get(doc.id) || 1;
      if (!dVec) continue;

      let dotProduct = 0;
      const matchedTerms: string[] = [];

      for (const [term, qWeight] of qVec.entries()) {
        const dWeight = dVec.get(term);
        if (dWeight !== undefined && dWeight > 0) {
          dotProduct += qWeight * dWeight;
          matchedTerms.push(term);
        }
      }

      const cosineSim = dotProduct / (qNorm * dNorm);
      if (cosineSim > 0.0001) {
        scoredDocs.push({
          doc,
          score: cosineSim,
          matchedTerms
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

  public getInvertedIndex(): InvertedIndex {
    return this.invertedIndex;
  }

  public getVocabularySize(): number {
    return Object.keys(this.invertedIndex).length;
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
