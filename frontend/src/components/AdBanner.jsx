import { useEffect, useRef } from 'react'

export default function AdBanner({ adKey, width, height, src }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const uniqueVar = `atOptions_${adKey.substring(0, 8)}`

    const atOptionsScript = document.createElement('script')
    atOptionsScript.innerHTML = `
      var ${uniqueVar} = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
      window['__${uniqueVar}'] = ${uniqueVar};
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
      className="my-3 mx-auto"
      style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
    />
  )
}
