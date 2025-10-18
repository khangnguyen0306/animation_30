import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BlurSection.css'

gsap.registerPlugin(SplitText, ScrollTrigger)

export default function BlurSection() {
  const blurTextRef = useRef(null)

  useEffect(() => {
    if (!blurTextRef.current) return

    const blurText = SplitText.create(blurTextRef.current, { type: 'chars' })

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
      if (tlBlur.scrollTrigger) tlBlur.scrollTrigger.kill()
      tlBlur.kill()
      blurText.revert()
    }
  }, [])

  return (
    <section ref={blurTextRef} className="blur-section">
      <div className="blur-text"> 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. 
      </div> 
    </section>
  )
}
