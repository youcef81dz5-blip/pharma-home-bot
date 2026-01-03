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
الاسم العلمي: ${scientificName || "غير متوفر"}
الاستخدام الأساسي: ${primaryUse || "غير متوفر"}

قدم 3-5 بدائل متاحة لهذا الدواء مع ذكر:
1. اسم البديل
2. الاسم العلمي للبديل
3. الشركة المصنعة (إن أمكن)
4. سبب كونه بديلاً مناسباً

ملاحظة: يجب أن تكون البدائل من نفس الفئة العلاجية وتحتوي على نفس المادة الفعالة أو مادة مشابهة.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت صيدلاني خبير متخصص في البدائل الدوائية. قدم إجابات دقيقة وموثوقة." },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_alternatives",
              description: "Return medicine alternatives",
              parameters: {
                type: "object",
                properties: {
                  alternatives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "اسم البديل" },
                        scientific_name: { type: "string", description: "الاسم العلمي" },
                        manufacturer: { type: "string", description: "الشركة المصنعة" },
                        reason: { type: "string", description: "سبب كونه بديلاً مناسباً" }
                      },
                      required: ["name", "scientific_name", "reason"]
                    }
                  },
                  disclaimer: { type: "string", description: "إخلاء مسؤولية طبي" }
                },
                required: ["alternatives", "disclaimer"]
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
        disclaimer: content || "لم يتم العثور على بدائل",
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
