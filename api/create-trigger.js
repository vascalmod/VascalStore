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

    // Rate limit: max 3 trigger creations per 10 minutes per IP
    const tenMinAgo = new Date(Date.now() - 10 * 6e4).toISOString()
    const { count } = await supabase
      .from('trigger_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', tenMinAgo)

    if (count >= 3) return res.status(429).json({ error: 'Rate limit exceeded. Please wait before requesting a new session.' })

    // Generate secure trigger token
    const triggerToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3 * 6e4).toISOString()

    const { error } = await supabase.from('trigger_tokens').insert([{
      token: triggerToken,
      expires_at: expiresAt,
      used: false,
      ip_hash: ipHash
    }])

    if (error) return res.status(500).json({ error: 'Failed to create trigger token' })

    const baseUrl = process.env.SITE_URL || `https://${req.headers.host}`
    const shortlinkDomain = process.env.SHORTLINK_DOMAIN || baseUrl
    const redirectUrl = `${shortlinkDomain}/session?trigger=${triggerToken}`

    res.status(200).json({ redirectUrl, triggerToken })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
