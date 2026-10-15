export enum SampleType {
  ECBU = 'ECBU',
  VAGINAL = 'Prélèvement Vaginal',
  PUS_DEEP = 'Pus Profond',
  PUS_SUPERFICIAL = 'Pus Superficiel',
  BLOOD = 'Hémoculture',
  FLUID = 'Liquide de Ponction (LCR, Pleural...)',
  STOOL = 'Coproculture',
  OTHER = 'Autre'
}

export enum GramStatus {
  UNKNOWN = 'Unknown',
  GPC = 'Gram Positive Cocci',
  GNB = 'Gram Negative Bacilli',
  GPB = 'Gram Positive Bacilli',
  GNC = 'Gram Negative Cocci',
  YEAST = 'Yeast'
}

export enum Quantity {
  ABSENT = 'Absent',
  RARE = 'Rare',
  FEW = 'Assez nombreux',
  MANY = 'Nombreux',
  VERY_MANY = 'Très nombreux'
}

export interface MycoplasmaResult {
  result: 'Positive' | 'Negative';
  titerHigh: boolean; // true if >= 10^4 CFU/ml
}

export interface VaginalExam {
  // Direct Microscope
  epithelialCells: Quantity;
  leukocytes: Quantity;
  redBloodCells: Quantity;
  yeasts: Quantity;
  trichomonas: Quantity;
  
  // Gram / Flora
  floraType: 'Type 1' | 'Type 2' | 'Type 3' | 'Type 4';
  doderlein: Quantity;
  gardnerella: Quantity; // "G. vaginalis (mobiluncus, clue cells)"
  
  // Other Bacteria
  cocciPos: Quantity;
  cocciNeg: Quantity;
  gncIntracellular: boolean; // "Grain de café" intracellular check
  bgn: Quantity;
  bgp: Quantity;

  // Mycoplasma
  mycoplasma: {
    performed: boolean;
    mHominis: MycoplasmaResult;
    uUrealyticum: MycoplasmaResult;
  };
}

export interface ECBUExam {
  leukocytes: string; // Count per mm3
  redBloodCells: string; // Count per mm3
}

export enum TestType {
  CATALASE = 'Catalase',
  COAGULASE = 'Coagulase',
  OXIDASE = 'Oxidase',
  KLIGLER = 'Kligler (Glu/Lac/Gas/H2S)',
  MANNITOL = 'Mannitol Motility',
  UREA = 'Urea',
  INDOLE = 'Indole',
  TDA = 'TDA',
  CITRATE = 'Citrate (Simmons)',
  // Staph Specific
  NOVOBIOCIN = 'Novobiocin',
  // Strep Specific
  OPTOCHIN = 'Optochin',
  BACITRACIN = 'Bacitracin',
  CAMP = 'CAMP Test',
  BILE_ESCULIN = 'Bile Esculin',
  NACL_6_5 = 'NaCl 6.5%',
  
  GERM_TUBE = 'Test de Filamentation (Blastèse)',
  YEAST_ID = 'Identification Levure (Chromogène/Auxano)',

  VITEK = 'Vitek Automaton',
  API_20E = 'API 20E',
  API_STAPH = 'API Staph'
}

export enum TestResultValue {
  PENDING = 'Pending',
  POSITIVE = 'Positive (+)',
  NEGATIVE = 'Negative (-)',
  SENSITIVE = 'Sensitive',
  RESISTANT = 'Resistant',
  INDETERMINATE = 'Indeterminate',
  // Specific for Kligler
  ALK_ACID = 'K/A (Red/Yellow)',
  ACID_ACID = 'A/A (Yellow/Yellow)',
  ALK_ALK = 'K/K (Red/Red)',
}

export interface TestEntry {
  id: string;
  type: TestType;
  result: TestResultValue;
  notes?: string;
  timestamp: number;
  gas?: boolean;
  h2s?: boolean;
  motility?: boolean;
}

export interface PlateObservation {
  id: string;
  media: string; // e.g. "Blood Agar", "MacConkey"
  morphology: string; // e.g. "S-type, creamy, beta-hemolysis"
  growth: 'No Growth' | 'Scanty' | 'Moderate' | 'Heavy';
  smell?: string; // e.g. "Grape-like", "Putrid"
  imageUrl?: string;
}

export interface Sample {
  id: string;
  patientId: string;
  type: SampleType;
  collectionDate: string;
  gramStatus: GramStatus;
  underAntibiotics?: boolean;
  vaginalExam?: VaginalExam;
  ecbuExam?: ECBUExam;
  plates: PlateObservation[];
  tests: TestEntry[];
  aiAnalysis?: string;
  aiQuery?: string;
  status: 'Processing' | 'Ready for ID' | 'Completed';
}

export interface GermKnowledge {
  name: string;
  family: string;
  gram: string;
  catalase: string;
  oxidase: string;
  coagulase: string;
  mannitol: string;
  motility: string;
  citrate: string;
  urea: string;
  indole: string;
  tda: string;
  kligler: string; // Text description e.g. "A/A Gas+ H2S-"
  notes: string;
}