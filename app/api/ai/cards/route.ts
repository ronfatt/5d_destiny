import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildCardImagePrompt } from "@/lib/card-visual-prompts";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";

const requestSchema = z.object({
  cardKey: z.string().min(1),
  mode: z.enum(["prompt", "image"]).default("image"),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).default("1024x1024")
});

export async function POST(request: NextRequest) {
  try {
    const parsed = requestSchema.parse(await request.json());
    const built = buildCardImagePrompt(parsed.cardKey);

    if (parsed.mode === "prompt") {
      return NextResponse.json({
        data: {
          cardKey: built.card.cardKey,
          name: built.card.name,
          prompt: built.prompt,
          negativePrompt: built.negativePrompt
        }
      });
    }

    if (!hasOpenAIKey()) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const client = getOpenAIClient();
    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: `${built.prompt}. Avoid: ${built.negativePrompt}.`,
      size: parsed.size,
      quality: "high"
    });

    const first = image.data?.[0];
    const base64 = first?.b64_json;

    if (!base64) {
      return NextResponse.json({ error: "OpenAI did not return image data." }, { status: 502 });
    }

    return NextResponse.json({
      data: {
        cardKey: built.card.cardKey,
        name: built.card.name,
        prompt: built.prompt,
        negativePrompt: built.negativePrompt,
        imageBase64: base64,
        mimeType: "image/png"
      }
    });
  } catch (error) {
    console.error("POST /api/ai/cards failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate card image." },
      { status: 500 }
    );
  }
}
