'use server';

export async function getWritingFeedback(prompt: string, essay: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return 'Great effort! Focus on thesis clarity, transition words, and academic vocabulary.';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a TOEFL ITP writing evaluator. The prompt was: "${prompt}". The student wrote: "${essay}". Give 2-3 sentences of specific, actionable feedback focusing on: thesis clarity, transition words, and academic vocabulary. Be encouraging but honest. Keep it under 60 words.`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Keep practicing — you are improving!';
  } catch {
    return 'Great effort! Focus on using varied vocabulary and complete sentences.';
  }
}
