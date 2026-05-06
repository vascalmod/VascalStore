import { useEffect, useRef } from 'react'

export default function AdBanner({ adKey, width, height, src }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const divId = `ad-${adKey.substring(0, 8)}`

    const div = document.createElement('div')
    div.id = divId
    div.style.width = `${width}px`
    div.style.height = `${height}px`
    div.style.margin = '0 auto'
    containerRef.current.appendChild(div)

    const script1 = document.createElement('script')
    script1.innerHTML = `
      window.atOptions = window.atOptions || [];
      window.atOptions.push({
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      });
    `
    containerRef.current.appendChild(script1)

    const script2 = document.createElement('script')
    script2.src = src
    script2.async = true
    containerRef.current.appendChild(script2)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [adKey, width, height, src])

  return (
    <div className="my-3 flex justify-center">
      <div ref={containerRef} />
    </div>
  )
}
