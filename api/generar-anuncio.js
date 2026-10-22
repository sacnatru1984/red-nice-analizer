// Función serverless de Vercel: genera el anuncio llamando a la API de
// Anthropic del lado del servidor. Nunca expone la API key al navegador.
// Requiere la variable de entorno ANTHROPIC_API_KEY configurada en Vercel
// (Project Settings → Environment Variables).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({
      error: 'Falta configurar ANTHROPIC_API_KEY en las variables de entorno de Vercel.',
    })
    return
  }

  const { prompt } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Falta el prompt.' })
    return
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!r.ok) {
      const detalle = await r.text().catch(() => '')
      res.status(r.status).json({ error: `Error de Anthropic (${r.status}): ${detalle}` })
      return
    }

    const data = await r.json()
    const texto = data?.content?.find(b => b.type === 'text')?.text || ''
    res.status(200).json({ texto })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Error desconocido al generar el anuncio.' })
  }
}
