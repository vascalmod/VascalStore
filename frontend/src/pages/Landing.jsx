import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import AdPlaceholder from '../components/AdPlaceholder'
import Countdown from '../components/Countdown'

export default function Landing() {
  const [countdownDone, setCountdownDone] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGetKey = async () => {
    if (!countdownDone || !captchaToken) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create session')
      navigate(`/request?session=${data.sessionToken}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 md:px-8 relative">
      <AdPlaceholder position="top" />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            VascalAPI
          </h1>
          <p className="text-slate-400 text-lg">Generate secure temporary API keys in seconds</p>
        </div>

        <AdPlaceholder position="middle" />

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl">
          <Countdown duration={5} onComplete={() => setCountdownDone(true)} />

          <div className="mb-6">
            <HCaptcha
              ref={useRef(null)}
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
              onVerify={setCaptchaToken}
              onError={() => setError('Captcha verification failed')}
              theme="dark"
            />
          </div>

          {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

          <button
            onClick={handleGetKey}
            disabled={!countdownDone || !captchaToken || loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
          >
            {loading ? 'Creating Session...' : 'Get Your Key'}
          </button>
        </div>
      </div>

      <AdPlaceholder position="sticky-mobile" />
    </div>
  )
}
