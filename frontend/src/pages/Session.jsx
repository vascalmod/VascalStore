import { useState, useEffect } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import CopyButton from '../components/CopyButton'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Session() {
  const [searchParams] = useSearchParams()
  const { token: pathToken } = useParams()
  const triggerToken = searchParams.get('trigger')
  const navigate = useNavigate()

  const [pageState, setPageState] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null)
  const [sessionTimeLeft, setSessionTimeLeft] = useState('')

  const [captchaToken, setCaptchaToken] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [keyExpiresAt, setKeyExpiresAt] = useState(null)
  const [keyTimeLeft, setKeyTimeLeft] = useState('')

  // Phase 1: Handle trigger validation (session?trigger=TOKEN or IP lookup)
  useEffect(() => {
    if (pathToken) {
      setPageState('authenticated')
      return
    }

    const resolveAndValidate = async () => {
      setPageState('loading')

      try {
        let token = triggerToken

        if (!token) {
          const resolveRes = await fetch('/api/resolve-trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          const resolveData = await resolveRes.json()
          if (!resolveRes.ok) throw new Error(resolveData.error || 'No access token found')
          token = resolveData.triggerToken
        }

        const res = await fetch('/api/validate-trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ triggerToken: token })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Validation failed')
        navigate(`/session/${data.sessionToken}`, { replace: true })
      } catch (err) {
        setPageState('error')
        setErrorMsg(err.message)
      }
    }

    resolveAndValidate()
  }, [triggerToken, pathToken, navigate])

  // Phase 2: Check session validity
  useEffect(() => {
    if (pageState !== 'authenticated' || !pathToken) return

    const checkSession = async () => {
      try {
        const res = await fetch('/api/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: pathToken })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Invalid session')
        setSessionExpiresAt(data.expiresAt)
        setPageState('ready')
      } catch (err) {
        setPageState('error')
        setErrorMsg(err.message)
        setTimeout(() => navigate('/'), 5000)
      }
    }

    checkSession()
  }, [pageState, pathToken, navigate])

  // Session countdown
  useEffect(() => {
    if (!sessionExpiresAt) return
    const update = () => {
      const diff = new Date(sessionExpiresAt) - new Date()
      if (diff <= 0) {
        setSessionTimeLeft('EXPIRED')
        setPageState('error')
        setErrorMsg('Your secure session has expired. Please generate a new access session.')
        setTimeout(() => navigate('/'), 5000)
        return
      }
      const m = Math.floor(diff / 6e4)
      const s = Math.floor((diff % 6e4) / 1e3)
      setSessionTimeLeft(`${m}m ${s}s`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [sessionExpiresAt, navigate])

  // Key expiration countdown
  useEffect(() => {
    if (!keyExpiresAt) return
    const update = () => {
      const diff = new Date(keyExpiresAt) - new Date()
      if (diff <= 0) {
        setKeyTimeLeft('EXPIRED')
        return
      }
      const h = Math.floor(diff / 3.6e6)
      const m = Math.floor((diff % 3.6e6) / 6e4)
      const s = Math.floor((diff % 6e4) / 1e3)
      setKeyTimeLeft(`${h}h ${m}m ${s}s`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [keyExpiresAt])

  const handleGenerateKey = async () => {
    if (!captchaToken || !pathToken) return
    setGenerating(true)
    setGenerateError('')
    try {
      const res = await fetch('/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken, sessionToken: pathToken })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate key')
      setApiKey(data.apiKey)
      setKeyExpiresAt(data.expiresAt)
    } catch (err) {
      setGenerateError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  if (pageState === 'loading') return <LoadingSkeleton />

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-100 mb-3">Access Denied</h2>
          <p className="text-slate-400 mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-medium transition-all"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Secure Session Active
          </h1>
          <p className="text-slate-400 text-sm">
            Session expires in {sessionTimeLeft}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
          {apiKey ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-3">Your Temporary API Key</h2>
                <div className="flex items-center bg-slate-900 p-4 rounded-lg border border-slate-700 flex-wrap gap-2">
                  <code className="text-cyan-400 break-all text-sm">{apiKey}</code>
                  <CopyButton text={apiKey} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400">Status</div>
                  <div className="text-green-400 font-medium">ACTIVE</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400">Expires In</div>
                  <div className="text-cyan-400 font-medium">{keyTimeLeft}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Generate API Key</h2>
                <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={setCaptchaToken}
                  onError={() => setGenerateError('Captcha verification failed')}
                  theme="dark"
                />
              </div>

              {generateError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{generateError}</p>
                </div>
              )}

              <button
                onClick={handleGenerateKey}
                disabled={!captchaToken || generating}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
              >
                {generating ? 'Generating...' : 'Generate API Key'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
