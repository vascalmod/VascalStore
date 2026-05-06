import { useEffect, useRef } from 'react'

export default function AdPlaceholder({ position }) {
  const containerRef = useRef(null)
  const styles = {
    top: 'w-full h-24 mb-6',
    middle: 'w-full h-40 my-6',
    'sticky-mobile': 'fixed bottom-0 left-0 w-full h-16 md:hidden z-50',
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''
    
    const script = document.createElement('script')
    script.src = 'https://pl29357181.profitablecpmratenetwork.com/35/a9/54/35a954025ef214f3eaa59717b21c5f7e.js'
    script.async = true
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [position])

  return (
    <div
      ref={containerRef}
      className={`${styles[position]} bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden`}
    />
  )
}
