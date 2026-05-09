const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ipHash = crypto.createHash('sha256').update(ipAddress).digest('hex')

    const { data, error } = await supabase
      .from('trigger_tokens')
      .select('token')
      .eq('ip_hash', ipHash)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return res.status(404).json({ error: 'No valid access token found. Please start from the homepage.' })

    res.status(200).json({ triggerToken: data.token })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}
