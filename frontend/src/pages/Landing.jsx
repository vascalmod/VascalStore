import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const statusMessages = [
  'Preparing secure access session...',
  'Verifying session integrity...',
  'Connecting to API node...',
  'Generating protected access route...',
  'Secure session link is ready.',
]

export default function Landing() {
  const [step, setStep] = useState(0)
  const [countdownDone, setCountdownDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (step >= statusMessages.length) {
      setCountdownDone(true)
      return
    }
    const timer = setTimeout(() => setStep(s => s + 1), 1500)
    return () => clearTimeout(timer)
  }, [step])

  const handleGetAccess = async () => {
    if (!countdownDone || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create access session')
      window.location.href = data.redirectUrl
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            VascalAPI
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Temporary API key generation system
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
          {!countdownDone ? (
            <div className="text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              </div>
              <div className="h-12 flex items-center justify-center">
                <p className="text-slate-300 text-sm transition-all duration-500">
                  {statusMessages[Math.min(step, statusMessages.length - 1)]}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {statusMessages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-green-400 font-medium text-lg">
                ✓ Secure session link is ready.
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGetAccess}
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all text-sm md:text-base"
              >
                {loading ? 'Creating secure session...' : 'Get Access Token'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
