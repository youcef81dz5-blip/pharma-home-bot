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
  reminders: {
    ar: "التذكيرات",
    en: "Reminders",
    fr: "Rappels",
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
  developedBy: {
    ar: "تطوير: بن علي يوسف",
    en: "Developed by: Ben Ali Youssef",
    fr: "Développé par: Ben Ali Youssef",
  },
  addFromImage: {
    ar: "إضافة من صورة",
    en: "Add from Image",
    fr: "Ajouter depuis une Image",
  },
  captureImage: {
    ar: "التقاط صورة",
    en: "Capture Image",
    fr: "Capturer une Image",
  },
  uploadImageBtn: {
    ar: "رفع صورة",
    en: "Upload Image",
    fr: "Télécharger une Image",
  },
  analyzingAndAdding: {
    ar: "جاري التحليل والإضافة...",
    en: "Analyzing and adding...",
    fr: "Analyse et ajout en cours...",
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
  // Symptom Search
  symptomSearch: {
    ar: "البحث بالأعراض",
    en: "Search by Symptoms",
    fr: "Recherche par Symptômes",
  },
  symptomPlaceholder: {
    ar: "اكتب الأعراض التي تشعر بها (مثل: صداع، حرارة، سعال...)",
    en: "Describe your symptoms (e.g., headache, fever, cough...)",
    fr: "Décrivez vos symptômes (ex: maux de tête, fièvre, toux...)",
  },
  searchBySymptoms: {
    ar: "ابحث عن دواء مناسب",
    en: "Find Suitable Medicine",
    fr: "Trouver un Médicament Adapté",
  },
  searching: {
    ar: "جاري البحث...",
    en: "Searching...",
    fr: "Recherche en cours...",
  },
  suggestions: {
    ar: "الاقتراحات",
    en: "Suggestions",
    fr: "Suggestions",
  },
  medicalDisclaimer: {
    ar: "⚠️ تنبيه مهم: هذه اقتراحات فقط ولا تغني عن استشارة الطبيب. يُنصح دائماً بمراجعة طبيب مختص قبل استعمال أي دواء.",
    en: "⚠️ Important: These are suggestions only and do not replace medical consultation. Always consult a doctor before using any medication.",
    fr: "⚠️ Important: Ce sont des suggestions uniquement et ne remplacent pas une consultation médicale. Consultez toujours un médecin avant d'utiliser un médicament.",
  },
  suggestionError: {
    ar: "حدث خطأ أثناء البحث",
    en: "Error during search",
    fr: "Erreur lors de la recherche",
  },
  // About Page
  aboutApp: {
    ar: "تعرف على التطبيق",
    en: "About the App",
    fr: "À propos de l'App",
  },
  backToHome: {
    ar: "العودة للرئيسية",
    en: "Back to Home",
    fr: "Retour à l'Accueil",
  },
  aboutTitle: {
    ar: "صيدلي البيت - صيدليتك الذكية في جيبك",
    en: "PHARMA HOME - Your Smart Pharmacy in Your Pocket",
    fr: "PHARMA MAISON - Votre Pharmacie Intelligente dans Votre Poche",
  },
  aboutDescription: {
    ar: "تطبيق ذكي يساعدك في إدارة أدوية منزلك وتحليل مكوناتها باستخدام الذكاء الاصطناعي",
    en: "A smart app that helps you manage your home medicines and analyze their ingredients using AI",
    fr: "Une application intelligente qui vous aide à gérer vos médicaments à domicile et à analyser leurs ingrédients avec l'IA",
  },
  saveMoneySloganTitle: {
    ar: "وفّر أموالك مع صيدلي البيت!",
    en: "Save Your Money with PHARMA HOME!",
    fr: "Économisez Votre Argent avec PHARMA MAISON!",
  },
  saveMoneySloganDesc: {
    ar: "لا تشترِ دواءً قد يكون موجوداً في بيتك! خاصية المخزون الذكي تُظهر لك كل الأدوية المتوفرة لديك، فتتجنب شراء أدوية مكررة وتوفّر مالك للأهم. اعرف ما عندك قبل ما تصرف!",
    en: "Don't buy medicine that might already be at home! The smart inventory feature shows you all your available medicines, helping you avoid duplicate purchases and save money for what matters most. Know what you have before you spend!",
    fr: "N'achetez pas de médicaments qui pourraient déjà être chez vous! La fonction d'inventaire intelligent vous montre tous vos médicaments disponibles, vous aidant à éviter les achats en double et à économiser de l'argent. Sachez ce que vous avez avant de dépenser!",
  },
  whatIsApp: {
    ar: "ما هو صيدلي البيت؟",
    en: "What is PHARMA HOME?",
    fr: "Qu'est-ce que PHARMA MAISON?",
  },
  whatIsAppDesc: {
    ar: "صيدلي البيت هو تطبيق ثوري يحوّل هاتفك إلى صيدلي شخصي ذكي. يمكنك من خلاله تصوير أي دواء للحصول على تحليل شامل لمكوناته، إدارة مخزون أدوية منزلك، ومعرفة الدواء المناسب لأعراضك من الأدوية المتوفرة لديك. كل هذا مع تذكيرات بتواريخ انتهاء الصلاحية!",
    en: "PHARMA HOME is a revolutionary app that transforms your phone into a smart personal pharmacist. You can photograph any medicine to get a comprehensive analysis of its ingredients, manage your home medicine inventory, and find the right medicine for your symptoms from what you already have. All with expiry date reminders!",
    fr: "PHARMA MAISON est une application révolutionnaire qui transforme votre téléphone en pharmacien personnel intelligent. Vous pouvez photographier n'importe quel médicament pour obtenir une analyse complète de ses ingrédients, gérer votre inventaire de médicaments à domicile et trouver le bon médicament pour vos symptômes. Tout cela avec des rappels de dates d'expiration!",
  },
  appFeatures: {
    ar: "مميزات التطبيق",
    en: "App Features",
    fr: "Fonctionnalités de l'App",
  },
  featureAnalysis: {
    ar: "تحليل الأدوية بالصور",
    en: "Medicine Analysis by Photo",
    fr: "Analyse des Médicaments par Photo",
  },
  featureAnalysisDesc: {
    ar: "التقط صورة لأي دواء واحصل على تحليل شامل لمكوناته وتحذيراته وطريقة استخدامه",
    en: "Take a photo of any medicine and get a comprehensive analysis of its ingredients, warnings, and usage",
    fr: "Prenez une photo de n'importe quel médicament et obtenez une analyse complète de ses ingrédients, avertissements et utilisation",
  },
  featureAI: {
    ar: "ذكاء اصطناعي متقدم",
    en: "Advanced AI Technology",
    fr: "Intelligence Artificielle Avancée",
  },
  featureAIDesc: {
    ar: "نستخدم أحدث تقنيات الذكاء الاصطناعي من Google Gemini لتحليل دقيق وموثوق",
    en: "We use the latest Google Gemini AI technology for accurate and reliable analysis",
    fr: "Nous utilisons la dernière technologie d'IA Google Gemini pour une analyse précise et fiable",
  },
  featureInventory: {
    ar: "إدارة مخزون الأدوية",
    en: "Medicine Inventory Management",
    fr: "Gestion de l'Inventaire des Médicaments",
  },
  featureInventoryDesc: {
    ar: "تتبع جميع أدوية منزلك في مكان واحد ووفّر أموالك بتجنب شراء أدوية موجودة عندك",
    en: "Track all your home medicines in one place and save money by avoiding duplicate purchases",
    fr: "Suivez tous vos médicaments et économisez en évitant les achats en double",
  },
  featureSymptom: {
    ar: "البحث بالأعراض",
    en: "Symptom-Based Search",
    fr: "Recherche par Symptômes",
  },
  featureSymptomDesc: {
    ar: "أدخل أعراضك والتطبيق يقترح الدواء المناسب من مخزونك مع نصيحة باستشارة الطبيب",
    en: "Enter your symptoms and the app suggests suitable medicine from your inventory with advice to consult a doctor",
    fr: "Entrez vos symptômes et l'app suggère un médicament approprié de votre inventaire avec conseil de consulter un médecin",
  },
  featureExpiry: {
    ar: "تنبيهات انتهاء الصلاحية",
    en: "Expiry Alerts",
    fr: "Alertes d'Expiration",
  },
  featureExpiryDesc: {
    ar: "تنبيهات تلقائية للأدوية التي اقتربت صلاحيتها أو انتهت لحمايتك وعائلتك",
    en: "Automatic alerts for medicines approaching or past expiry to protect you and your family",
    fr: "Alertes automatiques pour les médicaments proches ou dépassés pour vous protéger",
  },
  featureSecurity: {
    ar: "أمان وخصوصية",
    en: "Security & Privacy",
    fr: "Sécurité et Confidentialité",
  },
  featureSecurityDesc: {
    ar: "بياناتك محمية ومشفرة، ولا يمكن لأحد الوصول إليها سواك",
    en: "Your data is protected and encrypted, only you can access it",
    fr: "Vos données sont protégées et chiffrées, vous seul pouvez y accéder",
  },
  featureReminders: {
    ar: "تذكيرات الأدوية",
    en: "Medication Reminders",
    fr: "Rappels de Médicaments",
  },
  featureRemindersDesc: {
    ar: "منبهات صوتية قوية قابلة للتخصيص لتذكيرك بمواعيد أدويتك مع إمكانية اختيار النغمة والتعديل",
    en: "Customizable loud alarms to remind you of medication times with tone selection and editing options",
    fr: "Alarmes personnalisables pour vous rappeler les heures de prise de médicaments avec sélection de tonalité",
  },
  featureAlternatives: {
    ar: "البحث عن بدائل الأدوية",
    en: "Find Medicine Alternatives",
    fr: "Trouver des Alternatives aux Médicaments",
  },
  featureAlternativesDesc: {
    ar: "البحث عن بدائل للأدوية غير المتوفرة باستخدام الذكاء الاصطناعي مع تفاصيل كاملة",
    en: "Find alternatives for unavailable medicines using AI with complete details",
    fr: "Trouvez des alternatives aux médicaments indisponibles grâce à l'IA avec tous les détails",
  },
  howItWorks: {
    ar: "كيف يعمل التطبيق؟",
    en: "How Does It Work?",
    fr: "Comment Ça Marche?",
  },
  step1: {
    ar: "التقط صورة للدواء أو أضفه يدوياً إلى مخزونك",
    en: "Take a photo of the medicine or add it manually to your inventory",
    fr: "Prenez une photo du médicament ou ajoutez-le manuellement à votre inventaire",
  },
  step2: {
    ar: "الذكاء الاصطناعي يحلل الصورة ويستخرج المعلومات",
    en: "AI analyzes the image and extracts information",
    fr: "L'IA analyse l'image et extrait les informations",
  },
  step3: {
    ar: "احصل على تفاصيل شاملة عن المكونات والتحذيرات",
    en: "Get comprehensive details about ingredients and warnings",
    fr: "Obtenez des détails complets sur les ingrédients et avertissements",
  },
  step4: {
    ar: "ابحث بأعراضك للعثور على الدواء المناسب من مخزونك",
    en: "Search by symptoms to find suitable medicine from your inventory",
    fr: "Recherchez par symptômes pour trouver le médicament approprié",
  },
  whyChooseUs: {
    ar: "لماذا تختار صيدلي البيت؟",
    en: "Why Choose PHARMA HOME?",
    fr: "Pourquoi Choisir PHARMA MAISON?",
  },
  advantage1: {
    ar: "يوفّر لك المال بتجنب شراء أدوية موجودة في بيتك",
    en: "Saves you money by avoiding purchasing medicines already at home",
    fr: "Vous fait économiser en évitant d'acheter des médicaments déjà chez vous",
  },
  advantage2: {
    ar: "يدعم اللغة العربية والإنجليزية والفرنسية",
    en: "Supports Arabic, English, and French",
    fr: "Supporte l'arabe, l'anglais et le français",
  },
  advantage3: {
    ar: "يعمل بدون إنترنت للوظائف الأساسية",
    en: "Works offline for basic functions",
    fr: "Fonctionne hors ligne pour les fonctions de base",
  },
  advantage4: {
    ar: "تحديثات مستمرة وميزات جديدة",
    en: "Continuous updates and new features",
    fr: "Mises à jour continues et nouvelles fonctionnalités",
  },
  advantage5: {
    ar: "دعم فني سريع ومتجاوب",
    en: "Fast and responsive technical support",
    fr: "Support technique rapide et réactif",
  },
  startNow: {
    ar: "ابدأ الآن",
    en: "Start Now",
    fr: "Commencer Maintenant",
  },
  continueWithGoogle: {
    ar: "المتابعة بحساب Google",
    en: "Continue with Google",
    fr: "Continuer avec Google",
  },
  orContinueWith: {
    ar: "أو المتابعة بـ",
    en: "Or continue with",
    fr: "Ou continuer avec",
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
