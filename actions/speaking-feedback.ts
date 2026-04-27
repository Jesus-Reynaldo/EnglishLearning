'use server';

export async function getSpeakingFeedback(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return 'Good practice! Try to use chunk phrases naturally and vary your vocabulary.';

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
                  text: `You are a TOEFL TSE speaking coach. The student just practiced this prompt: "${prompt}". Give 2-3 specific tips for this topic focusing on: using chunk phrases naturally, avoiding simple "I usually + verb" structures, and pronunciation of key words. Encourage them to use varied vocabulary. Under 60 words.`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Keep practicing!';
  } catch {
    return 'Good effort! Focus on using chunk phrases naturally and maintaining fluency.';
  }
}
