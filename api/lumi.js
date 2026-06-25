const MISTRAL_API_KEY = "ELP4bhkySYorvrITT4DykMTv429izUub"; 
const MISTRAL_AGENT_ID = "ag_019f00cd3c3177a38634d562805ffcaa"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/agents/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        agent_id: MISTRAL_AGENT_ID,
        messages: messages,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: error || "Mistral API error" });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Pas de réponse";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
