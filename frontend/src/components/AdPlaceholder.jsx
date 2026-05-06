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
      const div = document.createElement('div')
      div.id = 'ad-top-728x90'
      div.style.width = '728px'
      div.style.height = '90px'
      div.style.margin = '0 auto'
      containerRef.current.appendChild(div)

      const script1 = document.createElement('script')
      script1.innerHTML = `
        window.atOptions = window.atOptions || [];
        window.atOptions.push({
          'key' : '5526eec597ea64518da9699989bcb4e0',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        });
      `
      containerRef.current.appendChild(script1)

      const script2 = document.createElement('script')
      script2.src = 'https://www.highperformanceformat.com/5526eec597ea64518da9699989bcb4e0/invoke.js'
      script2.async = true
      containerRef.current.appendChild(script2)
      
    } else if (position === 'middle') {
      const script = document.createElement('script')
      script.async = true
      script['data-cfasync'] = false
      script.src = 'https://pl29357183.profitablecpmratenetwork.com/73c1588fa59c0eb845e346cddf00e0eb/invoke.js'
      containerRef.current.appendChild(script)

      const nativeDiv = document.createElement('div')
      nativeDiv.id = 'container-73c1588fa59c0eb845e346cddf00e0eb'
      containerRef.current.appendChild(nativeDiv)
      
    } else if (position === 'sticky-mobile') {
      const div = document.createElement('div')
      div.id = 'ad-mobile-320x50'
      div.style.width = '320px'
      div.style.height = '50px'
      div.style.margin = '0 auto'
      containerRef.current.appendChild(div)

      const script1 = document.createElement('script')
      script1.innerHTML = `
        window.atOptions = window.atOptions || [];
        window.atOptions.push({
          'key' : '7d80898bdfa0dcee5ab024793d9c44a9',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        });
      `
      containerRef.current.appendChild(script1)

      const script2 = document.createElement('script')
      script2.src = 'https://www.highperformanceformat.com/7d80898bdfa0dcee5ab024793d9c44a9/invoke.js'
      script2.async = true
      containerRef.current.appendChild(script2)
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [position])

  return (
    <div ref={containerRef} className={`${styles[position]} overflow-hidden`} />
  )
}
