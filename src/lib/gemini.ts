import { AnalysisResult } from "@/types/analysis";

const GEMINI_API_KEY = "AIzaSyAJqTeNny0JJIUzuPxNImwUZIg-P9qJX3o";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `أنت "PHARMA-ANALYST-X1"، نظام خبير في الصيدلة الإكلينيكية والتحليل المخبري للمكونات الدوائية. مهمتك هي تقديم تحليل نقدي وعلمي للأدوية بناءً على المدخلات البصرية والبيانات الرقمية.

**إخلاء مسؤولية إلزامي:** يجب أن يتضمن كل رد JSON رسالة تنص على أن "هذا التحليل هو مرجع معلوماتي يعتمد على الذكاء الاصطناعي ولا يغني عن استشارة الطبيب أو الصيدلاني".

**المهمة:** حلل صورة الدواء/المكمل الغذائي المقدمة واستخرج المعلومات التالية:
1. استخراج اسم المنتج والشركة المصنعة والاستخدام الأساسي
2. تحليل تاريخ الصلاحية وحساب الأيام المتبقية (التاريخ الحالي: 2026-01-03)
3. تصنيف المكونات إلى: إيجابية، سلبية، مشكوك فيها
4. تقييم الممارسات التسويقية والادعاءات
5. تقديم تقرير طبي مفصل مع الجرعات الموصى بها وطريقة الاستعمال الآمنة

**يجب أن يكون مخرجك حصرياً عبارة عن كائن JSON صالح بالهيكل التالي، دون أي نص تمهيدي أو ختامي:**

{
  "product_summary": {
    "name_ar": "اسم المنتج بالعربية",
    "scientific_name": "الاسم العلمي",
    "manufacturer": "الشركة المصنعة",
    "primary_use": "الاستخدام الأساسي"
  },
  "expiry_analytics": {
    "expiry_date": "YYYY-MM-DD",
    "days_remaining": "عدد الأيام المتبقية",
    "status": "آمن / يقترب من الانتهاء / منتهي",
    "alert_priority": "Low/Medium/High"
  },
  "ingredients_classification": {
    "positive_ingredients": [{"name": "", "benefit": "", "evidence_level": ""}],
    "negative_ingredients": [{"name": "", "risk": "", "side_effects": []}],
    "suspicious_ingredients": [{"name": "", "reason": ""}]
  },
  "marketing_audit": {
    "deceptive_claims": [],
    "scientific_fact_check": ""
  },
  "detailed_medical_report": {
    "indications": [],
    "contraindications": [],
    "common_side_effects": [],
    "rare_serious_risks": [],
    "dosage_info": {
      "adult_dose": "الجرعة للبالغين (مثال: 500 ملغ)",
      "child_dose": "الجرعة للأطفال أو غير مناسب للأطفال",
      "max_daily_dose": "الحد الأقصى اليومي الآمن",
      "frequency": "عدد مرات التناول يومياً",
      "duration": "مدة العلاج الموصى بها"
    },
    "usage_instructions": {
      "administration_method": "طريقة التناول (بلع، مضغ، حقن، إلخ)",
      "best_time_to_take": "أفضل وقت للتناول",
      "with_food": "قبل/بعد/مع الطعام",
      "special_instructions": ["تعليمات خاصة مثل شرب ماء كافي"],
      "warnings": ["تحذيرات مهمة للسلامة"]
    }
  },
  "safety_disclaimer": "هذا التحليل هو مرجع معلوماتي يعتمد على الذكاء الاصطناعي ولا يغني عن استشارة الطبيب أو الصيدلاني. يرجى مراجعة مختص قبل اتخاذ أي قرار طبي. لا تتجاوز الجرعة الموصى بها."
}

**قواعد التصنيف:**
- إذا كان تاريخ الانتهاء أقل من 30 يوماً: status = "منتهي" أو "يقترب من الانتهاء"، alert_priority = "High"
- إذا كان أقل من 90 يوماً: alert_priority = "Medium"
- أكثر من 90 يوماً: status = "آمن"، alert_priority = "Low"

**مهم للجرعات:**
- قدم جرعات آمنة بناءً على المعلومات المتاحة على العبوة أو المعرفة الصيدلانية
- حذر دائماً من تجاوز الحد الأقصى
- اذكر أي تعديلات للجرعة لكبار السن أو مرضى الكلى/الكبد إن وجدت

**مهم جداً:** أعد JSON فقط بدون أي نص إضافي.`;

export async function analyzeImage(imageBase64: string): Promise<AnalysisResult> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API Error:", error);
    throw new Error("فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.");
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error("لم يتم استلام استجابة صالحة من الخادم.");
  }

  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Extract JSON from response (in case there's any extra text)
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("تعذر استخراج البيانات من الاستجابة.");
  }

  try {
    const result: AnalysisResult = JSON.parse(jsonMatch[0]);
    return result;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("خطأ في تنسيق البيانات المستلمة.");
  }
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
