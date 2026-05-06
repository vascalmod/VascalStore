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
      
      <div className="max-w-4xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            VascalAPI
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-3">
            Generate free temporary API keys with automatic 8-hour renewal access.
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mb-8">
            This page allows users to generate unlimited temporary keys. Ads on this website help support the developer and maintain the service.
          </p>

          {/* HIGHLIGHTED INFO CARD */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-6 max-w-md mx-auto shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <h3 className="text-cyan-400 font-bold text-lg mb-4">⚡ Free Key System</h3>
            <ul className="text-slate-300 text-sm space-y-3 text-left">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 text-lg">✓</span> Unlimited key generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 text-lg">✓</span> 8-hour key duration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 text-lg">✓</span> Secure verification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 text-lg">✓</span> Fast API access
              </li>
            </ul>
          </div>
        </div>

        {/* SUPPORT / MONETIZATION SECTION */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            Support The Developer
          </h2>
          <p className="text-slate-400 mb-6">
            Ads displayed on this page help maintain servers, API infrastructure, and future updates for VascalAPI.
          </p>

          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">
              Want a Private License Key?
            </h3>
            <p className="text-slate-400 mb-6">
              If you want a private license key with extended access or premium features, you can directly contact the developer.
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto py-3 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] rounded-lg font-medium transition-all text-center"
            >
              DM To Order Key
            </a>
          </div>
        </div>

        {/* OPTIONAL COUNTERS & STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-sm text-slate-400 mb-1">Online Users</div>
            <div className="text-2xl font-bold text-cyan-400">1,247</div>
            <div className="text-xs text-slate-500">Placeholder</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 text-center hover:border-blue-500/30 transition-colors">
            <div className="text-sm text-slate-400 mb-1">Keys Generated</div>
            <div className="text-2xl font-bold text-blue-400">89,321</div>
            <div className="text-xs text-slate-500">Placeholder</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 text-center hover:border-green-500/30 transition-colors">
            <div className="text-sm text-slate-400 mb-1">API Status</div>
            <div className="text-2xl font-bold text-green-400">ONLINE</div>
            <div className="text-xs text-slate-500">All systems operational</div>
          </div>
        </div>

        <AdPlaceholder position="middle" />

        {/* AUTH SECTION (EXISTING FUNCTIONALITY) */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl mt-8">
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
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            {loading ? 'Creating Session...' : 'Get Your Key'}
          </button>
        </div>
      </div>

      <AdPlaceholder position="sticky-mobile" />
    </div>
  )
}
