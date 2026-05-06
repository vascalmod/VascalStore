import { useRef, useEffect } from 'react'

export default function AdBanner({ adKey, width, height, src }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const div = document.createElement('div')
    div.id = `container-${adKey.substring(0, 8)}`
    div.style.cssText = `width:${width}px;height:${height}px;margin:0 auto;`
    container.appendChild(div)

    const configScript = document.createElement('script')
    configScript.innerHTML = `
      var atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `
    container.appendChild(configScript)

    const invokeScript = document.createElement('script')
    invokeScript.src = src
    invokeScript.async = true
    container.appendChild(invokeScript)

    return () => { container.innerHTML = '' }
  }, [adKey, width, height, src])

  return <div ref={containerRef} className="my-3 flex justify-center" />
}
