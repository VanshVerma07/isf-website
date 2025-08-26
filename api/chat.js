export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'No message provided' })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: message }] }]
        })
      }
    )

    const data = await response.json()
    if (data?.candidates?.length) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text })
    } else {
      return res.status(500).json({ error: 'No response from Gemini API' })
    }
  } catch (error) {
    console.error('Error in chat API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
