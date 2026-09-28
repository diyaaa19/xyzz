import { BBCDocument, BenchmarkQuery } from '../types/ir';

export const BBC_DOCUMENTS: BBCDocument[] = [
  // --- BUSINESS ---
  {
    id: 'bbc_biz_01',
    category: 'business',
    title: 'Bank of England raises interest rates to tame persistent inflation',
    author: 'Economic Bureau, London',
    date: '14 Oct 2024',
    body: 'The Monetary Policy Committee voted by a decisive majority to increase benchmark interest rates by a quarter percentage point. Governor Andrew Bailey stressed that persistent core services inflation and strong wage growth necessitate sustained monetary tightening. Financial markets responded with a jump in short-term gilt yields and sterling appreciation against the US dollar. Retail banks promptly passed the rate hike on to variable mortgage holders, sparking warnings from consumer groups regarding household debt burdens and slowing consumer expenditure in the retail sector.'
  },
  {
    id: 'bbc_biz_02',
    category: 'business',
    title: 'Aviation giants announce transatlantic airline merger to counter fuel costs',
    author: 'Corporate Markets Desk',
    date: '22 Nov 2024',
    body: 'Global carriers announced a multibillion-pound transatlantic airline merger aimed at streamlining fleet operations and hedging against volatile jet fuel prices. The combined airline entity is anticipated to capture significant market share on prime London-to-New York and Paris routes. However, competition antitrust regulators in Brussels and Washington signaled plans for in-depth scrutiny to ensure fare competition and protect passenger slot allocations at Heathrow and JFK international airports.'
  },
  {
    id: 'bbc_biz_03',
    category: 'business',
    title: 'Crude oil prices tumble as global supply surplus outpaces manufacturing demand',
    author: 'Commodities Analysis Unit',
    date: '03 Dec 2024',
    body: 'Brent crude fell below $72 per barrel following unexpected increases in commercial crude oil inventories and subdued factory activity across major industrial economies. OPEC+ producers deliberated emergency production output cuts, while energy traders cited slowing automotive demand and shifting investment toward renewable energy infrastructure. The drop in oil prices offers temporary relief for corporate supply chains but pressures fiscal revenues for sovereign commodity exporters.'
  },
  {
    id: 'bbc_biz_04',
    category: 'business',
    title: 'FTSE 100 posts record highs driven by banking profits and mining exports',
    author: 'Financial Markets Editor',
    date: '18 Jan 2025',
    body: 'London equities rallied as the benchmark FTSE 100 index touched an all-time record close. Strong corporate earnings from international commercial banks benefiting from expanded net interest margins, paired with robust commodity export demand from emerging markets, propelled the benchmark. Asset managers highlighted renewed institutional investor inflows into UK value equities after months of valuation discounts.'
  },
  {
    id: 'bbc_biz_05',
    category: 'business',
    title: 'Treasury warns of fiscal deficit headwinds ahead of autumn budget statement',
    author: 'Whitehall Economic Team',
    date: '29 Jan 2025',
    body: 'Official government borrowing data revealed an expanding public sector net cash requirement, tightening Chancellor fiscal headroom. The Treasury acknowledged that elevated sovereign debt servicing costs compounded by inflation-linked bonds will require tough public spending choices and potential revenue-raising tax measures in the upcoming autumn statement.'
  },
  {
    id: 'bbc_biz_06',
    category: 'business',
    title: 'Retail sales rebound unexpectedly as consumer confidence shows resilient recovery',
    author: 'Retail & Consumer Bureau',
    date: '05 Feb 2025',
    body: 'British retail trade volumes registered unexpected month-on-month gains, buoyed by promotional sales across clothing and household electronics. Economists noted that easing grocery price inflation and real wage growth have restored consumer discretionary purchasing power, although independent high street retailers continue to face elevated business rates and overhead logistics expenses.'
  },

  // --- ENTERTAINMENT ---
  {
    id: 'bbc_ent_01',
    category: 'entertainment',
    title: 'BAFTA Film Awards celebrate indie drama triumph and breakthrough director honors',
    author: 'Arts & Culture Correspondent',
    date: '19 Feb 2025',
    body: 'The Royal Festival Hall played host to the annual BAFTA Film Awards ceremony, where an intimate low-budget biographical drama swept major categories including Best Picture, Best Original Screenplay, and Leading Actress. Acclaimed directors praised the jury for recognizing auteur storytelling over big-budget franchise blockbusters, noting a cultural renaissance in European independent cinema production.'
  },
  {
    id: 'bbc_ent_02',
    category: 'entertainment',
    title: 'Streaming platform wars intensify as studios curb production budgets and licensing',
    author: 'Media Industry Correspondent',
    date: '02 Mar 2025',
    body: 'Leading entertainment studios and video streaming giants are curtailing content expenditure following years of aggressive subscriber acquisition battles. Media executives emphasize profitability, shifting toward ad-supported subscription tiers, crackdowns on password sharing, and non-exclusive syndication of library television series to third-party broadcasting networks.'
  },
  {
    id: 'bbc_ent_03',
    category: 'entertainment',
    title: 'Grammy Awards showcase electronic and neo-soul artists in landmark ceremony',
    author: 'Music & Performance Desk',
    date: '11 Feb 2025',
    body: 'The music industry celebrated historic moments at the Grammy Awards as pioneering electronic music producers and neo-soul songwriters swept top honours for Album of the Year and Record of the Year. Live tribute performances honored rhythm and blues legends, while discussion panels spotlighted the impact of AI vocal synthesizer tools on songwriting royalties and copyright enforcement.'
  },
  {
    id: 'bbc_ent_04',
    category: 'entertainment',
    title: 'West End theatre attendance surges with musical revivals and star casting',
    author: 'Stage & Performance Reporter',
    date: '25 Jan 2025',
    body: 'London theatre district reported unprecedented box office revenues for classic musical revivals starring Hollywood screen talent. Society of London Theatre noted international tourist audience numbers have returned to pre-pandemic peaks, though venue operators warned that energy overheads and production engineering costs have driven premium ticket price tiers to historic peaks.'
  },
  {
    id: 'bbc_ent_05',
    category: 'entertainment',
    title: 'Hollywood visual effects artists vote to unionize amid generative video concerns',
    author: 'Cinema & Labor Reporter',
    date: '17 Dec 2024',
    body: 'Visual effects and CGI specialists at premier Hollywood animation studios voted overwhelmingly to ratify union representation. Key collective bargaining demands centered on mandatory overtime caps, sustainable production turnaround deadlines, and explicit contractual clauses prohibiting unauthorized training of generative video algorithms on artist concept renders.'
  },

  // --- POLITICS ---
  {
    id: 'bbc_pol_01',
    category: 'politics',
    title: 'Prime Minister defends landmark public sector NHS funding and healthcare reform bill',
    author: 'Westminster Political Team',
    date: '12 Jan 2025',
    body: 'During heated Prime Ministers Questions at the House of Commons, government leadership defended a sweeping National Health Service investment reform bill. The legislation pledges capital funding for hospital diagnostic equipment and expanded medical training places, while the parliamentary opposition criticized bureaucratic reorganization and demanded immediate measures to resolve doctor pay disputes.'
  },
  {
    id: 'bbc_pol_02',
    category: 'politics',
    title: 'Electoral reform debate reignites over proportional representation voting system',
    author: 'Parliamentary Affairs Bureau',
    date: '04 Feb 2025',
    body: 'Cross-party MPs and constitutional reform advocacy campaigns launched a national consultation promoting proportional representation voting over the traditional first-past-the-post electoral system. Proponents argued single-member plurality disenfranchises millions of minor-party voters, while traditionalists argued first-past-the-post delivers decisive parliamentary majorities and direct local constituency accountability.'
  },
  {
    id: 'bbc_pol_03',
    category: 'politics',
    title: 'Government unveils stricter environmental regulations on industrial river discharges',
    author: 'Environmental Policy Editor',
    date: '19 Nov 2024',
    body: 'The Environment Secretary announced stringent civil and criminal sanctions for water utility monopolies discharging untreated storm sewage into domestic rivers and coastal waterways. The policy framework introduces mandatory continuous real-time water quality monitoring sensors and ring-fences infrastructure investment penalties to rehabilitate regional river catchment ecologies.'
  },
  {
    id: 'bbc_pol_04',
    category: 'politics',
    title: 'Cross-party consensus emerges on public transport nationalization roadmap',
    author: 'Transport & Infrastructure Team',
    date: '08 Jan 2025',
    body: 'A bipartisan select committee report recommended bringing passenger rail operating companies under unified public control upon expiration of existing private contracts. Lawmakers argued integrated ticketing, synchronized timetable scheduling, and direct public oversight would yield substantial cost efficiencies and eliminate contentious franchise operator subsidy disputes.'
  },
  {
    id: 'bbc_pol_05',
    category: 'politics',
    title: 'Local council elections deliver major swings amid council tax and social care debates',
    author: 'Electoral Analysis Desk',
    date: '09 May 2024',
    body: 'Local government elections across England resulted in widespread council control changes as voters reacted to escalating municipal council tax precepts and strained adult social care budgets. Local political leaders urged Whitehall to deliver multi-year funding settlements rather than relying on stopgap emergency grants to prevent local authority insolvency.'
  },

  // --- SPORT ---
  {
    id: 'bbc_spt_01',
    category: 'sport',
    title: 'Premier League title race tightens after dramatic stoppage-time derby thriller',
    author: 'Football Correspondent, Manchester',
    date: '15 Feb 2025',
    body: 'An unforgettable 96th-minute curling volley secured a dramatic derby victory, narrowing the Premier League title race to a single point between the top two contenders. Tactical masterclasses by both managers showcased aggressive high-press counter-attacks and disciplined defensive shape, setting up a thrilling finale for football fans heading into the final matches of the season.'
  },
  {
    id: 'bbc_spt_02',
    category: 'sport',
    title: 'Wimbledon championship confirms record prize money and electronic line calling rollout',
    author: 'Tennis Desk, SW19',
    date: '28 Jan 2025',
    body: 'The All England Lawn Tennis Club announced an expanded total prize purse for the upcoming Wimbledon Championships alongside the full replacement of traditional on-court line judges with automated electronic line-calling technology across all tournament courts. Club officials highlighted player demand for uniform decision precision while maintaining historic Centre Court traditions.'
  },
  {
    id: 'bbc_spt_03',
    category: 'sport',
    title: 'Olympic athletics squad announces marathon and sprint medal hopefuls',
    author: 'Athletics & Olympic Bureau',
    date: '14 Dec 2024',
    body: 'National athletics selectors published the finalized track and field squad for the summer games, featuring European sprint champions and emerging marathon distance runners. High-performance sports directors praised biomechanics data analytics and altitude training camps in Kenya for sharpening split times across the 100m, 400m hurdles, and 10,000m events.'
  },
  {
    id: 'bbc_spt_04',
    category: 'sport',
    title: 'Six Nations rugby championship opens with bruising forward battle and drop-goal drama',
    author: 'Rugby Union Correspondent, Edinburgh',
    date: '01 Feb 2025',
    body: 'The Six Nations championship kicked off with an intense forward-dominated tactical clash in damp conditions. Powerful scrummaging, defensive breakdown turnovers, and a decisive late drop-goal sealed victory for the hosts in front of a jubilant capacity crowd at Murrayfield, underscoring the parity and physical intensity of international rugby.'
  },
  {
    id: 'bbc_spt_05',
    category: 'sport',
    title: 'Formula One engineering teams unveil radical aerodynamic sidepod redesigns',
    author: 'Motorsport Correspondent, Silverstone',
    date: '10 Feb 2025',
    body: 'Grand Prix constructors unveiled radical floor ground-effect and sidepod aerodynamic configurations ahead of pre-season testing. Chief technical directors explained that vortex flow management and weight distribution adjustments aim to eliminate high-speed porpoising while unlocking crucial tenths of a second through medium-speed corners.'
  },

  // --- TECH ---
  {
    id: 'bbc_tch_01',
    category: 'tech',
    title: 'Generative AI search engines challenge traditional keyword information retrieval',
    author: 'Technology & AI Reporter, San Francisco',
    date: '18 Jan 2025',
    body: 'Next-generation neural information retrieval models combining dense semantic vector search, reciprocal rank fusion, and large language models are transforming how internet users query knowledge. Researchers point out that while sparse algorithms like BM25 excel at exact keyword precision, dense sentence transformers capture conceptual intent and complex natural language semantic relations.'
  },
  {
    id: 'bbc_tch_02',
    category: 'tech',
    title: 'Cybersecurity agencies warn of zero-day vulnerabilities in cloud enterprise software',
    author: 'Cyber Threat Intelligence Team',
    date: '03 Feb 2025',
    body: 'Global cybersecurity defense centers issued critical advisory alerts regarding active exploitation of an unauthenticated remote code execution vulnerability in enterprise cloud servers. Network administrators were urged to apply emergency firmware patches, enforce strict multi-factor authentication, and monitor outbound telemetry for indicators of compromised credential exfiltration.'
  },
  {
    id: 'bbc_tch_03',
    category: 'tech',
    title: 'Quantum computing lab achieves breakthrough fault-tolerant logical qubit milestone',
    author: 'Deep Tech & Science Desk',
    date: '27 Jan 2025',
    body: 'Physicists and quantum computer scientists reported achieving fault-tolerant logical qubits with quantum error correction operating below critical physical error thresholds. The milestone paves the way toward scalable quantum simulation of molecular catalysts, superconducting materials, and cryptographic factorization algorithms far exceeding classical supercomputers.'
  },
  {
    id: 'bbc_tch_04',
    category: 'tech',
    title: 'Smartphone manufacturers embrace on-device neural processing units for privacy',
    author: 'Consumer Hardware Editor',
    date: '14 Feb 2025',
    body: 'Leading mobile chipmakers demonstrated next-generation system-on-chip architectures incorporating dedicated neural processing units capable of executing generative vision and voice models locally on handsets. Hardware engineers noted that on-device processing minimizes battery drain, removes cloud server latency, and ensures sensitive biometric user data never leaves consumer devices.'
  },
  {
    id: 'bbc_tch_05',
    category: 'tech',
    title: 'Open-source software foundations confront licensing disputes over AI model training',
    author: 'Open Source & Dev Policy Desk',
    date: '20 Dec 2024',
    body: 'Prominent open-source software foundations introduced amended copyleft and permissive license provisions prohibiting unauthorized scraping of public code repositories for commercial machine learning model weights without explicit attribution or compensation for original maintainers, triggering fierce debate within the software engineering community.'
  }
];

