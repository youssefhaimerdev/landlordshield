import { GoogleGenerativeAI } from '@google/generative-ai'

const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const MODEL  = 'gemini-2.0-flash'

// Strip markdown code fences from Gemini's response
function stripFences(text) {
  return text.replace(/```json/g, '').replace(/```/g, '').trim()
}

// ── Summarise a new landlord law in plain English ─────────────
export async function summarizeLaw(billTitle, billText, state) {
  const model = getGenAI().getGenerativeModel({ model: MODEL })

  const prompt = [
    `You are a plain-English legal translator for residential landlords in ${state}, USA.`,
    '',
    `New legislation: "${billTitle}"`,
    '',
    'Bill text excerpt:',
    billText.slice(0, 3000),
    '',
    'Return ONLY a valid JSON object with exactly these fields:',
    '{',
    '  "summary": "2-3 sentence plain-English explanation of what changed and why it matters",',
    '  "action": "Specific 1-2 sentence action the landlord must take",',
    '  "deadline": "The compliance deadline if stated, or null",',
    '  "alertLevel": "high | medium | low",',
    '  "affectsPropertyTypes": ["single-family", "multi-family", "apartment-complex", "short-term-rental"]',
    '}',
    '',
    'No preamble, no markdown fences, no explanation. Just the JSON.',
  ].join('\n')

  try {
    const result = await model.generateContent(prompt)
    const raw    = result.response.text()
    return JSON.parse(stripFences(raw))
  } catch (err) {
    console.error('Gemini summarizeLaw error:', err.message)
    return null
  }
}

// ── Answer a landlord question in plain English ───────────────
export async function answerLandlordQuestion(question, state, recentLawsContext) {
  const model = getGenAI().getGenerativeModel({ model: MODEL })

  const prompt = [
    `You are a knowledgeable landlord-tenant law assistant for ${state}, USA.`,
    '',
    `Recent law changes in ${state}:`,
    recentLawsContext,
    '',
    `Landlord question: ${question}`,
    '',
    'Answer in plain English, referencing specific laws where relevant. Under 200 words.',
    'End with: "Note: This is general information, not legal advice."',
  ].join('\n')

  const result = await model.generateContent(prompt)
  return result.response.text()
}
