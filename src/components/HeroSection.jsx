import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// stats shown at the bottom of the hero
const stats = [
  { value: '98%', label: 'User Satisfaction' },
  { value: '5K+',  label: 'Active Users'      },
  { value: '4.9★', label: 'App Rating'        },
  { value: '200+', label: 'Brand Partners'    },
]

export default function HeroSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    // need a slight delay so DOM is fully painted before GSAP measures things
    const ctx = gsap.context(() => {

      /*
       * Main scroll-driven timeline
       * ---------------------------
       * pin: true  → section stays fixed on screen, page does NOT scroll
       * end: "+=250%"  → user scrolls 2.5x viewport height worth to complete the animation
       * scrub: 1.5 → animation chases scroll position with a 1.5s lag (smooth feel)
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      })

      // --- Text animations (sequential) ---

      // step 1 — "WELCOME" letters slide up
      tl.from('.line-welcome .char', {
        y: 80,
        opacity: 0,
        stagger: 0.05,
        ease: 'power2.out',
        duration: 0.5,
      })

      // step 2 — "ITZZFIZZ" letters slide up right after
      tl.from(
        '.line-brand .char',
        {
          y: 80,
          opacity: 0,
          stagger: 0.06,
          ease: 'power2.out',
          duration: 0.5,
        },
        '-=0.2'
      )

      // step 3 — tagline fades in
      tl.from('.tagline', { opacity: 0, y: 20, duration: 0.3 }, '+=0.05')

      // step 4 — stats pop in toward the end
      tl.from(
        '.stat-card',
        {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          ease: 'power2.out',
          duration: 0.4,
        },
        '+=0.1'
      )

      // step 5 — scroll hint fades out at the very end
      tl.to('.scroll-hint', { opacity: 0, duration: 0.2 }, '<')

      // --- Orb + Trail (run from start to end of the entire timeline) ---
      // Grab the exact total duration of all steps above so the orb moves
      // continuously from 0% scroll all the way to 100% scroll
      const totalDuration = tl.duration()

      tl.to(
        '.orb',
        {
          x: () => window.innerWidth - 110, // reaches 20px from the right edge
          ease: 'none',
          duration: totalDuration,
        },
        0
      )

      tl.to(
        '.trail',
        {
          width: () => window.innerWidth - 55, // stays locked to the center of the orb
          ease: 'none',
          duration: totalDuration,
        },
        0
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // helper — splits a word into individual <span> chars for stagger animation
  const splitChars = (word, lineClass) =>
    word.split('').map((char, i) => (
      <span
        key={i}
        className={`char inline-block ${lineClass}`}
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char}
      </span>
    ))

  return (
    <div
      ref={containerRef}
      style={{ height: '100vh', position: 'relative', background: '#0d0d0d' }}
    >
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#fff' }}>
          ITZZ<span style={{ color: '#45db7d' }}>FIZZ</span>
        </span>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.85rem', color: '#888' }}>
          {['Home', 'Work', 'About', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target.style.color = '#45db7d')}
              onMouseLeave={e => (e.target.style.color = '#888')}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Headline ───────────────────────────────────────────── */}
      {/*    top: 80px so it sits cleanly below the navbar        */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          paddingTop: '12px',
        }}
      >
        {/* line 1: WELCOME */}
        <h1
          className="line-welcome"
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5.2rem)',
            fontWeight: 900,
            letterSpacing: '0.25em',
            color: '#f5f5f5',
            lineHeight: 1.1,
          }}
        >
          {splitChars('WELCOME', 'welcome-char')}
        </h1>

        {/* line 2: ITZZFIZZ — green color */}
        <h1
          className="line-brand"
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5.2rem)',
            fontWeight: 900,
            letterSpacing: '0.25em',
            color: '#45db7d',
            lineHeight: 1.1,
            marginTop: '6px',
          }}
        >
          {splitChars('ITZZFIZZ', 'brand-char')}
        </h1>

        {/* tagline */}
        <p
          className="tagline"
          style={{
            marginTop: '14px',
            fontSize: '0.8rem',
            color: '#555',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore ✦
        </p>
      </div>

      {/* ── Scroll Animation Track ─────────────────────────────── */}
      {/*    This is the "road" where the orb moves                */}
      <div
        style={{
          position: 'absolute',
          bottom: '150px',
          left: 0,
          right: 0,
          height: '120px',
          overflow: 'visible',
        }}
      >
        {/* track line — the road */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '2px',
            background: '#1e1e1e',
            transform: 'translateY(-50%)',
          }}
        />

        {/* green trail that grows as orb moves */}
        <div
          className="trail"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            height: '3px',
            width: '55px',
            background: '#45db7d',
            transform: 'translateY(-50%)',
            borderRadius: '2px',
            boxShadow: '0 0 10px #45db7d',
          }}
        />

        {/* the glowing orb — GSAP moves this via x transform */}
        <div
          className="orb"
          style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          {/* outer pulse ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              border: '2px solid rgba(69, 219, 125, 0.25)',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />
          {/* inner orb */}
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #7fffc4, #45db7d, #1f7a47)',
              boxShadow: '0 0 25px rgba(69,219,125,0.7), 0 0 50px rgba(69,219,125,0.2)',
            }}
          />
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '0 32px',
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="stat-card"
            style={{
              textAlign: 'center',
              padding: '16px 28px',
              borderRadius: '12px',
              border: '1px solid rgba(69, 219, 125, 0.15)',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(8px)',
              minWidth: '110px',
            }}
          >
            <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#45db7d', lineHeight: 1 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '6px', letterSpacing: '0.05em' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Scroll Hint ────────────────────────────────────────── */}
      <div
        className="scroll-hint"
        style={{
          position: 'absolute',
          bottom: '140px',
          left: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          animation: 'bounce-arrow 1.5s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.2em' }}>SCROLL</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="#45db7d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
