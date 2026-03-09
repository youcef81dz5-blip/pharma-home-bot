import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, language } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Image is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lang = language || "ar";

    const systemPrompt = `You are an expert clinical pharmacist and medical prescription reader. Your task is to analyze a photo of a medical prescription (which is very likely handwritten in difficult-to-read handwriting) and extract ALL medicines mentioned in it with maximum accuracy.

CRITICAL RULES:
1. Be extremely careful reading handwritten text. Cross-reference medicine names with known pharmaceutical databases.
2. If a medicine name is ambiguous, provide the most likely interpretation and note any alternatives.
3. Extract dosage, frequency, and duration for each medicine if visible.
4. Provide a comprehensive medical summary of what condition(s) these medicines together suggest.
5. Use reliable medical sources (WHO, FDA, EMA, pharmacopeias) for your analysis.
6. Respond in ${lang === "ar" ? "Arabic" : lang === "fr" ? "French" : lang === "es" ? "Spanish" : "English"}.

You MUST return ONLY valid JSON in this exact format:
{
  "medicines": [
    {
      "name": "Medicine commercial name",
      "scientific_name": "Active ingredient / INN name",
      "dosage": "Dosage written on prescription (e.g., 500mg)",
      "frequency": "How often to take (e.g., 3 times daily)",
      "duration": "For how long (e.g., 7 days)",
      "form": "Tablet/Capsule/Syrup/Injection/etc.",
      "primary_use": "Main therapeutic use",
      "side_effects": ["common side effect 1", "side effect 2"],
      "contraindications": ["contraindication 1", "contraindication 2"],
      "warnings": ["important warning 1"],
      "interactions": ["drug interaction 1"],
      "confidence": "high/medium/low - your confidence in reading this medicine name"
    }
  ],
  "diagnosis_summary": "Based on the combination of prescribed medicines, the likely condition(s) being treated are...",
  "general_advice": "General medical advice related to this prescription",
  "doctor_notes": "Any additional notes visible on the prescription",
  "prescription_date": "Date if visible on prescription or null"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this medical prescription image carefully. Extract all medicines and provide a comprehensive analysis. Pay special attention to handwritten text."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from the response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      result = { 
        medicines: [], 
        diagnosis_summary: content,
        general_advice: "",
        doctor_notes: "",
        prescription_date: null
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-prescription:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
