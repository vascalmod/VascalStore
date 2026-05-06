import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import AdPlaceholder from '../components/AdPlaceholder'
import AdBanner from '../components/AdBanner'
import CopyButton from '../components/CopyButton'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Request() {
  const [searchParams] = useSearchParams()
  const sessionToken = searchParams.get('session')
  const navigate = useNavigate()

  const [sessionValid, setSessionValid] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')

  const [captchaToken, setCaptchaToken] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  const [apiKey, setApiKey] = useState('')
  const [expiresAt, setExpiresAt] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!sessionToken) {
      setSessionError('No session token provided')
      setSessionLoading(false)
      return
    }

    const validateSession = async () => {
      try {
        const res = await fetch('/api/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Invalid session')
        setSessionValid(true)
      } catch (err) {
        setSessionError(err.message)
        setTimeout(() => navigate('/'), 3000)
      } finally {
        setSessionLoading(false)
      }
    }

    validateSession()
  }, [sessionToken, navigate])

  useEffect(() => {
    if (!expiresAt) return
    const updateCountdown = () => {
      const diff = new Date(expiresAt) - new Date()
      if (diff <= 0) {
        setTimeLeft('EXPIRED')
        return
      }
      const h = Math.floor(diff / 3.6e6)
      const m = Math.floor((diff % 3.6e6) / 6e4)
      const s = Math.floor((diff % 6e4) / 1e3)
      setTimeLeft(`${h}h ${m}m ${s}s`)
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  const handleGenerateKey = async () => {
    if (!captchaToken || !sessionToken) return
    setGenerating(true)
    setGenerateError('')
    try {
      const res = await fetch('/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken, sessionToken })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate key')
      setApiKey(data.apiKey)
      setExpiresAt(data.expiresAt)
    } catch (err) {
      setGenerateError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  if (sessionLoading) return <LoadingSkeleton />

  if (sessionError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-red-400 text-lg text-center">
          {sessionError}
          <div className="text-slate-400 text-sm mt-2">Redirecting to home...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 px-3 py-4 md:px-8 md:py-8 relative">
      <AdPlaceholder position="top" />
      
      <div className="max-w-4xl mx-auto">
        <AdBanner
          adKey="a44d7edf4b87991fd414ad3ceb09ab89"
          width={468}
          height={60}
          src="https://www.highperformanceformat.com/a44d7edf4b87991fd414ad3ceb09ab89/invoke.js"
        />

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Generate API Key
          </h1>
        </div>

        <AdPlaceholder position="middle" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <AdBanner
            adKey="ee6632ab89f404d63d360e459d424ba6"
            width={300}
            height={250}
            src="https://www.highperformanceformat.com/ee6632ab89f404d63d360e459d424ba6/invoke.js"
          />
          <AdBanner
            adKey="3e7d869c72d88cf159a02db273176ad3"
            width={160}
            height={600}
            src="https://www.highperformanceformat.com/3e7d869c72d88cf159a02db273176ad3/invoke.js"
          />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 md:p-8 shadow-xl">
          {apiKey ? (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-base md:text-lg font-medium mb-2">Your API Key</h2>
                <div className="flex items-center bg-slate-900 p-3 md:p-4 rounded-lg border border-slate-700 flex-wrap gap-2">
                  <code className="text-cyan-400 break-all text-xs md:text-sm">{apiKey}</code>
                  <CopyButton text={apiKey} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-slate-900 p-3 md:p-4 rounded-lg border border-slate-700">
                  <div className="text-xs md:text-sm text-slate-400">Status</div>
                  <div className="text-green-400 font-medium text-sm md:text-base">ACTIVE</div>
                </div>
                <div className="bg-slate-900 p-3 md:p-4 rounded-lg border border-slate-700">
                  <div className="text-xs md:text-sm text-slate-400">Expires In</div>
                  <div className="text-cyan-400 font-medium text-xs md:text-base">{timeLeft}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={setCaptchaToken}
                  onError={() => setGenerateError('Captcha verification failed')}
                  theme="dark"
                />
              </div>

              {generateError && <div className="text-red-400 mb-3 text-sm">{generateError}</div>}

              <button
                onClick={handleGenerateKey}
                disabled={!captchaToken || generating}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all text-sm md:text-base"
              >
                {generating ? 'Generating...' : 'Generate API Key'}
              </button>
            </>
          )}
        </div>
      </div>

      <AdPlaceholder position="sticky-mobile" />
    </div>
  )
}
