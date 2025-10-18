import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './HeroSection.css'

gsap.registerPlugin(SplitText, ScrollTrigger)

// const height = 620

// Dữ liệu ảnh cho 2 cột
const leftImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
]

const rightImages = [
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
]

export default function HeroSection() {
  const splitTextRef = useRef(null)
  const pinRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!splitTextRef.current || !containerRef.current) return

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    const split = SplitText.create(splitTextRef.current, { type: 'chars' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: 'top top',
        end: '+=5600',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    tl.from(split.chars, {
      opacity: 0,
      autoAlpha: 0,
      filter: 'blur(30px)',
      ease: 'power2.out',
      stagger: { each: 0.02, from: 'start' },
      duration: 1,
    })

    tl.to(splitTextRef.current, {
      scale: 0.6,
      transformOrigin: 'center center',
      ease: 'power2.out',
      duration: 1.5,
      opacity: 0.4,
      force3D: true,
    })

    tl.to('.top-bottom-column', {
      y: 5600,
      ease: "none",
      duration: 1.3
    }, "<")

    tl.to('.mid-column', {
      y: -4800,
      ease: "none",
      duration: 1.3
    }, "<" + 0.3)

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
      split.revert()
      lenis.destroy()
    }
  }, [])

  return (
    <section
      ref={pinRef}
      className="pinned-panel"
    >
      <div ref={splitTextRef} className="hero-text">
        <div>
          <span className="split-text">SHAPING </span> <span className="split-text gray"> TOMORROWS </span>
        </div>
        <div >
          <span className="split-text"> VISION </span><span className="split-text gray"> TODAY. </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="hero-container">
        <div className="top-bottom-column">
          {leftImages.map((image, index) => (
            <div
              key={`left-${index}`}
              className="image-container"
            >
              <img
                src={image}
                alt={`Left image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="mid-column">
          {rightImages.map((image, index) => (
            <div
              key={`mid-${index}`}
              className="image-container"
            >
              <img
                src={image}
                alt={`Mid image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="top-bottom-column">
          {rightImages.map((image, index) => (
            <div
              key={`right-${index}`}
              className="image-container"
            >
              <img
                src={image}
                alt={`Right image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
