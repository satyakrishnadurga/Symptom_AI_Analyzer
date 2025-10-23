export interface SymptomInput {
  age: string;
  weight: string;
  symptoms: string;
  allergies: string;
}

export interface StructuredSymptom {
  name: string;
  duration_days: number;
  severity: string;
}

export interface PossibleCause {
  condition: string;
  likelihood: number;
  supporting_symptoms: string[];
  references: string[];
}

export enum TriageLevel {
    SELF_CARE = "self_care",
    SEE_PRIMARY_CARE = "see_primary_care",
    EMERGENCY = "emergency",
}

export interface TriageRecommendation {
  level: TriageLevel;
  reason: string;
}

export interface MedicationOption {
  name: string;
  rxnorm_id: string;
  purpose: string;
}

export interface FoodSuggestion {
    reason: string;
    suggestions: string[];
}

export interface AnalysisResponse {
  structured_symptoms: StructuredSymptom[];
  possible_causes: PossibleCause[];
  triage_recommendation: TriageRecommendation;
  medication_options: MedicationOption[];
  food_suggestions: FoodSuggestion;
  warnings: string[];
}