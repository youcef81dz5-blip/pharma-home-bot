import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en" | "fr" | "es";

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
    fr: string;
    es: string;
  };
}

export const translations: Translations = {
  // Header
  appName: {
    ar: "صيدلي البيت",
    en: "PHARMA HOME",
    fr: "PHARMA MAISON",
    es: "PHARMA HOGAR",
  },
  appSubtitle: {
    ar: "PHARMA HOME",
    en: "Your Home Pharmacy",
    fr: "Votre Pharmacie Maison",
    es: "Tu Farmacia en Casa",
  },
  inventory: {
    ar: "المخزون",
    en: "Inventory",
    fr: "Inventaire",
    es: "Inventario",
  },
  reminders: {
    ar: "التذكيرات",
    en: "Reminders",
    fr: "Rappels",
    es: "Recordatorios",
  },
  prescriptions: {
    ar: "الوصفات",
    en: "Prescriptions",
    fr: "Ordonnances",
    es: "Recetas",
  },
  // Hero Section
  heroTitle: {
    ar: "حلل مكونات أدويتك بالذكاء الاصطناعي",
    en: "Analyze Your Medicine Ingredients with AI",
    fr: "Analysez les Ingrédients de Vos Médicaments avec l'IA",
    es: "Analiza los Ingredientes de tus Medicamentos con IA",
  },
  heroDescription: {
    ar: "التقط صورة لأي دواء أو مكمل غذائي واحصل على تحليل شامل للمكونات والتحذيرات",
    en: "Take a photo of any medicine or supplement and get a comprehensive analysis of ingredients and warnings",
    fr: "Prenez une photo de tout médicament ou supplément et obtenez une analyse complète des ingrédients et avertissements",
    es: "Toma una foto de cualquier medicamento o suplemento y obtén un análisis completo de ingredientes y advertencias",
  },
  // Image Uploader
  uploadImage: {
    ar: "رفع صورة",
    en: "Upload Image",
    fr: "Télécharger une Image",
    es: "Subir Imagen",
  },
  takePhoto: {
    ar: "التقاط صورة",
    en: "Take Photo",
    fr: "Prendre une Photo",
    es: "Tomar Foto",
  },
  dragDropText: {
    ar: "اسحب الصورة هنا أو اضغط للاختيار",
    en: "Drag image here or click to select",
    fr: "Glissez l'image ici ou cliquez pour sélectionner",
    es: "Arrastra la imagen aquí o haz clic para seleccionar",
  },
  supportedFormats: {
    ar: "يدعم صيغ JPG, PNG, WEBP",
    en: "Supports JPG, PNG, WEBP formats",
    fr: "Supporte les formats JPG, PNG, WEBP",
    es: "Soporta formatos JPG, PNG, WEBP",
  },
  // Loading
  analyzingImage: {
    ar: "جاري تحليل الصورة...",
    en: "Analyzing image...",
    fr: "Analyse de l'image en cours...",
    es: "Analizando imagen...",
  },
  extractingIngredients: {
    ar: "يتم استخراج المكونات وتحليلها بالذكاء الاصطناعي",
    en: "Extracting and analyzing ingredients with AI",
    fr: "Extraction et analyse des ingrédients avec l'IA",
    es: "Extrayendo y analizando ingredientes con IA",
  },
  // Results
  analysisResults: {
    ar: "نتائج التحليل",
    en: "Analysis Results",
    fr: "Résultats de l'Analyse",
    es: "Resultados del Análisis",
  },
  newAnalysis: {
    ar: "تحليل جديد",
    en: "New Analysis",
    fr: "Nouvelle Analyse",
    es: "Nuevo Análisis",
  },
  analysisSuccess: {
    ar: "تم التحليل بنجاح",
    en: "Analysis completed successfully",
    fr: "Analyse terminée avec succès",
    es: "Análisis completado exitosamente",
  },
  analysisSuccessDesc: {
    ar: "تم تحليل صورة الدواء واستخراج المعلومات",
    en: "Medicine image analyzed and information extracted",
    fr: "Image du médicament analysée et informations extraites",
    es: "Imagen del medicamento analizada e información extraída",
  },
  analysisError: {
    ar: "خطأ في التحليل",
    en: "Analysis Error",
    fr: "Erreur d'Analyse",
    es: "Error de Análisis",
  },
  // Footer
  copyright: {
    ar: "صيدلي البيت © {year} - جميع الحقوق محفوظة",
    en: "PHARMA HOME © {year} - All rights reserved",
    fr: "PHARMA MAISON © {year} - Tous droits réservés",
    es: "PHARMA HOGAR © {year} - Todos los derechos reservados",
  },
  developedBy: {
    ar: "تطوير: بن علي يوسف",
    en: "Developed by: Ben Ali Youssef",
    fr: "Développé par: Ben Ali Youssef",
    es: "Desarrollado por: Ben Ali Youssef",
  },
  addFromImage: {
    ar: "إضافة من صورة",
    en: "Add from Image",
    fr: "Ajouter depuis une Image",
    es: "Agregar desde Imagen",
  },
  captureImage: {
    ar: "التقاط صورة",
    en: "Capture Image",
    fr: "Capturer une Image",
    es: "Capturar Imagen",
  },
  uploadImageBtn: {
    ar: "رفع صورة",
    en: "Upload Image",
    fr: "Télécharger une Image",
    es: "Subir Imagen",
  },
  analyzingAndAdding: {
    ar: "جاري التحليل والإضافة...",
    en: "Analyzing and adding...",
    fr: "Analyse et ajout en cours...",
    es: "Analizando y agregando...",
  },
  disclaimer: {
    ar: "هذا التطبيق للأغراض المعلوماتية فقط ولا يغني عن استشارة الطبيب",
    en: "This app is for informational purposes only and does not replace medical consultation",
    fr: "Cette application est à titre informatif uniquement et ne remplace pas une consultation médicale",
    es: "Esta aplicación es solo para fines informativos y no reemplaza la consulta médica",
  },
  // Auth
  login: {
    ar: "تسجيل الدخول",
    en: "Login",
    fr: "Connexion",
    es: "Iniciar Sesión",
  },
  signup: {
    ar: "إنشاء حساب",
    en: "Sign Up",
    fr: "S'inscrire",
    es: "Registrarse",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
    fr: "Email",
    es: "Correo Electrónico",
  },
  password: {
    ar: "كلمة المرور",
    en: "Password",
    fr: "Mot de passe",
    es: "Contraseña",
  },
  loginToAccess: {
    ar: "تسجيل الدخول للوصول لمخزون أدويتك",
    en: "Login to access your medicine inventory",
    fr: "Connectez-vous pour accéder à votre inventaire de médicaments",
    es: "Inicia sesión para acceder a tu inventario de medicamentos",
  },
  createAccount: {
    ar: "إنشاء حساب جديد",
    en: "Create a new account",
    fr: "Créer un nouveau compte",
    es: "Crear una nueva cuenta",
  },
  noAccount: {
    ar: "ليس لديك حساب؟ أنشئ حساباً جديداً",
    en: "Don't have an account? Sign up",
    fr: "Pas de compte ? Inscrivez-vous",
    es: "¿No tienes cuenta? Regístrate",
  },
  hasAccount: {
    ar: "لديك حساب؟ سجل الدخول",
    en: "Already have an account? Login",
    fr: "Déjà un compte ? Connectez-vous",
    es: "¿Ya tienes cuenta? Inicia sesión",
  },
  loginSuccess: {
    ar: "تم تسجيل الدخول بنجاح",
    en: "Login successful",
    fr: "Connexion réussie",
    es: "Inicio de sesión exitoso",
  },
  welcomeBack: {
    ar: "مرحباً بك في صيدلي البيت",
    en: "Welcome to PHARMA HOME",
    fr: "Bienvenue à PHARMA MAISON",
    es: "Bienvenido a PHARMA HOGAR",
  },
  accountCreated: {
    ar: "تم إنشاء الحساب بنجاح",
    en: "Account created successfully",
    fr: "Compte créé avec succès",
    es: "Cuenta creada exitosamente",
  },
  // Inventory
  medicineInventory: {
    ar: "مخزون الأدوية",
    en: "Medicine Inventory",
    fr: "Inventaire des Médicaments",
    es: "Inventario de Medicamentos",
  },
  manageHomeMedicine: {
    ar: "إدارة أدوية المنزل",
    en: "Manage Home Medicines",
    fr: "Gérer les Médicaments à Domicile",
    es: "Gestionar Medicamentos del Hogar",
  },
  totalMedicines: {
    ar: "إجمالي الأدوية",
    en: "Total Medicines",
    fr: "Total Médicaments",
    es: "Total de Medicamentos",
  },
  expiringSoon: {
    ar: "قريب الانتهاء",
    en: "Expiring Soon",
    fr: "Expire Bientôt",
    es: "Por Vencer",
  },
  expired: {
    ar: "منتهي الصلاحية",
    en: "Expired",
    fr: "Expiré",
    es: "Vencido",
  },
  expiredAlert: {
    ar: "لديك {count} دواء منتهي الصلاحية!",
    en: "You have {count} expired medicine(s)!",
    fr: "Vous avez {count} médicament(s) expiré(s) !",
    es: "¡Tienes {count} medicamento(s) vencido(s)!",
  },
  expiringAlert: {
    ar: "لديك {count} دواء يقترب من انتهاء صلاحيته",
    en: "You have {count} medicine(s) expiring soon",
    fr: "Vous avez {count} médicament(s) qui expire(nt) bientôt",
    es: "Tienes {count} medicamento(s) por vencer pronto",
  },
  searchMedicine: {
    ar: "ابحث عن دواء...",
    en: "Search medicine...",
    fr: "Rechercher un médicament...",
    es: "Buscar medicamento...",
  },
  noResults: {
    ar: "لا توجد نتائج",
    en: "No results",
    fr: "Aucun résultat",
    es: "Sin resultados",
  },
  noMedicines: {
    ar: "لا يوجد أدوية في المخزون",
    en: "No medicines in inventory",
    fr: "Aucun médicament dans l'inventaire",
    es: "No hay medicamentos en el inventario",
  },
  addNewMedicine: {
    ar: "أضف دواء جديد",
    en: "Add New Medicine",
    fr: "Ajouter un Nouveau Médicament",
    es: "Agregar Nuevo Medicamento",
  },
  medicineName: {
    ar: "اسم الدواء",
    en: "Medicine Name",
    fr: "Nom du Médicament",
    es: "Nombre del Medicamento",
  },
  scientificName: {
    ar: "الاسم العلمي",
    en: "Scientific Name",
    fr: "Nom Scientifique",
    es: "Nombre Científico",
  },
  quantity: {
    ar: "الكمية",
    en: "Quantity",
    fr: "Quantité",
    es: "Cantidad",
  },
  expiryDate: {
    ar: "تاريخ الانتهاء",
    en: "Expiry Date",
    fr: "Date d'Expiration",
    es: "Fecha de Vencimiento",
  },
  manufacturer: {
    ar: "الشركة المصنعة",
    en: "Manufacturer",
    fr: "Fabricant",
    es: "Fabricante",
  },
  primaryUse: {
    ar: "الاستخدام الأساسي",
    en: "Primary Use",
    fr: "Utilisation Principale",
    es: "Uso Principal",
  },
  notes: {
    ar: "ملاحظات",
    en: "Notes",
    fr: "Notes",
    es: "Notas",
  },
  add: {
    ar: "إضافة",
    en: "Add",
    fr: "Ajouter",
    es: "Agregar",
  },
  adding: {
    ar: "جاري الإضافة...",
    en: "Adding...",
    fr: "Ajout en cours...",
    es: "Agregando...",
  },
  cancel: {
    ar: "إلغاء",
    en: "Cancel",
    fr: "Annuler",
    es: "Cancelar",
  },
  editMedicine: {
    ar: "تعديل الدواء",
    en: "Edit Medicine",
    fr: "Modifier le Médicament",
    es: "Editar Medicamento",
  },
  saveChanges: {
    ar: "حفظ التعديلات",
    en: "Save Changes",
    fr: "Enregistrer les Modifications",
    es: "Guardar Cambios",
  },
  updating: {
    ar: "جاري التحديث...",
    en: "Updating...",
    fr: "Mise à jour...",
    es: "Actualizando...",
  },
  showDetails: {
    ar: "عرض التفاصيل",
    en: "Show Details",
    fr: "Afficher les Détails",
    es: "Mostrar Detalles",
  },
  hideDetails: {
    ar: "إخفاء التفاصيل",
    en: "Hide Details",
    fr: "Masquer les Détails",
    es: "Ocultar Detalles",
  },
  use: {
    ar: "الاستخدام",
    en: "Use",
    fr: "Utilisation",
    es: "Uso",
  },
  daysRemaining: {
    ar: "{days} يوم متبقي",
    en: "{days} days remaining",
    fr: "{days} jours restants",
    es: "{days} días restantes",
  },
  unknown: {
    ar: "غير محدد",
    en: "Unknown",
    fr: "Inconnu",
    es: "Desconocido",
  },
  safe: {
    ar: "آمن",
    en: "Safe",
    fr: "Sûr",
    es: "Seguro",
  },
  deleted: {
    ar: "تم الحذف",
    en: "Deleted",
    fr: "Supprimé",
    es: "Eliminado",
  },
  deletedDesc: {
    ar: "تم حذف الدواء من المخزون",
    en: "Medicine removed from inventory",
    fr: "Médicament retiré de l'inventaire",
    es: "Medicamento eliminado del inventario",
  },
  added: {
    ar: "تمت الإضافة",
    en: "Added",
    fr: "Ajouté",
    es: "Agregado",
  },
  addedDesc: {
    ar: "تم إضافة الدواء إلى المخزون بنجاح",
    en: "Medicine added to inventory successfully",
    fr: "Médicament ajouté à l'inventaire avec succès",
    es: "Medicamento agregado al inventario exitosamente",
  },
  updated: {
    ar: "تم التحديث",
    en: "Updated",
    fr: "Mis à jour",
    es: "Actualizado",
  },
  updatedDesc: {
    ar: "تم تحديث بيانات الدواء بنجاح",
    en: "Medicine data updated successfully",
    fr: "Données du médicament mises à jour avec succès",
    es: "Datos del medicamento actualizados exitosamente",
  },
  error: {
    ar: "خطأ",
    en: "Error",
    fr: "Erreur",
    es: "Error",
  },
  loadError: {
    ar: "فشل في تحميل بيانات المخزون",
    en: "Failed to load inventory data",
    fr: "Échec du chargement des données de l'inventaire",
    es: "Error al cargar datos del inventario",
  },
  deleteError: {
    ar: "فشل في حذف الدواء",
    en: "Failed to delete medicine",
    fr: "Échec de la suppression du médicament",
    es: "Error al eliminar medicamento",
  },
  addError: {
    ar: "فشل في إضافة الدواء",
    en: "Failed to add medicine",
    fr: "Échec de l'ajout du médicament",
    es: "Error al agregar medicamento",
  },
  updateError: {
    ar: "فشل في تحديث الدواء",
    en: "Failed to update medicine",
    fr: "Échec de la mise à jour du médicament",
    es: "Error al actualizar medicamento",
  },
  loginRequired: {
    ar: "يجب تسجيل الدخول أولاً",
    en: "Please login first",
    fr: "Veuillez d'abord vous connecter",
    es: "Por favor inicia sesión primero",
  },
  // Symptom Search
  symptomSearch: {
    ar: "البحث بالأعراض",
    en: "Search by Symptoms",
    fr: "Recherche par Symptômes",
    es: "Buscar por Síntomas",
  },
  symptomPlaceholder: {
    ar: "اكتب الأعراض التي تشعر بها (مثل: صداع، حرارة، سعال...)",
    en: "Describe your symptoms (e.g., headache, fever, cough...)",
    fr: "Décrivez vos symptômes (ex: maux de tête, fièvre, toux...)",
    es: "Describe tus síntomas (ej: dolor de cabeza, fiebre, tos...)",
  },
  searchBySymptoms: {
    ar: "ابحث عن دواء مناسب",
    en: "Find Suitable Medicine",
    fr: "Trouver un Médicament Adapté",
    es: "Encontrar Medicamento Adecuado",
  },
  searching: {
    ar: "جاري البحث...",
    en: "Searching...",
    fr: "Recherche en cours...",
    es: "Buscando...",
  },
  suggestions: {
    ar: "الاقتراحات",
    en: "Suggestions",
    fr: "Suggestions",
    es: "Sugerencias",
  },
  medicalDisclaimer: {
    ar: "⚠️ تنبيه مهم: هذه اقتراحات فقط ولا تغني عن استشارة الطبيب. يُنصح دائماً بمراجعة طبيب مختص قبل استعمال أي دواء.",
    en: "⚠️ Important: These are suggestions only and do not replace medical consultation. Always consult a doctor before using any medication.",
    fr: "⚠️ Important: Ce sont des suggestions uniquement et ne remplacent pas une consultation médicale. Consultez toujours un médecin avant d'utiliser un médicament.",
    es: "⚠️ Importante: Estas son solo sugerencias y no reemplazan la consulta médica. Siempre consulta a un médico antes de usar cualquier medicamento.",
  },
  suggestionError: {
    ar: "حدث خطأ أثناء البحث",
    en: "Error during search",
    fr: "Erreur lors de la recherche",
    es: "Error durante la búsqueda",
  },
  // About Page
  aboutApp: {
    ar: "تعرف على التطبيق",
    en: "About the App",
    fr: "À propos de l'App",
    es: "Acerca de la App",
  },
  backToHome: {
    ar: "العودة للرئيسية",
    en: "Back to Home",
    fr: "Retour à l'Accueil",
    es: "Volver al Inicio",
  },
  aboutTitle: {
    ar: "صيدلي البيت - صيدليتك الذكية في جيبك",
    en: "PHARMA HOME - Your Smart Pharmacy in Your Pocket",
    fr: "PHARMA MAISON - Votre Pharmacie Intelligente dans Votre Poche",
    es: "PHARMA HOGAR - Tu Farmacia Inteligente en tu Bolsillo",
  },
  aboutDescription: {
    ar: "تطبيق ذكي يساعدك في إدارة أدوية منزلك وتحليل مكوناتها باستخدام الذكاء الاصطناعي",
    en: "A smart app that helps you manage your home medicines and analyze their ingredients using AI",
    fr: "Une application intelligente qui vous aide à gérer vos médicaments à domicile et à analyser leurs ingrédients avec l'IA",
    es: "Una aplicación inteligente que te ayuda a gestionar tus medicamentos del hogar y analizar sus ingredientes usando IA",
  },
  saveMoneySloganTitle: {
    ar: "وفّر أموالك مع صيدلي البيت!",
    en: "Save Your Money with PHARMA HOME!",
    fr: "Économisez Votre Argent avec PHARMA MAISON!",
    es: "¡Ahorra tu Dinero con PHARMA HOGAR!",
  },
  saveMoneySloganDesc: {
    ar: "لا تشترِ دواءً قد يكون موجوداً في بيتك! خاصية المخزون الذكي تُظهر لك كل الأدوية المتوفرة لديك، فتتجنب شراء أدوية مكررة وتوفّر مالك للأهم. اعرف ما عندك قبل ما تصرف!",
    en: "Don't buy medicine that might already be at home! The smart inventory feature shows you all your available medicines, helping you avoid duplicate purchases and save money for what matters most. Know what you have before you spend!",
    fr: "N'achetez pas de médicaments qui pourraient déjà être chez vous! La fonction d'inventaire intelligent vous montre tous vos médicaments disponibles, vous aidant à éviter les achats en double et à économiser de l'argent. Sachez ce que vous avez avant de dépenser!",
    es: "¡No compres medicamentos que podrían estar ya en casa! La función de inventario inteligente te muestra todos tus medicamentos disponibles, ayudándote a evitar compras duplicadas y ahorrar dinero. ¡Conoce lo que tienes antes de gastar!",
  },
  whatIsApp: {
    ar: "ما هو صيدلي البيت؟",
    en: "What is PHARMA HOME?",
    fr: "Qu'est-ce que PHARMA MAISON?",
    es: "¿Qué es PHARMA HOGAR?",
  },
  whatIsAppDesc: {
    ar: "صيدلي البيت هو تطبيق ثوري يحوّل هاتفك إلى صيدلي شخصي ذكي. يمكنك من خلاله تصوير أي دواء للحصول على تحليل شامل لمكوناته، إدارة مخزون أدوية منزلك، ومعرفة الدواء المناسب لأعراضك من الأدوية المتوفرة لديك. كل هذا مع تذكيرات بتواريخ انتهاء الصلاحية!",
    en: "PHARMA HOME is a revolutionary app that transforms your phone into a smart personal pharmacist. You can photograph any medicine to get a comprehensive analysis of its ingredients, manage your home medicine inventory, and find the right medicine for your symptoms from what you already have. All with expiry date reminders!",
    fr: "PHARMA MAISON est une application révolutionnaire qui transforme votre téléphone en pharmacien personnel intelligent. Vous pouvez photographier n'importe quel médicament pour obtenir une analyse complète de ses ingrédients, gérer votre inventaire de médicaments à domicile et trouver le bon médicament pour vos symptômes. Tout cela avec des rappels de dates d'expiration!",
    es: "PHARMA HOGAR es una aplicación revolucionaria que transforma tu teléfono en un farmacéutico personal inteligente. Puedes fotografiar cualquier medicamento para obtener un análisis completo de sus ingredientes, gestionar tu inventario de medicamentos del hogar y encontrar el medicamento adecuado para tus síntomas. ¡Todo con recordatorios de fechas de vencimiento!",
  },
  appFeatures: {
    ar: "مميزات التطبيق",
    en: "App Features",
    fr: "Fonctionnalités de l'App",
    es: "Características de la App",
  },
  featureAnalysis: {
    ar: "تحليل الأدوية بالصور",
    en: "Medicine Analysis by Photo",
    fr: "Analyse des Médicaments par Photo",
    es: "Análisis de Medicamentos por Foto",
  },
  featureAnalysisDesc: {
    ar: "التقط صورة لأي دواء واحصل على تحليل شامل لمكوناته وتحذيراته وطريقة استخدامه",
    en: "Take a photo of any medicine and get a comprehensive analysis of its ingredients, warnings, and usage",
    fr: "Prenez une photo de n'importe quel médicament et obtenez une analyse complète de ses ingrédients, avertissements et utilisation",
    es: "Toma una foto de cualquier medicamento y obtén un análisis completo de sus ingredientes, advertencias y uso",
  },
  featureAI: {
    ar: "ذكاء اصطناعي متقدم",
    en: "Advanced AI Technology",
    fr: "Intelligence Artificielle Avancée",
    es: "Tecnología de IA Avanzada",
  },
  featureAIDesc: {
    ar: "نستخدم أحدث تقنيات الذكاء الاصطناعي من Google Gemini لتحليل دقيق وموثوق",
    en: "We use the latest Google Gemini AI technology for accurate and reliable analysis",
    fr: "Nous utilisons la dernière technologie d'IA Google Gemini pour une analyse précise et fiable",
    es: "Usamos la última tecnología de IA de Google Gemini para un análisis preciso y confiable",
  },
  featureInventory: {
    ar: "إدارة مخزون الأدوية",
    en: "Medicine Inventory Management",
    fr: "Gestion de l'Inventaire des Médicaments",
    es: "Gestión de Inventario de Medicamentos",
  },
  featureInventoryDesc: {
    ar: "تتبع جميع أدوية منزلك في مكان واحد ووفّر أموالك بتجنب شراء أدوية موجودة عندك",
    en: "Track all your home medicines in one place and save money by avoiding duplicate purchases",
    fr: "Suivez tous vos médicaments et économisez en évitant les achats en double",
    es: "Rastrea todos tus medicamentos del hogar en un solo lugar y ahorra dinero evitando compras duplicadas",
  },
  featureSymptom: {
    ar: "البحث بالأعراض",
    en: "Symptom-Based Search",
    fr: "Recherche par Symptômes",
    es: "Búsqueda por Síntomas",
  },
  featureSymptomDesc: {
    ar: "أدخل أعراضك والتطبيق يقترح الدواء المناسب من مخزونك مع نصيحة باستشارة الطبيب",
    en: "Enter your symptoms and the app suggests suitable medicine from your inventory with advice to consult a doctor",
    fr: "Entrez vos symptômes et l'app suggère un médicament approprié de votre inventaire avec conseil de consulter un médecin",
    es: "Ingresa tus síntomas y la app sugiere el medicamento adecuado de tu inventario con consejo de consultar a un médico",
  },
  featureExpiry: {
    ar: "تنبيهات انتهاء الصلاحية",
    en: "Expiry Alerts",
    fr: "Alertes d'Expiration",
    es: "Alertas de Vencimiento",
  },
  featureExpiryDesc: {
    ar: "تنبيهات تلقائية للأدوية التي اقتربت صلاحيتها أو انتهت لحمايتك وعائلتك",
    en: "Automatic alerts for medicines approaching or past expiry to protect you and your family",
    fr: "Alertes automatiques pour les médicaments proches ou dépassés pour vous protéger",
    es: "Alertas automáticas para medicamentos próximos a vencer o vencidos para protegerte a ti y a tu familia",
  },
  featureSecurity: {
    ar: "أمان وخصوصية",
    en: "Security & Privacy",
    fr: "Sécurité et Confidentialité",
    es: "Seguridad y Privacidad",
  },
  featureSecurityDesc: {
    ar: "بياناتك محمية ومشفرة، ولا يمكن لأحد الوصول إليها سواك",
    en: "Your data is protected and encrypted, only you can access it",
    fr: "Vos données sont protégées et chiffrées, vous seul pouvez y accéder",
    es: "Tus datos están protegidos y encriptados, solo tú puedes acceder a ellos",
  },
  featureReminders: {
    ar: "تذكيرات الأدوية",
    en: "Medication Reminders",
    fr: "Rappels de Médicaments",
    es: "Recordatorios de Medicamentos",
  },
  featureRemindersDesc: {
    ar: "منبهات صوتية قوية قابلة للتخصيص لتذكيرك بمواعيد أدويتك مع إمكانية اختيار النغمة والتعديل",
    en: "Customizable loud alarms to remind you of medication times with tone selection and editing options",
    fr: "Alarmes personnalisables pour vous rappeler les heures de prise de médicaments avec sélection de tonalité",
    es: "Alarmas fuertes personalizables para recordarte los horarios de medicamentos con selección de tono y opciones de edición",
  },
  featureAlternatives: {
    ar: "البحث عن بدائل الأدوية",
    en: "Find Medicine Alternatives",
    fr: "Trouver des Alternatives aux Médicaments",
    es: "Encontrar Alternativas de Medicamentos",
  },
  featureAlternativesDesc: {
    ar: "البحث عن بدائل للأدوية غير المتوفرة باستخدام الذكاء الاصطناعي مع تفاصيل كاملة",
    en: "Find alternatives for unavailable medicines using AI with complete details",
    fr: "Trouvez des alternatives aux médicaments indisponibles grâce à l'IA avec tous les détails",
    es: "Encuentra alternativas para medicamentos no disponibles usando IA con detalles completos",
  },
  featurePrescriptions: {
    ar: "تحليل الوصفات الطبية",
    en: "Prescription Analysis",
    fr: "Analyse des Ordonnances",
    es: "Análisis de Recetas Médicas",
  },
  featurePrescriptionsDesc: {
    ar: "صوّر وصفتك الطبية المكتوبة بخط اليد والذكاء الاصطناعي يفك رموزها ويستخرج الأدوية والجرعات مع تشخيص محتمل وتفاصيل كل دواء",
    en: "Photograph your handwritten prescription and AI decodes it, extracting medicines, dosages, with a possible diagnosis and details for each medicine",
    fr: "Photographiez votre ordonnance manuscrite et l'IA la déchiffre, extrait les médicaments, les dosages, avec un diagnostic possible et les détails de chaque médicament",
    es: "Fotografía tu receta manuscrita y la IA la descifra, extrayendo medicamentos, dosis, con un diagnóstico posible y detalles de cada medicamento",
  },
  howItWorks: {
    ar: "كيف يعمل التطبيق؟",
    en: "How Does It Work?",
    fr: "Comment Ça Marche?",
    es: "¿Cómo Funciona?",
  },
  step1: {
    ar: "التقط صورة للدواء أو أضفه يدوياً إلى مخزونك",
    en: "Take a photo of the medicine or add it manually to your inventory",
    fr: "Prenez une photo du médicament ou ajoutez-le manuellement à votre inventaire",
    es: "Toma una foto del medicamento o agrégalo manualmente a tu inventario",
  },
  step2: {
    ar: "الذكاء الاصطناعي يحلل الصورة ويستخرج المعلومات",
    en: "AI analyzes the image and extracts information",
    fr: "L'IA analyse l'image et extrait les informations",
    es: "La IA analiza la imagen y extrae la información",
  },
  step3: {
    ar: "احصل على تفاصيل شاملة عن المكونات والتحذيرات",
    en: "Get comprehensive details about ingredients and warnings",
    fr: "Obtenez des détails complets sur les ingrédients et avertissements",
    es: "Obtén detalles completos sobre ingredientes y advertencias",
  },
  step4: {
    ar: "ابحث بأعراضك للعثور على الدواء المناسب من مخزونك",
    en: "Search by symptoms to find suitable medicine from your inventory",
    fr: "Recherchez par symptômes pour trouver le médicament approprié",
    es: "Busca por síntomas para encontrar el medicamento adecuado de tu inventario",
  },
  whyChooseUs: {
    ar: "لماذا تختار صيدلي البيت؟",
    en: "Why Choose PHARMA HOME?",
    fr: "Pourquoi Choisir PHARMA MAISON?",
    es: "¿Por Qué Elegir PHARMA HOGAR?",
  },
  advantage1: {
    ar: "يوفّر لك المال بتجنب شراء أدوية موجودة في بيتك",
    en: "Saves you money by avoiding purchasing medicines already at home",
    fr: "Vous fait économiser en évitant d'acheter des médicaments déjà chez vous",
    es: "Te ahorra dinero evitando comprar medicamentos que ya tienes en casa",
  },
  advantage2: {
    ar: "يدعم اللغة العربية والإنجليزية والفرنسية",
    en: "Supports Arabic, English, and French",
    fr: "Supporte l'arabe, l'anglais et le français",
    es: "Soporta árabe, inglés, francés y español",
  },
  advantage3: {
    ar: "يعمل بدون إنترنت للوظائف الأساسية",
    en: "Works offline for basic functions",
    fr: "Fonctionne hors ligne pour les fonctions de base",
    es: "Funciona sin conexión para funciones básicas",
  },
  advantage4: {
    ar: "تحديثات مستمرة وميزات جديدة",
    en: "Continuous updates and new features",
    fr: "Mises à jour continues et nouvelles fonctionnalités",
    es: "Actualizaciones continuas y nuevas funciones",
  },
  advantage5: {
    ar: "دعم فني سريع ومتجاوب",
    en: "Fast and responsive technical support",
    fr: "Support technique rapide et réactif",
    es: "Soporte técnico rápido y receptivo",
  },
  startNow: {
    ar: "ابدأ الآن",
    en: "Start Now",
    fr: "Commencer Maintenant",
    es: "Comenzar Ahora",
  },
  continueWithGoogle: {
    ar: "المتابعة بحساب Google",
    en: "Continue with Google",
    fr: "Continuer avec Google",
    es: "Continuar con Google",
  },
  orContinueWith: {
    ar: "أو المتابعة بـ",
    en: "Or continue with",
    fr: "Ou continuer avec",
    es: "O continuar con",
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
