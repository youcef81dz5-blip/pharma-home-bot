import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en" | "fr";

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
    fr: string;
  };
}

export const translations: Translations = {
  // Header
  appName: {
    ar: "صيدلي البيت",
    en: "PHARMA HOME",
    fr: "PHARMA MAISON",
  },
  appSubtitle: {
    ar: "PHARMA HOME",
    en: "Your Home Pharmacy",
    fr: "Votre Pharmacie Maison",
  },
  inventory: {
    ar: "المخزون",
    en: "Inventory",
    fr: "Inventaire",
  },
  // Hero Section
  heroTitle: {
    ar: "حلل مكونات أدويتك بالذكاء الاصطناعي",
    en: "Analyze Your Medicine Ingredients with AI",
    fr: "Analysez les Ingrédients de Vos Médicaments avec l'IA",
  },
  heroDescription: {
    ar: "التقط صورة لأي دواء أو مكمل غذائي واحصل على تحليل شامل للمكونات والتحذيرات",
    en: "Take a photo of any medicine or supplement and get a comprehensive analysis of ingredients and warnings",
    fr: "Prenez une photo de tout médicament ou supplément et obtenez une analyse complète des ingrédients et avertissements",
  },
  // Image Uploader
  uploadImage: {
    ar: "رفع صورة",
    en: "Upload Image",
    fr: "Télécharger une Image",
  },
  takePhoto: {
    ar: "التقاط صورة",
    en: "Take Photo",
    fr: "Prendre une Photo",
  },
  dragDropText: {
    ar: "اسحب الصورة هنا أو اضغط للاختيار",
    en: "Drag image here or click to select",
    fr: "Glissez l'image ici ou cliquez pour sélectionner",
  },
  supportedFormats: {
    ar: "يدعم صيغ JPG, PNG, WEBP",
    en: "Supports JPG, PNG, WEBP formats",
    fr: "Supporte les formats JPG, PNG, WEBP",
  },
  // Loading
  analyzingImage: {
    ar: "جاري تحليل الصورة...",
    en: "Analyzing image...",
    fr: "Analyse de l'image en cours...",
  },
  extractingIngredients: {
    ar: "يتم استخراج المكونات وتحليلها بالذكاء الاصطناعي",
    en: "Extracting and analyzing ingredients with AI",
    fr: "Extraction et analyse des ingrédients avec l'IA",
  },
  // Results
  analysisResults: {
    ar: "نتائج التحليل",
    en: "Analysis Results",
    fr: "Résultats de l'Analyse",
  },
  newAnalysis: {
    ar: "تحليل جديد",
    en: "New Analysis",
    fr: "Nouvelle Analyse",
  },
  analysisSuccess: {
    ar: "تم التحليل بنجاح",
    en: "Analysis completed successfully",
    fr: "Analyse terminée avec succès",
  },
  analysisSuccessDesc: {
    ar: "تم تحليل صورة الدواء واستخراج المعلومات",
    en: "Medicine image analyzed and information extracted",
    fr: "Image du médicament analysée et informations extraites",
  },
  analysisError: {
    ar: "خطأ في التحليل",
    en: "Analysis Error",
    fr: "Erreur d'Analyse",
  },
  // Footer
  copyright: {
    ar: "صيدلي البيت © {year} - جميع الحقوق محفوظة",
    en: "PHARMA HOME © {year} - All rights reserved",
    fr: "PHARMA MAISON © {year} - Tous droits réservés",
  },
  disclaimer: {
    ar: "هذا التطبيق للأغراض المعلوماتية فقط ولا يغني عن استشارة الطبيب",
    en: "This app is for informational purposes only and does not replace medical consultation",
    fr: "Cette application est à titre informatif uniquement et ne remplace pas une consultation médicale",
  },
  // Auth
  login: {
    ar: "تسجيل الدخول",
    en: "Login",
    fr: "Connexion",
  },
  signup: {
    ar: "إنشاء حساب",
    en: "Sign Up",
    fr: "S'inscrire",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
    fr: "Email",
  },
  password: {
    ar: "كلمة المرور",
    en: "Password",
    fr: "Mot de passe",
  },
  loginToAccess: {
    ar: "تسجيل الدخول للوصول لمخزون أدويتك",
    en: "Login to access your medicine inventory",
    fr: "Connectez-vous pour accéder à votre inventaire de médicaments",
  },
  createAccount: {
    ar: "إنشاء حساب جديد",
    en: "Create a new account",
    fr: "Créer un nouveau compte",
  },
  noAccount: {
    ar: "ليس لديك حساب؟ أنشئ حساباً جديداً",
    en: "Don't have an account? Sign up",
    fr: "Pas de compte ? Inscrivez-vous",
  },
  hasAccount: {
    ar: "لديك حساب؟ سجل الدخول",
    en: "Already have an account? Login",
    fr: "Déjà un compte ? Connectez-vous",
  },
  loginSuccess: {
    ar: "تم تسجيل الدخول بنجاح",
    en: "Login successful",
    fr: "Connexion réussie",
  },
  welcomeBack: {
    ar: "مرحباً بك في صيدلي البيت",
    en: "Welcome to PHARMA HOME",
    fr: "Bienvenue à PHARMA MAISON",
  },
  accountCreated: {
    ar: "تم إنشاء الحساب بنجاح",
    en: "Account created successfully",
    fr: "Compte créé avec succès",
  },
  // Inventory
  medicineInventory: {
    ar: "مخزون الأدوية",
    en: "Medicine Inventory",
    fr: "Inventaire des Médicaments",
  },
  manageHomeMedicine: {
    ar: "إدارة أدوية المنزل",
    en: "Manage Home Medicines",
    fr: "Gérer les Médicaments à Domicile",
  },
  totalMedicines: {
    ar: "إجمالي الأدوية",
    en: "Total Medicines",
    fr: "Total Médicaments",
  },
  expiringSoon: {
    ar: "قريب الانتهاء",
    en: "Expiring Soon",
    fr: "Expire Bientôt",
  },
  expired: {
    ar: "منتهي الصلاحية",
    en: "Expired",
    fr: "Expiré",
  },
  expiredAlert: {
    ar: "لديك {count} دواء منتهي الصلاحية!",
    en: "You have {count} expired medicine(s)!",
    fr: "Vous avez {count} médicament(s) expiré(s) !",
  },
  expiringAlert: {
    ar: "لديك {count} دواء يقترب من انتهاء صلاحيته",
    en: "You have {count} medicine(s) expiring soon",
    fr: "Vous avez {count} médicament(s) qui expire(nt) bientôt",
  },
  searchMedicine: {
    ar: "ابحث عن دواء...",
    en: "Search medicine...",
    fr: "Rechercher un médicament...",
  },
  noResults: {
    ar: "لا توجد نتائج",
    en: "No results",
    fr: "Aucun résultat",
  },
  noMedicines: {
    ar: "لا يوجد أدوية في المخزون",
    en: "No medicines in inventory",
    fr: "Aucun médicament dans l'inventaire",
  },
  addNewMedicine: {
    ar: "أضف دواء جديد",
    en: "Add New Medicine",
    fr: "Ajouter un Nouveau Médicament",
  },
  medicineName: {
    ar: "اسم الدواء",
    en: "Medicine Name",
    fr: "Nom du Médicament",
  },
  scientificName: {
    ar: "الاسم العلمي",
    en: "Scientific Name",
    fr: "Nom Scientifique",
  },
  quantity: {
    ar: "الكمية",
    en: "Quantity",
    fr: "Quantité",
  },
  expiryDate: {
    ar: "تاريخ الانتهاء",
    en: "Expiry Date",
    fr: "Date d'Expiration",
  },
  manufacturer: {
    ar: "الشركة المصنعة",
    en: "Manufacturer",
    fr: "Fabricant",
  },
  primaryUse: {
    ar: "الاستخدام الأساسي",
    en: "Primary Use",
    fr: "Utilisation Principale",
  },
  notes: {
    ar: "ملاحظات",
    en: "Notes",
    fr: "Notes",
  },
  add: {
    ar: "إضافة",
    en: "Add",
    fr: "Ajouter",
  },
  adding: {
    ar: "جاري الإضافة...",
    en: "Adding...",
    fr: "Ajout en cours...",
  },
  cancel: {
    ar: "إلغاء",
    en: "Cancel",
    fr: "Annuler",
  },
  editMedicine: {
    ar: "تعديل الدواء",
    en: "Edit Medicine",
    fr: "Modifier le Médicament",
  },
  saveChanges: {
    ar: "حفظ التعديلات",
    en: "Save Changes",
    fr: "Enregistrer les Modifications",
  },
  updating: {
    ar: "جاري التحديث...",
    en: "Updating...",
    fr: "Mise à jour...",
  },
  showDetails: {
    ar: "عرض التفاصيل",
    en: "Show Details",
    fr: "Afficher les Détails",
  },
  hideDetails: {
    ar: "إخفاء التفاصيل",
    en: "Hide Details",
    fr: "Masquer les Détails",
  },
  use: {
    ar: "الاستخدام",
    en: "Use",
    fr: "Utilisation",
  },
  daysRemaining: {
    ar: "{days} يوم متبقي",
    en: "{days} days remaining",
    fr: "{days} jours restants",
  },
  unknown: {
    ar: "غير محدد",
    en: "Unknown",
    fr: "Inconnu",
  },
  safe: {
    ar: "آمن",
    en: "Safe",
    fr: "Sûr",
  },
  deleted: {
    ar: "تم الحذف",
    en: "Deleted",
    fr: "Supprimé",
  },
  deletedDesc: {
    ar: "تم حذف الدواء من المخزون",
    en: "Medicine removed from inventory",
    fr: "Médicament retiré de l'inventaire",
  },
  added: {
    ar: "تمت الإضافة",
    en: "Added",
    fr: "Ajouté",
  },
  addedDesc: {
    ar: "تم إضافة الدواء إلى المخزون بنجاح",
    en: "Medicine added to inventory successfully",
    fr: "Médicament ajouté à l'inventaire avec succès",
  },
  updated: {
    ar: "تم التحديث",
    en: "Updated",
    fr: "Mis à jour",
  },
  updatedDesc: {
    ar: "تم تحديث بيانات الدواء بنجاح",
    en: "Medicine data updated successfully",
    fr: "Données du médicament mises à jour avec succès",
  },
  error: {
    ar: "خطأ",
    en: "Error",
    fr: "Erreur",
  },
  loadError: {
    ar: "فشل في تحميل بيانات المخزون",
    en: "Failed to load inventory data",
    fr: "Échec du chargement des données de l'inventaire",
  },
  deleteError: {
    ar: "فشل في حذف الدواء",
    en: "Failed to delete medicine",
    fr: "Échec de la suppression du médicament",
  },
  addError: {
    ar: "فشل في إضافة الدواء",
    en: "Failed to add medicine",
    fr: "Échec de l'ajout du médicament",
  },
  updateError: {
    ar: "فشل في تحديث الدواء",
    en: "Failed to update medicine",
    fr: "Échec de la mise à jour du médicament",
  },
  loginRequired: {
    ar: "يجب تسجيل الدخول أولاً",
    en: "Please login first",
    fr: "Veuillez d'abord vous connecter",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "ar";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key]?.[language] || key;
    if (!params) return translation;
    
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replace(`{${key}}`, String(value)),
      translation
    );
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