/**
 * Benchmark test query set with standardized relevance judgments (qrels)
 * Scale: 3 = Highly Relevant, 2 = Relevant, 1 = Marginally Relevant, 0 = Non-relevant
 */
export const BENCHMARK_QUERIES: BenchmarkQuery[] = [
  {
    id: 'Q1',
    query: 'central bank monetary policy and interest rate hikes to curb inflation',
    category: 'business',
    description: 'Queries addressing monetary policy, interest rates, central bank decisions, and inflation control.',
    expectedKeywords: ['bank', 'interest', 'rate', 'inflat', 'monetari', 'polici'],
    relevanceJudgments: [
      { docId: 'bbc_biz_01', relevance: 3 }, // Bank of England rate hike
      { docId: 'bbc_biz_05', relevance: 2 }, // Treasury fiscal deficit & debt costs
      { docId: 'bbc_biz_04', relevance: 2 }, // FTSE 100 bank profits / interest margins
      { docId: 'bbc_biz_06', relevance: 1 }, // Retail sales & grocery price inflation
      { docId: 'bbc_pol_01', relevance: 0 },
      { docId: 'bbc_tch_01', relevance: 0 }
    ]
  },
  {
    id: 'Q2',
    query: 'neural search engine information retrieval dense semantic embeddings',
    category: 'tech',
    description: 'Queries focused on information retrieval architectures, BM25, neural dense search, and AI.',
    expectedKeywords: ['search', 'engin', 'inform', 'retriev', 'dens', 'semant', 'ai'],
    relevanceJudgments: [
      { docId: 'bbc_tch_01', relevance: 3 }, // Generative AI search engines & dense IR
      { docId: 'bbc_tch_05', relevance: 2 }, // AI model training on open source code
      { docId: 'bbc_tch_04', relevance: 1 }, // On-device neural processing units
      { docId: 'bbc_ent_05', relevance: 1 }, // Hollywood generative video algorithms
      { docId: 'bbc_biz_01', relevance: 0 },
      { docId: 'bbc_spt_01', relevance: 0 }
    ]
  },
  {
    id: 'Q3',
    query: 'premier league football title race stoppage time derby matches',
    category: 'sport',
    description: 'Queries investigating association football, Premier League championships, and derby games.',
    expectedKeywords: ['premier', 'leagu', 'titl', 'race', 'derbi', 'match', 'stoppag'],
    relevanceJudgments: [
      { docId: 'bbc_spt_01', relevance: 3 }, // Premier League derby thriller
      { docId: 'bbc_spt_04', relevance: 1 }, // Six Nations rugby battle
      { docId: 'bbc_spt_03', relevance: 1 }, // Olympic athletics squad
      { docId: 'bbc_biz_04', relevance: 0 },
      { docId: 'bbc_ent_01', relevance: 0 }
    ]
  },
  {
    id: 'Q4',
    query: 'film awards ceremony independent cinema and director recognition',
    category: 'entertainment',
    description: 'Queries seeking cinematic awards, BAFTA, independent film accolades, and directors.',
    expectedKeywords: ['film', 'award', 'ceremoni', 'independ', 'cinema', 'director'],
    relevanceJudgments: [
      { docId: 'bbc_ent_01', relevance: 3 }, // BAFTA Film Awards drama triumph
      { docId: 'bbc_ent_03', relevance: 2 }, // Grammy awards ceremony
      { docId: 'bbc_ent_05', relevance: 2 }, // Hollywood visual effects artists
      { docId: 'bbc_ent_04', relevance: 1 }, // West End theatre musical revivals
      { docId: 'bbc_pol_01', relevance: 0 }
    ]
  },
  {
    id: 'Q5',
    query: 'public healthcare national health service funding and hospital reform',
    category: 'politics',
    description: 'Queries exploring NHS hospital funding, government health legislation, and healthcare debates.',
    expectedKeywords: ['public', 'healthcar', 'nation', 'health', 'servic', 'fund', 'hospit'],
    relevanceJudgments: [
      { docId: 'bbc_pol_01', relevance: 3 }, // Prime Minister defends NHS bill
      { docId: 'bbc_pol_05', relevance: 2 }, // Local council social care budgets
      { docId: 'bbc_pol_04', relevance: 1 }, // Public transport nationalization
      { docId: 'bbc_biz_05', relevance: 1 }, // Treasury fiscal public spending
      { docId: 'bbc_spt_02', relevance: 0 }
    ]
  },
  {
    id: 'Q6',
    query: 'cybersecurity zero-day vulnerability network server patch exploit',
    category: 'tech',
    description: 'Queries exploring enterprise cybersecurity threats, zero-day vulnerabilities, and data defense.',
    expectedKeywords: ['cybersecur', 'zero', 'day', 'vulner', 'server', 'patch', 'exploit'],
    relevanceJudgments: [
      { docId: 'bbc_tch_02', relevance: 3 }, // Cybersecurity zero-day alert
      { docId: 'bbc_tch_03', relevance: 1 }, // Quantum cryptography factorization
      { docId: 'bbc_tch_04', relevance: 1 }, // On-device biometric privacy
      { docId: 'bbc_biz_02', relevance: 0 }
    ]
  },
  {
    id: 'Q7',
    query: 'crude oil commodity price drops and energy production surplus',
    category: 'business',
    description: 'Queries related to petroleum markets, Brent crude prices, and OPEC energy supply.',
    expectedKeywords: ['crude', 'oil', 'commod', 'price', 'energi', 'product', 'surplus'],
    relevanceJudgments: [
      { docId: 'bbc_biz_03', relevance: 3 }, // Crude oil prices tumble
      { docId: 'bbc_biz_02', relevance: 2 }, // Airline merger fuel costs hedging
      { docId: 'bbc_biz_04', relevance: 1 }, // Mining and commodity exports
      { docId: 'bbc_pol_03', relevance: 1 }, // Environmental regulations
      { docId: 'bbc_spt_05', relevance: 0 }
    ]
  },
  {
    id: 'Q8',
    query: 'wimbledon tennis championship electronic line calling and prize purse',
    category: 'sport',
    description: 'Queries concerning tennis grand slam tournaments, automated line calls, and Wimbledon.',
    expectedKeywords: ['wimbledon', 'tenni', 'championship', 'electron', 'line', 'call', 'prize'],
    relevanceJudgments: [
      { docId: 'bbc_spt_02', relevance: 3 }, // Wimbledon electronic line calling & prize money
      { docId: 'bbc_spt_03', relevance: 1 }, // Olympic sprint and marathon squad
      { docId: 'bbc_spt_01', relevance: 1 }, // Premier League soccer derby
      { docId: 'bbc_ent_04', relevance: 0 }
    ]
  }
];
