import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function WaterRippleSection() {
  const rippleAreaRef = useRef(null)
  const turbRef = useRef(null)
  const dispRef = useRef(null)

  useEffect(() => {
    if (!rippleAreaRef.current) return

    // Ripple setup using class selector scoped to container
    const rippleCtx = gsap.context(() => {
      gsap.set('.ripple', { left: '50%', top: '50%', xPercent: -50, yPercent: -50, transformOrigin: 'center center', mixBlendMode: 'screen', willChange: 'transform' })
      gsap.fromTo(
        '.ripple',
        { scale: 0, opacity: 0.38, filter: 'blur(1px)' },
        {
          // Gợn chậm hơn, biên độ cao
          scale: 62,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 6.5,
          ease: 'sine.inOut',
          yoyo: false,
          repeat: -1,
          stagger: 0.65,  
          force3D: true,
        }
      )
      gsap.to(
        '.ripple',
        {
          z: 700,
          yoyo: true,
          repeat: -1,
          duration: 6.5,
          ease: 'sine.inOut',
          stagger: 0.35,  
          force3D: true,
        }
      )
    }, rippleAreaRef)

    // Animate SVG water filter for loang nước
    const turb = turbRef.current
    const disp = dispRef.current
    const waterTl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'sine.inOut' })
    if (turb && disp) {
      // Dao động rất chậm, biên độ đủ lớn để gợi mặt nước sâu
      waterTl.to(turb, { attr: { baseFrequency: 0.0003 }, duration: 14 })
             .to(disp, { attr: { scale: 48 }, duration: 14 }, 0)
    }

    return () => {
      rippleCtx.revert()
      waterTl.kill()
    }
  }, [])

  return (
    <section style={{ height: '100vh',width: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center' }}>
      <div
        ref={rippleAreaRef}
        className="ripple-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          filter: 'url(#waterRipple)',
          perspective: '800px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(58deg) translateY(9vh)',
        }}
      >
        {Array.from({ length: 120 }).map((_, i) => (
          <span key={i} className="ripple"></span>
        ))}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="waterRipple" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="2" />
              <feDisplacementMap ref={dispRef} in="SourceGraphic" scale="18" />
            </filter>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(0,0,0,0) 40%)' }}></div>
      </div>
    </section>
  )
}
