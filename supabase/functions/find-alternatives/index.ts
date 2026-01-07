import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicineName, scientificName, primaryUse } = await req.json();

    if (!medicineName) {
      return new Response(
        JSON.stringify({ error: "اسم الدواء مطلوب" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `أنت صيدلاني خبير. المستخدم يبحث عن بدائل للدواء التالي:
    
اسم الدواء: ${medicineName}
الاسم العلمي (المادة الفعالة): ${scientificName || "غير متوفر"}
الاستخدام الأساسي: ${primaryUse || "غير متوفر"}

⚠️ تعليمات مهمة جداً:
- قدم فقط الأدوية التي تحتوي على نفس المادة الفعالة (Generic Name) بالضبط
- لا تقترح أي بدائل علاجية مختلفة حتى لو كانت تعالج نفس المرض
- البدائل المطلوبة هي أسماء تجارية مختلفة لنفس المادة الفعالة فقط

قدم 3-5 بدائل متاحة مع ذكر:
1. اسم البديل التجاري
2. الاسم العلمي (يجب أن يكون مطابقاً للدواء الأصلي)
3. الشركة المصنعة
4. ملاحظة بسيطة (مثل: التركيز، الشكل الصيدلاني)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت صيدلاني خبير. مهمتك هي إيجاد أسماء تجارية بديلة تحتوي على نفس المادة الفعالة بالضبط. لا تقترح أدوية بمواد فعالة مختلفة أبداً." },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_alternatives",
              description: "Return medicine alternatives with same active ingredient only",
              parameters: {
                type: "object",
                properties: {
                  alternatives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "اسم البديل التجاري" },
                        scientific_name: { type: "string", description: "الاسم العلمي (المادة الفعالة) - يجب أن يكون مطابقاً" },
                        manufacturer: { type: "string", description: "الشركة المصنعة" },
                        reason: { type: "string", description: "ملاحظة عن التركيز أو الشكل الصيدلاني" }
                      },
                      required: ["name", "scientific_name", "reason"]
                    }
                  }
                },
                required: ["alternatives"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_alternatives" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات. حاول مرة أخرى لاحقاً." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد للمتابعة." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "خطأ في البحث عن البدائل" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data));

    // Extract tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to content if no tool call
    const content = data.choices?.[0]?.message?.content;
    return new Response(
      JSON.stringify({ 
        alternatives: [], 
        raw: content 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in find-alternatives function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير معروف" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});