import { PreprocessingStepResult } from '../types/ir';

// Standard NLTK English Stopwords (179 words)
export const NLTK_STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've",
  "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
  'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
  'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did',
  'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
  'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're',
  've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't",
  'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't",
  'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't",
  'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't",
  'won', "won't", 'wouldn', "wouldn't", 'also', 'said', 'would', 'could', 'mr', 'us',
  'new', 'one', 'two', 'first', 'last'
]);

/**
 * Standard Martin Porter Stemming Algorithm (Step 1a to Step 5b)
 */
export function porterStem(word: string): string {
  let w = word.toLowerCase();
  if (w.length < 3) return w;

  const isConsonant = (str: string, i: number): boolean => {
    const ch = str[i];
    if ('aeiou'.includes(ch)) return false;
    if (ch === 'y') {
      if (i === 0) return true;
      return !isConsonant(str, i - 1);
    }
    return true;
  };

  const getM = (str: string): number => {
    let m = 0;
    let i = 0;
    const len = str.length;
    while (i < len && isConsonant(str, i)) i++;
    while (i < len) {
      while (i < len && !isConsonant(str, i)) i++;
      if (i < len) {
        while (i < len && isConsonant(str, i)) i++;
        m++;
      }
    }
    return m;
  };

  const containsVowel = (str: string): boolean => {
    for (let i = 0; i < str.length; i++) {
      if (!isConsonant(str, i)) return true;
    }
    return false;
  };

  const endsWithDoubleConsonant = (str: string): boolean => {
    const len = str.length;
    if (len < 2) return false;
    return str[len - 1] === str[len - 2] && isConsonant(str, len - 1);
  };

  const cvc = (str: string): boolean => {
    const len = str.length;
    if (len < 3) return false;
    const c1 = isConsonant(str, len - 3);
    const v = !isConsonant(str, len - 2);
    const c2 = isConsonant(str, len - 1);
    const lastChar = str[len - 1];
    return c1 && v && c2 && lastChar !== 'w' && lastChar !== 'x' && lastChar !== 'y';
  };

  // Step 1a
  if (w.endsWith('sses')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('ies')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('ss')) {
    // keep
  } else if (w.endsWith('s')) {
    w = w.slice(0, -1);
  }

  // Step 1b
  let step1bSuccess = false;
  if (w.endsWith('eed')) {
    const stem = w.slice(0, -3);
    if (getM(stem) > 0) {
      w = stem + 'ee';
    }
  } else if (w.endsWith('ed')) {
    const stem = w.slice(0, -2);
    if (containsVowel(stem)) {
      w = stem;
      step1bSuccess = true;
    }
  } else if (w.endsWith('ing')) {
    const stem = w.slice(0, -3);
    if (containsVowel(stem)) {
      w = stem;
      step1bSuccess = true;
    }
  }

  if (step1bSuccess) {
    if (w.endsWith('at') || w.endsWith('bl') || w.endsWith('iz')) {
      w += 'e';
    } else if (endsWithDoubleConsonant(w) && !w.endsWith('l') && !w.endsWith('s') && !w.endsWith('z')) {
      w = w.slice(0, -1);
    } else if (getM(w) === 1 && cvc(w)) {
      w += 'e';
    }
  }

  // Step 1c
  if (w.endsWith('y')) {
    const stem = w.slice(0, -1);
    if (containsVowel(stem)) {
      w = stem + 'i';
    }
  }

  // Step 2
  const step2Pairs: [string, string][] = [
    ['ational', 'ate'], ['tional', 'tion'], ['enci', 'ence'], ['anci', 'ance'],
    ['izer', 'ize'], ['abli', 'able'], ['alli', 'al'], ['entli', 'ent'],
    ['eli', 'e'], ['ousli', 'ous'], ['ization', 'ize'], ['ation', 'ate'],
    ['ator', 'ate'], ['alism', 'al'], ['iveness', 'ive'], ['fulness', 'ful'],
    ['ousness', 'ous'], ['aliti', 'al'], ['iviti', 'ive'], ['biliti', 'ble']
  ];
  for (const [suffix, replacement] of step2Pairs) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (getM(stem) > 0) {
        w = stem + replacement;
      }
      break;
    }
  }

  // Step 3
  const step3Pairs: [string, string][] = [
    ['icate', 'ic'], ['ative', ''], ['alize', 'al'], ['iciti', 'ic'],
    ['ical', 'ic'], ['ful', ''], ['ness', '']
  ];
  for (const [suffix, replacement] of step3Pairs) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (getM(stem) > 0) {
        w = stem + replacement;
      }
      break;
    }
  }

  // Step 4
  const step4Suffixes = [
    'al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement',
    'ment', 'ent', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'
  ];
  for (const suffix of step4Suffixes) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (getM(stem) > 1) {
        w = stem;
      }
      break;
    }
  }
  if (w.endsWith('ion')) {
    const stem = w.slice(0, -3);
    if (getM(stem) > 1 && (stem.endsWith('s') || stem.endsWith('t'))) {
      w = stem;
    }
  }

  // Step 5a
  if (w.endsWith('e')) {
    const stem = w.slice(0, -1);
    const m = getM(stem);
    if (m > 1 || (m === 1 && !cvc(stem))) {
      w = stem;
    }
  }

  // Step 5b
  if (getM(w) > 1 && endsWithDoubleConsonant(w) && w.endsWith('l')) {
    w = w.slice(0, -1);
  }

  return w;
}

/**
 * Executes full Step 1 text preprocessing pipeline:
 * Lowercasing -> Regex Noise/Punctuation Cleaning -> Tokenization -> Stopword Removal -> Stemming
 */
export function preprocessPipeline(rawText: string): PreprocessingStepResult {
  const lowercased = rawText.toLowerCase();

  // Noise cleaning: Remove punctuation, numbers, special characters, normalize spaces
  const noiseRemoved = lowercased
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Tokenization
  const rawTokens = noiseRemoved.split(' ').filter(t => t.length > 1);

  // Stop-word removal
  const stopWordsRemoved = rawTokens.filter(token => !NLTK_STOPWORDS.has(token));

  // Stemming
  const stemmedTokens = stopWordsRemoved.map(token => ({
    original: token,
    stemmed: porterStem(token)
  }));

  const uniqueVocab = new Set(stemmedTokens.map(t => t.stemmed));
  const rawWordCount = rawText.trim().split(/\s+/).length;
  const reductionPercentage = rawWordCount > 0
    ? Math.max(0, Math.round(((rawWordCount - stemmedTokens.length) / rawWordCount) * 100))
    : 0;

  return {
    raw: rawText,
    lowercased,
    noiseRemoved,
    tokens: rawTokens,
    stopWordsRemoved,
    stemmedTokens,
    vocabularySize: uniqueVocab.size,
    reductionPercentage
  };
}

/**
 * Quick helper returning only array of stemmed tokens for indexing & query search
 */
export function tokenizeAndStem(text: string): string[] {
  return preprocessPipeline(text).stemmedTokens.map(t => t.stemmed);
}
