import { useState, useEffect } from 'react'
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
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative w-full max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              VascalAPI
            </div>
          </div>
          <p className="text-slate-400 text-sm md:text-base tracking-wide">
            Temporary API key generation system
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
          <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            {!countdownDone ? (
              <div className="text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                  <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-500" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
                </div>
                <div className="h-12 flex items-center justify-center">
                  <p className="text-slate-300 text-sm transition-all duration-500 font-light tracking-wide">
                    {statusMessages[Math.min(step, statusMessages.length - 1)]}
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {statusMessages.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        i === step ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' :
                        i < step ? 'bg-cyan-600' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <div className="relative w-16 h-16 bg-green-500/10 border-2 border-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-green-400 font-medium text-lg mb-1">
                    ✓ Secure session link is ready.
                  </p>
                  <p className="text-slate-500 text-xs">
                    Click below to generate your access token
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGetAccess}
                  disabled={loading}
                  className="relative w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 text-sm md:text-base overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating secure session...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Get Access Token
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-xs">
            Secured tokens &bull; 3-minute expiry &bull; Single-use
          </p>
        </div>
      </div>
    </div>
  )
}
