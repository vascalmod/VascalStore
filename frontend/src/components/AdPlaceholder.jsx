import { useEffect, useRef } from 'react'

export default function AdPlaceholder({ position }) {
  const containerRef = useRef(null)
  
  const styles = {
    top: 'max-w-[728px] w-full h-[90px] mb-6 mx-auto',
    middle: 'w-full my-6',
    'sticky-mobile': 'fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[320px] h-[50px] md:hidden z-50',
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    if (position === 'top') {
      // 728x90 Banner
      const atOptionsScript = document.createElement('script')
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : '5526eec597ea64518da9699989bcb4e0',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `
      containerRef.current.appendChild(atOptionsScript)

      const invokeScript = document.createElement('script')
      invokeScript.src = 'https://www.highperformanceformat.com/5526eec597ea64518da9699989bcb4e0/invoke.js'
      containerRef.current.appendChild(invokeScript)
      
    } else if (position === 'middle') {
      // Native Banner
      const nativeScript = document.createElement('script')
      nativeScript.async = true
      nativeScript['data-cfasync'] = false
      nativeScript.src = 'https://pl29357183.profitablecpmratenetwork.com/73c1588fa59c0eb845e346cddf00e0eb/invoke.js'
      containerRef.current.appendChild(nativeScript)

      const nativeDiv = document.createElement('div')
      nativeDiv.id = 'container-73c1588fa59c0eb845e346cddf00e0eb'
      containerRef.current.appendChild(nativeDiv)
      
    } else if (position === 'sticky-mobile') {
      // 320x50 Banner
      const atOptionsScript = document.createElement('script')
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : '7d80898bdfa0dcee5ab024793d9c44a9',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `
      containerRef.current.appendChild(atOptionsScript)

      const invokeScript = document.createElement('script')
      invokeScript.src = 'https://www.highperformanceformat.com/7d80898bdfa0dcee5ab024793d9c44a9/invoke.js'
      containerRef.current.appendChild(invokeScript)
    }

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
