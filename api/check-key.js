const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { apiKey } = req.body
  if (!apiKey) return res.status(400).json({ error: 'API key required' })

  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('api_key', apiKey)
      .single()

    if (error || !data) return res.status(404).json({ error: 'API key not found' })

    const status = new Date() > new Date(data.expires_at) ? 'EXPIRED' : 'ACTIVE'
    res.status(200).json({ status })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
