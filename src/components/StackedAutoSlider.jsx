import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './StackedAutoSlider.css'

export default function StackedAutoSlider({ images = [], intervalMs = 3000 }) {
  const containerRef = useRef(null)
  const slidesRef = useRef([])
  const timerRef = useRef(null)
  const indexRef = useRef(0)
  const stepPx = 64 
  const scaleStep = 0.06 
  const activeWidth = 900 
  const minWidth = 600 
  const widthStep = 40

  useLayoutEffect(() => {
    if (!containerRef.current) return

    function positionSlides(activeIdx) {
      slidesRef.current.forEach((el, i) => {
        if (!el) return
        const isActive = i === activeIdx
        // Calculate circular distance for true loop
        const totalImages = images.length
        let distance = i - activeIdx
        // Normalize distance to shortest path around the circle
        if (distance > totalImages / 2) distance -= totalImages
        if (distance < -totalImages / 2) distance += totalImages
        
        const y = isActive ? 0 : distance * stepPx
        const scale = isActive ? 1 : Math.max(1 - Math.abs(distance) * scaleStep, 0.82)
        const opacity = isActive ? 1 : Math.max(0.6, 1 - Math.abs(distance) * 0.12)
        const width = isActive ? activeWidth : Math.max(minWidth, activeWidth - Math.abs(distance) * widthStep)
        gsap.set(el, {
          zIndex: isActive ? images.length + 2 : images.length - Math.abs(distance),
          opacity,
          scale,
          y,
          x: 0,
          rotate: 0
        })
        gsap.set(el.querySelector('img'), {
          width: width
        })
      })
    }

    const startIndex = Math.floor(images.length / 2)
    indexRef.current = startIndex
    positionSlides(startIndex)
  }, [images.length])

  useEffect(() => {
    if (!images.length) return

    function showNext() {
      const prev = indexRef.current
      const next = (prev + 1) % images.length
      indexRef.current = next

      const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } })
      slidesRef.current.forEach((el, i) => {
        if (!el) return
        const isActive = i === next
        // Calculate circular distance for true loop
        const totalImages = images.length
        let distance = i - next
        // Normalize distance to shortest path around the circle
        if (distance > totalImages / 2) distance -= totalImages
        if (distance < -totalImages / 2) distance += totalImages
        
        const y = isActive ? 0 : distance * stepPx
        const scale = isActive ? 1 : Math.max(1 - Math.abs(distance) * scaleStep, 0.82)
        const opacity = isActive ? 1 : Math.max(0.6, 1 - Math.abs(distance) * 0.12)
        const width = isActive ? activeWidth : Math.max(minWidth, activeWidth - Math.abs(distance) * widthStep)

        // animate to new stacked position
        tl.to(el, { y, scale, opacity, x: 0 }, 0)
          .to(el.querySelector('img'), { width: width }, 0)
          .add(() => {
            gsap.set(el, { zIndex: isActive ? images.length + 2 : images.length - Math.abs(distance) })
          }, '>-0.6')
      })
    }

    timerRef.current = setInterval(showNext, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [images, intervalMs])

  return (
    <section className="w-full grid place-items-center py-12 px-4" ref={containerRef} >
      <div className="relative w-full overflow-hidden flex items-center">
        {images.map((src, i) => (
          <div
            key={i}
            className={`stacked-slide slide-${i} `}
            ref={(el) => (slidesRef.current[i] = el)}
          >
            <img src={src} alt={`slide-${i}`} />
          </div>
        ))}
      </div>
    </section>
  )
}


