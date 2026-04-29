import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "PHARMA-ANALYST-X1"، نظام خبير في الصيدلة الإكلينيكية والتحليل المخبري للمكونات الدوائية. مهمتك هي تقديم تحليل نقدي وعلمي للأدوية بناءً على المدخلات البصرية والبيانات الرقمية.

**إخلاء مسؤولية إلزامي:** يجب أن يتضمن كل رد JSON رسالة تنص على أن "هذا التحليل هو مرجع معلوماتي يعتمد على الذكاء الاصطناعي ولا يغني عن استشارة الطبيب أو الصيدلاني".

**المهمة:** حلل صورة الدواء/المكمل الغذائي المقدمة واستخرج المعلومات التالية:
1. استخراج اسم المنتج والشركة المصنعة والاستخدام الأساسي
2. تحليل تاريخ الصلاحية وحساب الأيام المتبقية
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

**مهم جداً:** أعد JSON فقط بدون أي نص إضافي.`;

// ~5MB base64 limit (~3.75MB raw)
const MAX_BASE64_LENGTH = 7_000_000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ---- Input validation ----
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : null;
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Image is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return new Response(JSON.stringify({ error: "Image too large (max ~5MB)" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleaned = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const today = new Date().toISOString().slice(0, 10);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\nالتاريخ الحالي: ${today}` },
          {
            role: "user",
            content: [
              { type: "text", text: "حلل صورة المنتج وأعد JSON صالحاً فقط." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${cleaned}` } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار في استخدام الخدمة" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "تعذر استخراج البيانات من الاستجابة." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
