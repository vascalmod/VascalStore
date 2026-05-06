import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import AdPlaceholder from '../components/AdPlaceholder'
import AdBanner from '../components/AdBanner'
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
    <div className="min-h-screen bg-slate-900 px-3 py-4 md:px-8 md:py-8 relative">
      <AdPlaceholder position="top" />
      
      <div className="max-w-4xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
            VascalAPI
          </h1>
          <p className="text-slate-300 text-base md:text-xl mb-2 px-2">
            Generate free temporary API keys with automatic 8-hour renewal access.
          </p>
          <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto mb-4 px-2">
            This page allows users to generate unlimited temporary keys. Ads on this website help support the developer and maintain the service.
          </p>

          {/* HIGHLIGHTED INFO CARD */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-4 md:p-6 max-w-md mx-auto shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <h3 className="text-cyan-400 font-bold text-base md:text-lg mb-3">⚡ Free Key System</h3>
            <ul className="text-slate-300 text-sm space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Unlimited key generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> 8-hour key duration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Secure verification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Fast API access
              </li>
            </ul>
          </div>
        </div>

        {/* SUPPORT / MONETIZATION SECTION */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 md:p-8 shadow-xl mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-slate-100 mb-3">
            Support The Developer
          </h2>
          <p className="text-slate-400 mb-4 text-sm md:text-base">
            Ads displayed on this page help maintain servers, API infrastructure, and future updates for VascalAPI.
          </p>

          <div className="bg-slate-900/50 rounded-lg p-4 md:p-6 border border-slate-700">
            <h3 className="text-lg md:text-xl font-semibold text-slate-200 mb-2">
              Want a Private License Key?
            </h3>
            <p className="text-slate-400 mb-4 text-sm md:text-base">
              If you want a private license key with extended access or premium features, you can directly contact the developer.
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-3 px-6 md:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] rounded-lg font-medium transition-all text-center text-sm md:text-base"
            >
              DM To Order Key
            </a>
          </div>
        </div>

        {/* OPTIONAL COUNTERS & STATUS */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-2 md:p-4 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-xs md:text-sm text-slate-400 mb-1">Online</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">1,247</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-2 md:p-4 text-center hover:border-blue-500/30 transition-colors">
            <div className="text-xs md:text-sm text-slate-400 mb-1">Keys</div>
            <div className="text-lg md:text-2xl font-bold text-blue-400">89,321</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-2 md:p-4 text-center hover:border-green-500/30 transition-colors">
            <div className="text-xs md:text-sm text-slate-400 mb-1">Status</div>
            <div className="text-sm md:text-2xl font-bold text-green-400">ONLINE</div>
          </div>
        </div>

        {/* BANNERS - REDUCED SPACING */}
        <AdBanner
          adKey="a44d7edf4b87991fd414ad3ceb09ab89"
          width={468}
          height={60}
          src="https://www.highperformanceformat.com/a44d7edf4b87991fd414ad3ceb09ab89/invoke.js"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <AdBanner
            adKey="e29498aa566573401e1e8a9cdf75f02a"
            width={160}
            height={300}
            src="https://www.highperformanceformat.com/e29498aa566573401e1e8a9cdf75f02a/invoke.js"
          />
          <AdBanner
            adKey="ee6632ab89f404d63d360e459d424ba6"
            width={300}
            height={250}
            src="https://www.highperformanceformat.com/ee6632ab89f404d63d360e459d424ba6/invoke.js"
          />
        </div>

        <AdPlaceholder position="middle" />

        {/* AUTH SECTION */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 md:p-8 shadow-xl mt-4 md:mt-8">
          <Countdown duration={5} onComplete={() => setCountdownDone(true)} />

          <div className="mb-4">
            <HCaptcha
              ref={useRef(null)}
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
              onVerify={setCaptchaToken}
              onError={() => setError('Captcha verification failed')}
              theme="dark"
            />
          </div>

          {error && <div className="text-red-400 mb-3 text-sm">{error}</div>}

          <button
            onClick={handleGetKey}
            disabled={!countdownDone || !captchaToken || loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-sm md:text-base"
          >
            {loading ? 'Creating Session...' : 'Get Your Key'}
          </button>
        </div>
      </div>

      <AdPlaceholder position="sticky-mobile" />
    </div>
  )
}
