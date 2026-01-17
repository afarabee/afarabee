import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SINGLE_BRICK_PROMPT = `You are a LEGO brick expert. Analyze this image and identify the LEGO piece(s) shown.

Please provide the following information in JSON format:
{
  "identified": true/false,
  "bricks": [
    {
      "name": "Official LEGO name of the brick",
      "partNumber": "LEGO part number if known (e.g., 3001, 3003, etc.)",
      "category": "Category (e.g., Brick, Plate, Tile, Slope, Technic, etc.)",
      "dimensions": "Dimensions (e.g., 2x4, 1x2, etc.)",
      "color": "Color of the brick",
      "description": "Brief kid-friendly description",
      "confidence": "high/medium/low",
      "funFact": "A fun fact about this brick type that kids would enjoy"
    }
  ],
  "suggestions": ["List of LEGO sets or builds this brick could be used in"],
  "message": "A friendly, encouraging message for the user (keep it fun for kids!)"
}

If you cannot identify the image as LEGO bricks, set "identified" to false and provide a friendly message explaining what you see instead.

Important: Only return valid JSON, no other text.`;

const BATCH_MODE_PROMPT = `You are a LEGO brick expert helping to catalog a collection. Analyze this image and identify AS MANY distinct LEGO pieces as you can see clearly.

IMPORTANT: This is BATCH MODE - identify multiple different brick types visible in the image. Focus on pieces you can see clearly enough to identify. Group identical pieces together (e.g., if you see 5 red 2x4 bricks, list it once with an approximate count).

Please provide the following information in JSON format:
{
  "identified": true/false,
  "batchMode": true,
  "totalPiecesEstimate": "Rough estimate of total pieces visible (e.g., '50-100 pieces')",
  "bricks": [
    {
      "name": "Official LEGO name of the brick",
      "partNumber": "LEGO part number if known (e.g., 3001, 3003, etc.)",
      "category": "Category (e.g., Brick, Plate, Tile, Slope, Technic, etc.)",
      "dimensions": "Dimensions (e.g., 2x4, 1x2, etc.)",
      "color": "Color(s) seen",
      "approximateCount": "How many of this type you can see (e.g., '3-5', '10+', 'many')",
      "description": "Brief kid-friendly description",
      "confidence": "high/medium/low"
    }
  ],
  "categories": {
    "bricks": 0,
    "plates": 0,
    "tiles": 0,
    "slopes": 0,
    "technic": 0,
    "specialty": 0,
    "minifigParts": 0,
    "other": 0
  },
  "interestingFinds": ["List any rare, unusual, or notable pieces you spotted"],
  "suggestions": ["What could be built with this collection"],
  "message": "A friendly summary message about the collection (keep it fun for kids!)"
}

Tips for batch identification:
- Prioritize pieces you can clearly identify
- Include common pieces like standard bricks, plates, and slopes
- Note any specialty pieces (wheels, windows, minifig parts, etc.)
- It's okay to have lower confidence for pieces partially visible

Important: Only return valid JSON, no other text.`;

export async function identifyBrick(imageBase64, mediaType, batchMode = false) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: batchMode ? 4096 : 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: batchMode ? BATCH_MODE_PROMPT : SINGLE_BRICK_PROMPT
          },
        ],
      },
    ],
  });

  // Parse the JSON response
  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent) {
    throw new Error('No text response from vision API');
  }

  try {
    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = textContent.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    // If parsing fails, return a structured error response
    return {
      identified: false,
      batchMode,
      bricks: [],
      suggestions: [],
      message: "Oops! I had trouble understanding what I saw. Try taking another picture with better lighting! 📸",
      rawResponse: textContent.text
    };
  }
}
