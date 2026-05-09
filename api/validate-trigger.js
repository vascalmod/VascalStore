const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { triggerToken } = req.body
  if (!triggerToken) return res.status(400).json({ error: 'Trigger token required' })

  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ipHash = crypto.createHash('sha256').update(ipAddress).digest('hex')

    // Fetch trigger token
    const { data: trigger, error } = await supabase
      .from('trigger_tokens')
      .select('*')
      .eq('token', triggerToken)
      .single()

    if (error || !trigger) {
      return res.status(404).json({ error: 'Session authorization not found' })
    }

    if (trigger.used) {
      return res.status(400).json({ error: 'Session authorization has already been used' })
    }

    if (new Date() > new Date(trigger.expires_at)) {
      return res.status(400).json({ error: 'Session authorization expired. Please request a new access session.' })
    }

    // Optional: validate IP hash match
    // if (trigger.ip_hash !== ipHash) {
    //   return res.status(403).json({ error: 'IP address mismatch' })
    // }

    // Mark trigger as used
    const { error: updateError } = await supabase
      .from('trigger_tokens')
      .update({ used: true })
      .eq('token', triggerToken)

    if (updateError) return res.status(500).json({ error: 'Failed to invalidate trigger' })

    // Create real session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const sessionExpiresAt = new Date(Date.now() + 60 * 6e4).toISOString()

    const { error: sessionError } = await supabase.from('user_sessions').insert([{
      session_token: sessionToken,
      expires_at: sessionExpiresAt,
      active: true,
      ip_hash: ipHash
    }])

    if (sessionError) return res.status(500).json({ error: 'Failed to create session' })

    res.status(200).json({ sessionToken, expiresAt: sessionExpiresAt })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
