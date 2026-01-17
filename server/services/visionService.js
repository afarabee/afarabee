import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function identifyBrick(imageBase64, mediaType) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
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
            text: `You are a LEGO brick expert. Analyze this image and identify the LEGO piece(s) shown.

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

Important: Only return valid JSON, no other text.`
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
      bricks: [],
      suggestions: [],
      message: "Oops! I had trouble understanding what I saw. Try taking another picture with better lighting! 📸",
      rawResponse: textContent.text
    };
  }
}
