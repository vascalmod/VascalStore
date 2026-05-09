const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sessionToken } = req.body
  if (!sessionToken) return res.status(400).json({ error: 'Session token required' })

  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Session not found' })

    if (!data.active) return res.status(400).json({ error: 'Session has been deactivated' })

    if (new Date() > new Date(data.expires_at)) {
      return res.status(400).json({ error: 'Your secure session has expired. Please generate a new access session.' })
    }

    res.status(200).json({ valid: true, expiresAt: data.expires_at, createdAt: data.created_at })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
