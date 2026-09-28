import { BBCDocument, SearchResult } from '../types/ir';
import { tokenizeAndStem } from './preprocessor';

// Conceptual latent semantic dimension anchors
const LATENT_DIMENSIONS: { name: string; anchors: string[] }[] = [
  // Economics / Banking
  { name: 'macroeconomics', anchors: ['interest', 'rate', 'inflat', 'bank', 'monetari', 'currenc', 'yield', 'borrow', 'polici'] },
  { name: 'corporate_finance', anchors: ['merger', 'revenu', 'profit', 'stock', 'share', 'investor', 'ftse', 'valuat', 'acquisit'] },
  { name: 'commodities', anchors: ['oil', 'crude', 'barrel', 'energi', 'fuel', 'brent', 'opec', 'inventori', 'suppli'] },
  { name: 'consumer_retail', anchors: ['retail', 'consum', 'groceri', 'purchas', 'sale', 'expenditur', 'confid', 'household'] },
  { name: 'fiscal_treasury', anchors: ['treasuri', 'deficit', 'budget', 'tax', 'debt', 'borrow', 'chancellor', 'spend', 'sovereign'] },

  // Entertainment / Media
  { name: 'cinema_film', anchors: ['film', 'bafta', 'movi', 'cinema', 'director', 'screenplay', 'actress', 'biograph', 'drama'] },
  { name: 'streaming_media', anchors: ['stream', 'subscrib', 'platform', 'seri', 'syndic', 'televis', 'broadcast', 'studio'] },
  { name: 'music_industry', anchors: ['grammi', 'music', 'album', 'songwrit', 'record', 'rhythm', 'blues', 'perform', 'royalti'] },
  { name: 'theatre_stage', anchors: ['theatr', 'west', 'end', 'music', 'stage', 'ticket', 'box', 'offic', 'broadway', 'reviv'] },
  { name: 'vfx_creative_ai', anchors: ['cgi', 'anim', 'visual', 'effect', 'union', 'render', 'artist', 'generat', 'video'] },

  // Politics / Governance
  { name: 'healthcare_nhs', anchors: ['health', 'nhs', 'hospit', 'doctor', 'medic', 'care', 'reform', 'patient', 'clinic'] },
  { name: 'electoral_systems', anchors: ['elect', 'vote', 'ballot', 'proport', 'parliament', 'mps', 'constitut', 'plural'] },
  { name: 'environmental_law', anchors: ['environ', 'river', 'water', 'sewag', 'pollut', 'ecolog', 'sanction', 'util'] },
  { name: 'transport_public', anchors: ['rail', 'transport', 'train', 'franchis', 'ticket', 'committ', 'nation'] },
  { name: 'local_government', anchors: ['council', 'tax', 'municip', 'social', 'care', 'precept', 'whitehal', 'author'] },

  // Sport
  { name: 'association_football', anchors: ['premier', 'leagu', 'derbi', 'volley', 'stoppag', 'manag', 'tactic', 'goal', 'footbal', 'stadium'] },
  { name: 'tennis_wimbledon', anchors: ['wimbledon', 'tenni', 'court', 'grass', 'umpir', 'purser', 'line', 'prize', 'slam'] },
  { name: 'olympics_athletics', anchors: ['olymp', 'athlet', 'sprint', 'marathon', 'medal', 'hurdl', 'biomechan', 'track', 'split'] },
  { name: 'rugby_union', anchors: ['rugbi', 'six', 'nation', 'scrum', 'drop', 'goal', 'turnov', 'forward', 'murrayfield'] },
  { name: 'motorsport_f1', anchors: ['formula', 'grand', 'prix', 'aerodynam', 'sidepod', 'vortex', 'porpois', 'construct', 'circuit'] },

  // Tech / AI / Cybersecurity
  { name: 'neural_ir_ai', anchors: ['neural', 'semant', 'retriev', 'transform', 'dens', 'vector', 'search', 'model', 'bm25', 'rrf', 'llm'] },
  { name: 'cybersecurity', anchors: ['cybersecur', 'vulner', 'patch', 'zero', 'day', 'exploit', 'exfiltrat', 'firmwar', 'firewal', 'threat'] },
  { name: 'quantum_tech', anchors: ['quantum', 'qubit', 'fault', 'toler', 'error', 'correct', 'cryptograph', 'simul', 'supercomput'] },
  { name: 'hardware_npu', anchors: ['smartphone', 'npu', 'chipset', 'biometr', 'handset', 'batteri', 'privaci', 'system', 'on', 'chip'] },
  { name: 'opensource_licensing', anchors: ['open', 'sourc', 'licens', 'repositori', 'scrap', 'maintain', 'copyleft', 'permiss'] }
];

export class DenseEngine {
  private documents: BBCDocument[] = [];
  private docEmbeddings: Map<string, number[]> = new Map();
  private vectorDim: number = LATENT_DIMENSIONS.length;

  constructor(docs: BBCDocument[]) {
    this.indexDocuments(docs);
  }

  public indexDocuments(docs: BBCDocument[]): void {
    this.documents = docs;
    this.docEmbeddings.clear();

    for (const doc of docs) {
      const fullText = `${doc.title} ${doc.body}`;
      const embedding = this.encodeText(fullText);
      this.docEmbeddings.set(doc.id, embedding);
    }
  }

  /**
   * Projects input text into normalized dense continuous embedding vector
   * Simulates all-MiniLM-L6-v2 sentence transformer dense projection
   */
  public encodeText(text: string): number[] {
    const tokens = tokenizeAndStem(text);
    const tokenSet = new Set(tokens);
    const vector = new Array(this.vectorDim).fill(0.01); // base low ambient activation

    LATENT_DIMENSIONS.forEach((dim, dimIdx) => {
      let activation = 0;
      for (const anchor of dim.anchors) {
        if (tokenSet.has(anchor)) {
          activation += 1.5;
        } else {
          // Substring / morphological affinity
          for (const token of tokens) {
            if (token.includes(anchor) || anchor.includes(token)) {
              activation += 0.5;
            }
          }
        }
      }
      vector[dimIdx] += activation;
    });

    // L2 Normalize
    let sumSquares = 0;
    for (let i = 0; i < this.vectorDim; i++) {
      sumSquares += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSquares) || 1e-9;
    return vector.map(v => v / norm);
  }

  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dot));
  }

  public search(query: string, topN: number = 10): SearchResult[] {
    if (!query.trim()) return [];

    const queryVec = this.encodeText(query);
    const queryTokens = tokenizeAndStem(query);

    const scoredDocs: { doc: BBCDocument; score: number; matchedTerms: string[] }[] = [];

    for (const doc of this.documents) {
      const docVec = this.docEmbeddings.get(doc.id);
      if (!docVec) continue;

      const sim = this.cosineSimilarity(queryVec, docVec);
      const docTokens = tokenizeAndStem(doc.title + ' ' + doc.body);
      const matched = queryTokens.filter(t => docTokens.includes(t));

      scoredDocs.push({
        doc,
        score: sim,
        matchedTerms: matched
      });
    }

    // Sort descending by cosine similarity
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
    if (matchedTerms.length > 0) {
      for (const s of sentences) {
        const sTokens = tokenizeAndStem(s);
        if (matchedTerms.some(term => sTokens.includes(term))) {
          return s.length > 200 ? s.slice(0, 197) + '...' : s;
        }
      }
    }
    return sentences[0] || body.slice(0, 180) + '...';
  }
}
