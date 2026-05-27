'use client'
import { useState } from 'react'
import { C, SD, lvl } from '@/lib/constants'
import USMap from '@/components/ui/USMap'

export default function LandingPage({ onStart }) {
  const [hovered, setHovered] = useState(null)
  const totalAlerts = Object.values(SD).reduce((s, v) => s + v.c, 0)
  const highStates  = Object.values(SD).filter(v => v.v === 'high').length
  const hd = hovered ? SD[hovered] : null
  const l  = hd ? lvl(hd.v) : null

  return (
    <div style={{ background: C.bg0, color: C.text, fontFamily: "var(--font-dm-sans), -apple-system, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(7,12,24,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.gold, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>⚖️</div>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em' }}>LawRadar</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'Pricing', 'Blog'].map(n => (
            <span key={n} style={{ color: C.textMid, fontSize: 14, cursor: 'pointer' }}>{n}</span>
          ))}
          <button onClick={onStart} style={{ background: C.gold, color: '#000', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 48px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '18%', left: '12%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 880 }}>
          <div className="fadeUp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 100, padding: '7px 18px', marginBottom: 36 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: C.gold, fontWeight: 500 }}>Live monitoring · {totalAlerts} active law changes tracked across all 50 states</span>
          </div>

          <h1 className="fadeUp-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.028em', marginBottom: 26, color: C.text }}>
            Never Get Blindsided<br />
            <em style={{ fontStyle: 'italic', color: C.gold }}>By A New Landlord Law</em>
          </h1>

          <p className="fadeUp-2" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: C.textMid, lineHeight: 1.75, maxWidth: 620, margin: '0 auto 44px' }}>
            LawRadar monitors rental legislation across all 50 states in real-time and delivers plain-English summaries — with exactly what to update in your lease — the moment a law changes.
          </p>

          <div className="fadeUp-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onStart} style={{ background: C.gold, color: '#000', border: 'none', borderRadius: 11, padding: '15px 36px', fontSize: 17, fontWeight: 700, cursor: 'pointer', animation: 'goldGlow 3s ease infinite' }}>
              Start Monitoring Free →
            </button>
            <button style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`, borderRadius: 11, padding: '15px 36px', fontSize: 17, cursor: 'pointer' }}>
              Watch Demo
            </button>
          </div>

          <div className="fadeUp-4" style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap' }}>
            {[{ n: '50', label: 'States Monitored' }, { n: `${totalAlerts}`, label: 'Laws Tracked in 2026' }, { n: `${highStates}`, label: 'Urgent Alert States' }, { n: '12,000+', label: 'Landlords Protected' }].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 36, fontWeight: 700, color: C.gold, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13, color: C.textMid, marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div style={{ background: C.bg1, padding: '80px 48px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 38, fontWeight: 700, marginBottom: 14 }}>Your Legal Shield Across Every State</h2>
            <p style={{ color: C.textMid, fontSize: 16 }}>Hover over any state to see its current legal status and latest changes</p>
          </div>
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            {[{ c: '#EF4444', label: 'Urgent — Action Required' }, { c: '#F59E0B', label: 'Recent Changes' }, { c: '#1A2840', label: 'Compliant' }].map(({ c, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 13, height: 13, borderRadius: 4, background: c }} />
                <span style={{ fontSize: 13, color: C.textMid }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '24px 24px 16px', overflow: 'hidden' }}>
            <USMap hovered={hovered} onHover={setHovered} />
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.textDim, marginTop: 14 }}>Data updated daily via LegiScan API · Summaries generated by Gemini AI</p>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '88px 48px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 38, fontWeight: 700, marginBottom: 14 }}>Everything You Need. Nothing You Don't.</h2>
          <p style={{ color: C.textMid, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>Built specifically for independent landlords who don't have a legal team on speed-dial.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {[
            { icon: '📡', title: 'Real-Time Law Monitoring',   desc: "Our engine scans all 50 state legislative databases daily. The moment a bill affecting landlords is introduced or passes — you know before most attorneys do." },
            { icon: '📋', title: 'Plain-English Summaries',    desc: "Every law change translated from dense legal jargon into a clear 3-sentence explanation. You'll instantly understand what changed and why it matters." },
            { icon: '✅', title: 'Exact Action Checklists',    desc: "Not just what changed — but precisely which clause to update, which document to file, and which deadline to hit. Your to-do list, auto-generated." },
            { icon: '📊', title: 'Compliance Health Score',    desc: "A live score (0–100) across all your properties. Green = safe. Amber = act soon. Red = act now. Updated automatically as laws change." },
            { icon: '🤖', title: 'Ask the Law AI',             desc: "Ask any landlord law question in plain English. Get an accurate, jurisdiction-specific answer grounded in real legislation. Powered by Gemini." },
            { icon: '🔔', title: 'Deadline Alerts',            desc: "Proactive email and SMS alerts before every compliance deadline. Never miss a required update — even for minor changes most landlords overlook." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feat-card" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 30 }}>
              <div style={{ fontSize: 34, marginBottom: 18 }}>{icon}</div>
              <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.72 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, padding: '88px 48px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 38, fontWeight: 700, marginBottom: 14 }}>Simple, Honest Pricing</h2>
          <p style={{ color: C.textMid, fontSize: 16, marginBottom: 52 }}>Start free. Upgrade when you see the value — which is usually day one.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Free */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 38, textAlign: 'left', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderLight}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ fontSize: 12, color: C.textMid, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Free Forever</div>
              <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 52, fontWeight: 700, marginBottom: 6, lineHeight: 1 }}>$0</div>
              <div style={{ color: C.textMid, fontSize: 14, marginBottom: 34, borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>No credit card required</div>
              {['1 state monitored', 'Monthly law digest', 'Basic compliance alerts', 'Community forum access'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 14 }}><span style={{ color: C.green }}>✓</span> {f}</div>
              ))}
              <button onClick={onStart} style={{ marginTop: 10, width: '100%', background: 'transparent', color: C.text, border: `1px solid ${C.border}`, borderRadius: 11, padding: '13px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                Get Started Free
              </button>
            </div>
            {/* Pro */}
            <div style={{ background: 'linear-gradient(160deg, rgba(245,158,11,0.07) 0%, rgba(245,158,11,0.02) 100%)', border: '2px solid rgba(245,158,11,0.35)', borderRadius: 22, padding: 38, textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: '#000', fontSize: 11, fontWeight: 800, padding: '5px 18px', borderRadius: 100, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>
              <div style={{ fontSize: 12, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6, lineHeight: 1 }}>
                <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 52, fontWeight: 700 }}>$19</span>
                <span style={{ color: C.textMid, fontSize: 16, paddingBottom: 8 }}>/month</span>
              </div>
              <div style={{ color: C.textMid, fontSize: 14, marginBottom: 34, borderBottom: `1px solid ${C.amberBorder}`, paddingBottom: 24 }}>14-day free trial, cancel anytime</div>
              {['All 50 states monitored', 'Real-time law alerts', 'AI plain-English summaries', 'Compliance health score', 'Lease clause generator', 'Deadline calendar & reminders', 'Ask the Law AI — unlimited', 'Priority email support'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 12 }}><span style={{ color: C.gold }}>✓</span> {f}</div>
              ))}
              <button onClick={onStart} style={{ marginTop: 12, width: '100%', background: C.gold, color: '#000', border: 'none', borderRadius: 11, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Start 14-Day Free Trial →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: '36px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: C.gold, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚖️</div>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 17, fontWeight: 700 }}>LawRadar</span>
        </div>
        <div style={{ fontSize: 12, color: C.textDim, textAlign: 'center', flex: 1 }}>© 2026 LawRadar · General information only, not legal advice</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(n => (
            <span key={n} style={{ fontSize: 13, color: C.textMid, cursor: 'pointer' }}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
