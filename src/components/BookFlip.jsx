import { useEffect, useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Full-screen 3-page flip using GSAP + ScrollTrigger synced with Lenis
export default function BookFlip() {
  const containerRef = useRef(null)
  const pagesRef = useRef([])
  const lenisRef = useRef(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Create one horizontal stack of 3 pages. Each page will rotateY from 0 to -180 in sequence.
      const timeline = gsap.timeline({ paused: true })

      // Ensure initial states
      pagesRef.current.forEach((el) => {
        if (!el) return
        gsap.set(el, {
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          rotateY: 0
        })
      })

      // Animate flips left-to-right: top page flips over to reveal the next beneath
      // Progress distributed across 2 equal sections (0-0.5, 0.5-1)
      if (pagesRef.current[0] && pagesRef.current[1]) {
        timeline.to(pagesRef.current[0], { rotateY: -180, duration: 1, ease: 'none' }, 0)
      }
      if (pagesRef.current[1] && pagesRef.current[2]) {
        timeline.to(pagesRef.current[1], { rotateY: -180, duration: 1, ease: 'none' }, 1)
      }

      // ScrollTrigger to map viewport scroll to timeline progress over 200vh
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          timeline.progress(self.progress)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    // Lenis smooth scrolling and syncing with ScrollTrigger
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1.0
    })
    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <section ref={containerRef} className="bookflip-container">
      <div className="bookflip-stage">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`bookflip-page page-${i}`}
            ref={(el) => (pagesRef.current[i] = el)}
          >
            <div className="bookflip-face bookflip-front">
              <div className="page-content">
                <h1>Trang {i + 1}</h1>
                <p>Cuộn để lật sang trang tiếp theo hoặc cuộn ngược để quay lại.</p>
              </div>
            </div>
            <div className="bookflip-face bookflip-back">
              <div className="page-content">
                <h1>Mặt sau {i + 1}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


