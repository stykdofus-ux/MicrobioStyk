import { GoogleGenAI } from "@google/genai";
import { Sample, GramStatus, TestEntry, TestType, SampleType, GermKnowledge } from "../types";

// Initialize Gemini Client
// IMPORTANT: process.env.API_KEY must be set in the environment
const apiKey = process.env.API_KEY || ''; 
// We will handle the missing key case gracefully in the UI, but here we instantiate if present.
// If the key is empty, the calls will fail, and we catch that.

const getAiClient = () => {
    if (!apiKey) {
        throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeBacteriologyCase = async (sample: Sample, query?: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Construct a context-rich prompt
    const plateText = sample.plates.map(p => `- On ${p.media}: ${p.growth} growth. ${p.morphology}. Smell: ${p.smell || 'Not recorded'}`).join('\n');
    
    // Test Results
    const testText = sample.tests.length > 0 
      ? sample.tests.map(t => {
          let extra = '';
          if (t.type === TestType.KLIGLER) {
             if (t.gas) extra += ' Gas(+)';
             if (t.h2s) extra += ' H2S(+)';
          }
          if (t.type === TestType.MANNITOL) {
             if (t.motility) extra += ' Motility(+)';
          }
          return `- ${t.type}: ${t.result}${extra}`;
        }).join('\n')
      : 'No biochemical tests performed yet.';

    // Vaginal Exam Data
    let vaginalText = '';
    if (sample.type === SampleType.VAGINAL && sample.vaginalExam) {
      const v = sample.vaginalExam;
      let mycoplasmaText = 'Not Performed';
      if (v.mycoplasma.performed) {
          mycoplasmaText = `
            - M. hominis: ${v.mycoplasma.mHominis.result} (${v.mycoplasma.mHominis.titerHigh ? '>10^4' : '<10^4'})
            - U. urealyticum: ${v.mycoplasma.uUrealyticum.result} (${v.mycoplasma.uUrealyticum.titerHigh ? '>10^4' : '<10^4'})
          `;
      }

      vaginalText = `
      VAGINAL EXAM DATA:
      - Direct (Fresh):
        - Epithelial Cells: ${v.epithelialCells}
        - Leukocytes: ${v.leukocytes}
        - RBCs: ${v.redBloodCells}
        - Yeasts: ${v.yeasts}
        - Trichomonas: ${v.trichomonas}
      - Gram Stain / Flora:
        - Flora Type: ${v.floraType} (Nugent implication)
        - Doderlein (Lactobacillus): ${v.doderlein}
        - Gardnerella/Clue Cells: ${v.gardnerella}
        - Cocci +: ${v.cocciPos}
        - Cocci -: ${v.cocciNeg}
        - Intracellular GNC (Gonococcus suspect): ${v.gncIntracellular ? 'YES (Diplococci "Grains de café" Intracellular)' : 'No'}
        - BGN: ${v.bgn}
        - BGP: ${v.bgp}
      - Mycoplasma: ${mycoplasmaText}
      `;
    }

    // ECBU Exam Data
    let ecbuText = '';
    if (sample.type === SampleType.ECBU && sample.ecbuExam) {
      ecbuText = `
      ECBU CYTOLOGY:
      - Leukocytes: ${sample.ecbuExam.leukocytes || 'Not recorded'} /mm3
      - Red Blood Cells: ${sample.ecbuExam.redBloodCells || 'Not recorded'} /mm3
      `;
    }

    const systemInstruction = `
      You are an expert Clinical Microbiologist assisting a lab technician.
      
      CRITICAL: Your responses, analysis, and identification reasoning MUST be strictly in French (français). 
      Use professional medical and microbiological terminology as used in a French "Laboratoire de Biologie Médicale" (LBM).
      Use Markdown for formatting (bold, lists, headers).
      
      Tasks:
      1. Analyze the sample data (Direct exam, Gram, Plates, Tests).
      
      2. APPLY SPECIFIC IDENTIFICATION PROTOCOLS:

         A. GRAM POSITIVE COCCI (GPC):
            - First Step: CATALASE.
            - If CATALASE POSITIVE -> Staphylococcus.
              * Check COAGULASE.
              * Coagulase (+): Staphylococcus aureus.
              * Coagulase (-): Check NOVOBIOCIN.
                - Novobiocin Sensitive: Staphylococcus epidermidis.
                - Novobiocin Resistant: Staphylococcus saprophyticus.
              * S. aureus typically Mannitol (+). S. epidermidis Mannitol (-). S. saprophyticus Mannitol (+) variable.
            
            - If CATALASE NEGATIVE -> Streptococcus / Enterococcus.
              * Check HEMOLYSIS on Blood Agar.
              * ALPHA Hemolysis (Green): 
                - Check OPTOCHIN (Taxo P). Sensitive = S. pneumoniae. Resistant = Viridans Strep (S. mitis, S. mutans, etc).
                - Check Bile Solubility (Pneumo +, Viridans -).
              * BETA Hemolysis (Clear):
                - Check BACITRACIN (Taxo A). Sensitive = Group A (S. pyogenes). Resistant = Check CAMP/SXT.
                - CAMP Positive = Group B (S. agalactiae).
                - SXT Sensitive = Group C (S. equi, etc).
              * GAMMA (No Hemolysis) or Alpha:
                - Check BILE ESCULIN. Positive = Group D (Enterococcus or S. bovis).
                - Differentiate Group D: NaCl 6.5%. Growth (+) = Enterococcus faecalis/faecium. No Growth (-) = S. bovis.

         B. GRAM NEGATIVE BACILLI (GNB):
            - First Step: OXIDASE.
            - If OXIDASE POSITIVE: Pseudomonas (Green pigment, fruity smell), Alcaligenes, etc.
            - If OXIDASE NEGATIVE: Enterobacteriaceae.
            - Use Kligler Iron Agar (KIA) pattern:
              * Red/Yellow (K/A) = Glucose only (Shigella, Salmonella, Proteus). Check H2S.
              * Yellow/Yellow (A/A) = Glucose + Lactose (E. coli, Klebsiella, Enterobacter).
            - Key differentiations:
              * Proteus: Urea (++), TDA (+), H2S (+), Swarming.
              * E. coli: Indole (+), Citrate (-), Lactose (+).
              * Klebsiella: Non-motile, Citrate (+), Indole (- usually), Mucoid colonies.
              * Enterobacter: Motile, Citrate (+), Indole (-).
              * Salmonella: H2S (+), Citrate (+), Urea (-).
              * Shigella: H2S (-), Motility (-), Urea (-).

      3. For Vaginal Samples:
         - Interpret the Flora Type (Type 1 normal, Type 2 intermediate, Type 3/4 BV).
         - Comment on presence of Clue Cells/Gardnerella (BV indicator).
         - IF "Intracellular GNC" is YES: Alert for possible Neisseria gonorrhoeae.
         - Mycoplasma thresholds (>10^4 pathogenic).

      4. For Urine (ECBU):
         - Leukocyturia/Hematuria significance.
         - Correlation with culture.

      5. ANTIBIOGRAM & RESISTANCE RESEARCH (CRITICAL):
         - For Staphylococcus: Suggest testing Cefoxitin (screen for MRSA).
         - For Enterobacteriaceae: Suggest looking for ESBL (Synergy Augmentin+C3G).
         - For Streptococcus: Suggest screening with Oxacillin (Pneumococcus).
         - For Enterococcus: High-Level Aminoglycosides.
         - For Pseudomonas: Warn about MDR.
      
      6. CONSIDÉRATION DES ANTIBIOTIQUES (CRITIQUE) :
         - Si le patient est sous traitement antibiotique, analysez l'impact sur la culture (inhibition de croissance, morphologie atypique, diminution du nombre de colonies).
         - Discutez de la pertinence clinique d'une culture pauvre ou négative sous traitement (effet de l'antibiotique sur la viabilité vs absence d'infection).
      
      Be concise, professional, and diagnostic-oriented. Provide the likely ID and the reasoning based on the tests provided.
    `;

    const userPrompt = `
      Type de prélèvement : ${sample.type}
      Statut Gram : ${sample.gramStatus}
      Patient sous ANTIBIOTIQUES : ${sample.underAntibiotics ? 'OUI (Prendre en compte dans l\'interprétation de la pousse)' : 'NON'}
      
      ${vaginalText}
      ${ecbuText}
      
      Plate Observations:
      ${plateText}
      
      Current Test Results:
      ${testText}
      
      User Query: ${query || "Quels sont les examens complémentaires recommandés, l'identification probable et l'orientation vers la résistance aux antibiotiques ?"}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, 
      }
    });

    return response.text || "Aucune analyse générée.";
  } catch (error) {
    console.error("Erreur d'analyse Gemini :", error);
    return "Impossible de contacter le conseiller IA. Veuillez vérifier votre connexion réseau ou la configuration de votre clé API.";
  }
};

export const getGermKnowledge = async (germName: string): Promise<GermKnowledge> => {
  try {
    const ai = getAiClient();
    const prompt = `Provide the expected biochemical test results for the bacteria "${germName}".
    Return the result in strict JSON format.
    Fields required:
    - name: string (Full scientific name)
    - family: string (e.g. Enterobacteriaceae)
    - gram: string (e.g. GNB or GPC)
    - catalase: string (+ or -)
    - oxidase: string (+ or -)
    - coagulase: string (+ or - or NA)
    - mannitol: string (+ or -)
    - motility: string (+ or -)
    - citrate: string (+ or -)
    - urea: string (+ or -)
    - indole: string (+ or -)
    - tda: string (+ or -)
    - kligler: string (e.g. "Acid/Acid Gas+ H2S-" or "K/A No Gas")
    - notes: string (Any specific characteristics like smell, swarming, pigment)
    
    If the germ is unknown, return "Unknown" in the name field.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GermKnowledge;
    }
    throw new Error("Empty response");

  } catch (error) {
    console.error("Gemini Reference Error:", error);
    throw error;
  }
};