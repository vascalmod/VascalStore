const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { captchaToken } = req.body
  if (!captchaToken) return res.status(400).json({ error: 'Captcha token required' })

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

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const fifteenMinAgo = new Date(Date.now() - 15 * 6e4).toISOString()
    const { count } = await supabase
      .from('key_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', fifteenMinAgo)
    
    if (count >= 5) return res.status(429).json({ error: 'Too many requests' })

    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 6e4).toISOString()

    const { error } = await supabase.from('key_sessions').insert([{
      session_token: sessionToken,
      ip_address: ipAddress,
      expires_at: expiresAt,
      used: false
    }])

    if (error) return res.status(500).json({ error: 'Failed to create session' })
    res.status(200).json({ sessionToken })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
