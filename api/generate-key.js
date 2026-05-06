const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')
const crypto = require('crypto')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { captchaToken, sessionToken } = req.body
  if (!captchaToken || !sessionToken) return res.status(400).json({ error: 'Missing required fields' })

  // Verify hCaptcha
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

  // Validate session
  const { data: session, error: sessionError } = await supabase
    .from('key_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single()

  if (sessionError || !session) return res.status(404).json({ error: 'Invalid session' })
  if (session.used) return res.status(400).json({ error: 'Session already used' })
  if (new Date() > new Date(session.expires_at)) return res.status(400).json({ error: 'Session expired' })

  // Generate API key
  const apiKey = `vapi_${crypto.randomBytes(24).toString('hex')}`
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const expiresAt = new Date(Date.now() + 8 * 3.6e6).toISOString()

  // Store license
  const { error: licenseError } = await supabase.from('licenses').insert([{
    api_key: apiKey,
    session_token: sessionToken,
    ip_address: ipAddress,
    expires_at: expiresAt,
    status: 'ACTIVE'
  }])

  if (licenseError) return res.status(500).json({ error: 'Failed to generate key' })

  // Mark session used
  await supabase.from('key_sessions').update({ used: true }).eq('session_token', sessionToken)

  res.status(200).json({ apiKey, expiresAt })
}
