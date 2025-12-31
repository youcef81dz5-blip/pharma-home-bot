import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, medicines } = await req.json();
    
    if (!symptoms || !medicines || medicines.length === 0) {
      return new Response(
        JSON.stringify({ error: "Symptoms and medicines are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const medicineList = medicines.map((m: any) => 
      `- ${m.name_ar}${m.scientific_name ? ` (${m.scientific_name})` : ''}: ${m.primary_use || 'غير محدد'}`
    ).join('\n');

    const systemPrompt = `أنت صيدلي خبير ومساعد طبي. مهمتك هي اقتراح الأدوية المناسبة من قائمة الأدوية المتوفرة بناءً على الأعراض المذكورة.

قواعد مهمة:
1. اقترح فقط من الأدوية المتوفرة في القائمة
2. اشرح سبب اقتراح كل دواء بشكل مختصر
3. رتب الاقتراحات حسب الأنسب للأعراض
4. إذا لم يكن هناك دواء مناسب، قل ذلك بوضوح
5. ذكّر دائماً بأهمية استشارة الطبيب

الأدوية المتوفرة في المخزون:
${medicineList}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `الأعراض: ${symptoms}\n\nاقترح الأدوية المناسبة من المخزون المتوفر.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار في استخدام الخدمة" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "لم يتم العثور على اقتراحات";

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in suggest-medicine:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
