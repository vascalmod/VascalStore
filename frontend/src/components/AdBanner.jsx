import { useEffect, useRef } from 'react'

export default function AdBanner({ adKey, width, height, src }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const atOptionsScript = document.createElement('script')
    atOptionsScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `
    containerRef.current.appendChild(atOptionsScript)

    const invokeScript = document.createElement('script')
    invokeScript.src = src
    containerRef.current.appendChild(invokeScript)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [adKey, width, height, src])

  return (
    <div
      ref={containerRef}
      className="my-6 mx-auto"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  )
}
