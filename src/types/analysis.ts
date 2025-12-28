export interface ProductSummary {
  name_ar: string;
  scientific_name: string;
  manufacturer: string;
  primary_use: string;
}

export interface ExpiryAnalytics {
  expiry_date: string;
  days_remaining: string;
  status: "آمن" | "يقترب من الانتهاء" | "منتهي";
  alert_priority: "Low" | "Medium" | "High";
}

export interface PositiveIngredient {
  name: string;
  benefit: string;
  evidence_level: string;
}

export interface NegativeIngredient {
  name: string;
  risk: string;
  side_effects: string[];
}

export interface SuspiciousIngredient {
  name: string;
  reason: string;
}

export interface IngredientsClassification {
  positive_ingredients: PositiveIngredient[];
  negative_ingredients: NegativeIngredient[];
  suspicious_ingredients: SuspiciousIngredient[];
}

export interface MarketingAudit {
  deceptive_claims: string[];
  scientific_fact_check: string;
}

export interface DetailedMedicalReport {
  indications: string[];
  contraindications: string[];
  common_side_effects: string[];
  rare_serious_risks: string[];
}

export interface AnalysisResult {
  product_summary: ProductSummary;
  expiry_analytics: ExpiryAnalytics;
  ingredients_classification: IngredientsClassification;
  marketing_audit: MarketingAudit;
  detailed_medical_report: DetailedMedicalReport;
  safety_disclaimer: string;
}
