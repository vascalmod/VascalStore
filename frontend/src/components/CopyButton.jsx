import { useState } from 'react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-4 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
