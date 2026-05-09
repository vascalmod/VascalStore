const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { captchaToken, sessionToken } = req.body
  if (!captchaToken || !sessionToken) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY,
        response: captchaToken,
        remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      })
    })
    const captchaData = await captchaRes.json()
    if (!captchaData.success) return res.status(400).json({ error: 'Captcha verification failed' })

    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) return res.status(404).json({ error: 'Invalid session' })
    if (!session.active) return res.status(400).json({ error: 'Session has been deactivated' })
    if (new Date() > new Date(session.expires_at)) return res.status(400).json({ error: 'Session expired' })

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const generatedKey = Array.from(crypto.randomBytes(12), b => chars[b % 36]).join('')
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const expiresAt = new Date(Date.now() + 3.6e6).toISOString()

    const { error: licenseError } = await supabase.from('licenses').insert([{
      key: generatedKey,
      token: sessionToken,
      ip_address: ipAddress,
      expires_at: expiresAt,
      status: 'active',
      max_devices: 1,
      duration_seconds: 3600
    }])

    if (licenseError) return res.status(500).json({ error: 'Database error: ' + licenseError.message })

    res.status(200).json({ apiKey: generatedKey, expiresAt })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}
