const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sessionToken } = req.body
  if (!sessionToken) return res.status(400).json({ error: 'Session token required' })

  const { data, error } = await supabase
    .from('key_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Session not found' })
  if (data.used) return res.status(400).json({ error: 'Session already used' })
  if (new Date() > new Date(data.expires_at)) return res.status(400).json({ error: 'Session expired' })

  res.status(200).json({ valid: true })
}
