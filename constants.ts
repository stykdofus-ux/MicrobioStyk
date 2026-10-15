import { SampleType, GramStatus, TestType, TestResultValue, Quantity, VaginalExam, ECBUExam } from './types';

export const MEDIA_TYPES = [
  'Blood Agar',
  'Blood Agar + ANC',
  'Chocolate Agar',
  'MacConkey Agar',
  'EMB Agar',
  'CLED Agar',
  'Mannitol Salt Agar',
  'Sabouraud Dextrose Agar',
  'Hektoen Enteric Agar',
  'Mueller-Hinton',
  'Gardnerella Agar'
];

export const SMELL_OPTIONS = [
  'Not Recorded',
  'None / Neutral',
  'Grape-like (Pseudomonas)',
  'Mauvaise chaussette (Staphylococcus)',
  'Putrid / Foul (Anaerobes)',
  'Sweet / Caramel (Strep milleri)',
  'Burnt Chocolate (Proteus)',
  'Earthy / Soil (Nocardia/Streptomyces)',
  'Ammonia',
  'Bleach (Eikenella)',
  'Popcorn (Neisseria)',
  'Fruity / Strawberry (Alcaligenes)'
];

export const QUANTITY_OPTIONS = [
  Quantity.ABSENT,
  Quantity.RARE,
  Quantity.FEW,
  Quantity.MANY,
  Quantity.VERY_MANY
];

export const FLORA_TYPE_OPTIONS = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];

export const DEFAULT_VAGINAL_EXAM: VaginalExam = {
  epithelialCells: Quantity.ABSENT,
  leukocytes: Quantity.ABSENT,
  redBloodCells: Quantity.ABSENT,
  yeasts: Quantity.ABSENT,
  trichomonas: Quantity.ABSENT,
  floraType: 'Type 1',
  doderlein: Quantity.MANY,
  gardnerella: Quantity.ABSENT,
  cocciPos: Quantity.ABSENT,
  cocciNeg: Quantity.ABSENT,
  gncIntracellular: false,
  bgn: Quantity.ABSENT,
  bgp: Quantity.ABSENT,
  mycoplasma: {
    performed: false,
    mHominis: { result: 'Negative', titerHigh: false },
    uUrealyticum: { result: 'Negative', titerHigh: false }
  }
};

export const DEFAULT_ECBU_EXAM: ECBUExam = {
  leukocytes: '',
  redBloodCells: ''
};

export const INITIAL_TESTS_GNB = [
  TestType.OXIDASE
];

export const INITIAL_TESTS_GPC = [
  TestType.CATALASE
];

export const MINI_GALLERIE = [
  TestType.KLIGLER,
  TestType.CITRATE,
  TestType.MANNITOL,
  TestType.UREA,
  TestType.INDOLE,
  TestType.TDA
];

export const TEST_OPTIONS = {
  [TestType.OXIDASE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.CATALASE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.COAGULASE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.UREA]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.INDOLE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.TDA]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.CITRATE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.MANNITOL]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.KLIGLER]: [TestResultValue.ALK_ACID, TestResultValue.ACID_ACID, TestResultValue.ALK_ALK],
  
  // Staph / Strep Specifics
  [TestType.NOVOBIOCIN]: [TestResultValue.SENSITIVE, TestResultValue.RESISTANT],
  [TestType.OPTOCHIN]: [TestResultValue.SENSITIVE, TestResultValue.RESISTANT],
  [TestType.BACITRACIN]: [TestResultValue.SENSITIVE, TestResultValue.RESISTANT],
  [TestType.CAMP]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.BILE_ESCULIN]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.NACL_6_5]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],

  [TestType.GERM_TUBE]: [TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.YEAST_ID]: [TestResultValue.PENDING, TestResultValue.SENSITIVE, TestResultValue.RESISTANT],

  [TestType.VITEK]: [TestResultValue.PENDING, TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.API_20E]: [TestResultValue.PENDING, TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
  [TestType.API_STAPH]: [TestResultValue.PENDING, TestResultValue.POSITIVE, TestResultValue.NEGATIVE],
};

export const EXPECTED_BACTERIA: Record<SampleType, string[]> = {
  [SampleType.ECBU]: ['Escherichia coli', 'Enterococcus sp.', 'Proteus mirabilis', 'Klebsiella pneumoniae', 'Staphylococcus saprophyticus'],
  [SampleType.VAGINAL]: ['Lactobacillus sp. (Flore normale)', 'Gardnerella vaginalis', 'Candida albicans', 'Streptococcus agalactiae (GBS)', 'Trichomonas vaginalis'],
  [SampleType.PUS_DEEP]: ['Staphylococcus aureus', 'Bacteroides fragilis', 'Escherichia coli', 'Streptococcus pyogenes'],
  [SampleType.PUS_SUPERFICIAL]: ['Staphylococcus aureus', 'Streptococcus pyogenes', 'Pseudomonas aeruginosa', 'Enterobacteriaceae'],
  [SampleType.BLOOD]: ['Staphylococcus aureus', 'Escherichia coli', 'Staphylococcus à coagulase négative', 'Klebsiella sp.', 'Candida sp.'],
  [SampleType.FLUID]: ['Streptococcus pneumoniae', 'Neisseria meningitidis', 'Haemophilus influenzae', 'Staphylococcus aureus'],
  [SampleType.STOOL]: ['Salmonella sp.', 'Shigella sp.', 'Campylobacter sp.', 'Yersinia enterocolitica', 'Escherichia coli (EHEC/ETEC)'],
  [SampleType.OTHER]: ['Dépend du site de prélèvement']
};

export const MOCK_SAMPLES = [
  {
    id: 'S-2024-001',
    patientId: 'P-8842',
    type: SampleType.ECBU,
    collectionDate: new Date().toISOString(),
    gramStatus: GramStatus.GNB,
    underAntibiotics: false,
    aiQuery: '',
    ecbuExam: { ...DEFAULT_ECBU_EXAM },
    plates: [],
    tests: [],
    status: 'Processing'
  }
];