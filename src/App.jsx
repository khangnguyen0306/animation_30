import { useEffect, useRef } from 'react'
import './App.css'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(SplitText, ScrollTrigger)
gsap.registerPlugin(ScrollTrigger)
const height = 620

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


function App() {
  const splitTextRef = useRef(null)
  const pinRef = useRef(null)
  const containerRef = useRef(null)
  const blurTextRef = useRef(null)
  useEffect(() => {
    if (!splitTextRef.current || !containerRef.current || !blurTextRef.current) return

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

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    const split = SplitText.create(splitTextRef.current, { type: 'chars' })
    const blurText = SplitText.create(blurTextRef.current, { type: 'chars' })


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

    const tlBlur = gsap.timeline({
      scrollTrigger: {
        trigger: blurTextRef.current,  
        start: 'top top',
        end: '+=3600',
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
    },)


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

    tlBlur.fromTo(
      blurText.chars,
      {
        // trạng thái ban đầu: random mờ/rõ
        opacity: () => gsap.utils.random(0, 1),
        filter: "blur(90px)",
        y: () => gsap.utils.random(-100, 100),
      },
      {
        // trạng thái cuối: tất cả rõ nét
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        ease: "power2.out",
        stagger: { each: 0.05, from: "random" }, // từng chữ random hiển thị
        duration: 1.2,
      }
    )
    
    
    

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      if (tlBlur.scrollTrigger) tlBlur.scrollTrigger.kill()
      tl.kill()
      tlBlur.kill()
      split.revert()
      blurText.revert()
      lenis.destroy()
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div className="spacer-top" style={{ height: '100vh' }}></div>

      <section
        ref={pinRef}
        className="pinned-panel"
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div ref={splitTextRef} style={{ fontSize: '100px', fontWeight: 'bold', width: '100%', display: 'flex', flexDirection: 'column', position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }}>
          <div>
            <span className="split-text" style={{ letterSpacing: '-0.1em' }}>SHAPING </span> <span className="split-text" style={{ color: '#6c757d', letterSpacing: '-0.1em' }}> TOMORROWS </span>
          </div>
          <div >
            <span className="split-text" style={{ letterSpacing: '-0.1em' }}> VISION </span><span className="split-text" style={{ color: '#6c757d', letterSpacing: '-0.1em', marginLeft: '0.2em' }}> TODAY. </span>
          </div>
        </div>


        <div
          ref={containerRef}
          style={{
            height: '4000px',
            rotate: '20deg',
            width: '100%',
            display: 'flex',
            right: '30%',
            position: 'relative',
            gap: '60px',


          }}>
          <div
            className="top-bottom-column"
            style={{
              marginTop: '-3800px',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              willChange: 'transform',
            }}
          >
            {leftImages.map((image, index) => (
              <div
                key={`left-${index}`}
                style={{
                  width: '480px',
                  height: height,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              >
                <img
                  src={image}
                  alt={`Left image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>


          <div
            className="mid-column"
            style={{
              marginTop: '1120px',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              willChange: 'transform',

            }}
          >
            {rightImages.map((image, index) => (
              <div
                key={`mid-${index}`}
                style={{
                  width: '480px',
                  height: height,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              >
                <img
                  src={image}
                  alt={`Mid image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="top-bottom-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              willChange: 'transform',
              marginTop: '-3800px',
            }}
          >
            {rightImages.map((image, index) => (
              <div
                key={`right-${index}`}
                style={{
                  width: '480px',
                  height: height,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              >
                <img
                  src={image}
                  alt={`Right image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        </div>


      </section>

      <section  ref={blurTextRef} style={{ height: '100vh',width: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center' }}>
       <div style={{color: 'white',fontSize: '100px',fontWeight: 'bold',textTransform: 'uppercase'}}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. </div> 
      </section>


      <div className="spacer-bottom" style={{ height: '100vh' }}></div>
    </div>
  )
}

export default App
