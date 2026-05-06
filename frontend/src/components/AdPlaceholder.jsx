import { useRef, useEffect } from 'react'

export default function AdPlaceholder({ position }) {
  const containerRef = useRef(null)
  
  const styles = {
    top: 'w-full max-w-[728px] mx-auto my-3',
    middle: 'hidden', // Native banner is now in index.html
    'sticky-mobile': 'fixed bottom-2 left-1/2 -translate-x-1/2 w-[320px] h-[50px] md:hidden z-50',
  }

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    if (position === 'top') {
      // 728x90 Banner
      const div = document.createElement('div')
      div.id = 'container-top-728x90'
      div.style.cssText = 'width:728px;height:90px;margin:0 auto;'
      container.appendChild(div)

      const configScript = document.createElement('script')
      configScript.innerHTML = `
        var atOptions = {
          'key' : '5526eec597ea64518da9699989bcb4e0',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `
      container.appendChild(configScript)

      const invokeScript = document.createElement('script')
      invokeScript.src = 'https://www.highperformanceformat.com/5526eec597ea64518da9699989bcb4e0/invoke.js'
      invokeScript.async = true
      container.appendChild(invokeScript)

    } else if (position === 'sticky-mobile') {
      // 320x50 Banner
      const div = document.createElement('div')
      div.id = 'container-mobile-320x50'
      div.style.cssText = 'width:320px;height:50px;margin:0 auto;'
      container.appendChild(div)

      const configScript = document.createElement('script')
      configScript.innerHTML = `
        var atOptions = {
          'key' : '7d80898bdfa0dcee5ab024793d9c44a9',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `
      container.appendChild(configScript)

      const invokeScript = document.createElement('script')
      invokeScript.src = 'https://www.highperformanceformat.com/7d80898bdfa0dcee5ab024793d9c44a9/invoke.js'
      invokeScript.async = true
      container.appendChild(invokeScript)
    }

    return () => { container.innerHTML = '' }
  }, [position])

  return <div ref={containerRef} className={`${styles[position]} overflow-hidden`} />
}
