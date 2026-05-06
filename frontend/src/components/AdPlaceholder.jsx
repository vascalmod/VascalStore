import { useEffect, useRef } from 'react'

export default function AdPlaceholder({ position }) {
  const containerRef = useRef(null)
  
  const styles = {
    top: 'w-full max-w-[728px] mx-auto my-3',
    middle: 'w-full my-3',
    'sticky-mobile': 'fixed bottom-2 left-1/2 -translate-x-1/2 w-[320px] h-[50px] md:hidden z-50',
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    if (position === 'top') {
      const atOptionsScript = document.createElement('script')
      atOptionsScript.innerHTML = `
        var atOptionsTop = {
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
      const nativeScript = document.createElement('script')
      nativeScript.async = true
      nativeScript['data-cfasync'] = false
      nativeScript.src = 'https://pl29357183.profitablecpmratenetwork.com/73c1588fa59c0eb845e346cddf00e0eb/invoke.js'
      containerRef.current.appendChild(nativeScript)

      const nativeDiv = document.createElement('div')
      nativeDiv.id = 'container-73c1588fa59c0eb845e346cddf00e0eb'
      containerRef.current.appendChild(nativeDiv)
      
    } else if (position === 'sticky-mobile') {
      const atOptionsScript = document.createElement('script')
      atOptionsScript.innerHTML = `
        var atOptionsMobile = {
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
      className={`${styles[position]} overflow-hidden`}
    />
  )
}
