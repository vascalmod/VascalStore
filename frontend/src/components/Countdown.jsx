import { useState, useEffect } from 'react'

export default function Countdown({ duration = 5, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  return (
    <div className="text-slate-400 text-sm mb-4">
      {timeLeft > 0 ? `Please wait ${timeLeft} seconds...` : 'You can now proceed!'}
    </div>
  )
}
