'use client'
import { useState } from 'react'
import { C, SD, lvl } from '@/lib/constants'

export default function OnboardingFlow({ user, onSuccess }) {
  const [step,      setStep]      = useState(0)
  const [selStates, setSelStates] = useState([])
  const [selTypes,  setSelTypes]  = useState([])

  const highAbbrs = Object.entries(SD).filter(([, v]) => v.v === 'high').map(([k]) => k)
  const toggle    = (set, v) => set(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])

  const TYPES = [
    { icon: '🏠', label: 'Single-Family Home',       desc: 'Stand-alone residential rental' },
    { icon: '🏢', label: 'Multi-Family (2–4 units)',  desc: 'Duplex, triplex, or quadplex' },
    { icon: '🏙️', label: 'Apartment Complex (5+)',    desc: '5 or more residential units' },
    { icon: '🏪', label: 'Commercial / Mixed Use',    desc: 'Includes retail or office space' },
    { icon: '🏡', label: 'Condo / Townhouse',         desc: 'Unit within an HOA' },
    { icon: '🌴', label: 'Short-Term Rental',         desc: 'Airbnb, VRBO, vacation rental' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "var(--font-dm-sans), sans-serif" }}>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: C.bg3, zIndex: 100 }}>
        <div style={{ height: '100%', background: C.gold, width: `${(step / 2) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 660 }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 48 }}>
          {['Your States', 'Property Types', 'Ready!'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', fontSize: 13, fontWeight: 700, background: i < step ? C.green : i === step ? C.gold : C.bg3, color: i <= step ? '#000' : C.textMid, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, color: i === step ? C.text : C.textMid, fontWeight: i === step ? 500 : 400 }}>{s}</span>
              {i < 2 && <span style={{ color: C.textDim, marginLeft: 4, fontSize: 18 }}>›</span>}
            </div>
          ))}
        </div>

        {/* Step 0 — State selection */}
        {step === 0 && (
          <div className="fadeUp">
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, fontWeight: 700, marginBottom: 8, textAlign: 'center', color: C.text }}>Which states do you own property in?</h2>
            <p style={{ color: C.textMid, textAlign: 'center', marginBottom: 36, fontSize: 15 }}>Select all that apply. We'll monitor legislation in each one.</p>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: C.red, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block' }}>⚠</span> States with active urgent alerts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {highAbbrs.map(a => (
                  <button key={a} onClick={() => toggle(setSelStates, a)}
                    style={{ background: selStates.includes(a) ? C.redBg : 'transparent', border: `1px solid ${selStates.includes(a) ? C.red : C.redBorder}`, borderRadius: 9, padding: '8px 15px', cursor: 'pointer', color: selStates.includes(a) ? '#FCA5A5' : C.textMid, fontSize: 14, fontWeight: 500, transition: 'all 0.15s' }}>
                    {a} — {SD[a].n}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, color: C.textMid, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>All states</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(SD).sort((a, b) => a[1].n.localeCompare(b[1].n)).map(([a]) => (
                  <button key={a} onClick={() => toggle(setSelStates, a)}
                    style={{ background: selStates.includes(a) ? C.amberBg : 'transparent', border: `1px solid ${selStates.includes(a) ? C.gold : C.border}`, borderRadius: 7, padding: '6px 12px', cursor: 'pointer', color: selStates.includes(a) ? C.gold : C.textMid, fontSize: 13, fontWeight: selStates.includes(a) ? 600 : 400, transition: 'all 0.12s' }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => selStates.length > 0 && setStep(1)}
              style={{ width: '100%', background: selStates.length > 0 ? C.gold : C.bg3, color: selStates.length > 0 ? '#000' : C.textDim, border: 'none', borderRadius: 11, padding: '15px', fontSize: 16, fontWeight: 700, cursor: selStates.length > 0 ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              {selStates.length > 0 ? `Continue with ${selStates.length} state${selStates.length > 1 ? 's' : ''} →` : 'Select at least one state to continue'}
            </button>
          </div>
        )}

        {/* Step 1 — Property types */}
        {step === 1 && (
          <div className="fadeUp">
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, fontWeight: 700, marginBottom: 8, textAlign: 'center', color: C.text }}>What types of properties do you own?</h2>
            <p style={{ color: C.textMid, textAlign: 'center', marginBottom: 36, fontSize: 15 }}>Helps us prioritise the most relevant law changes for your portfolio.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {TYPES.map(({ icon, label, desc }) => (
                <button key={label} onClick={() => toggle(setSelTypes, label)}
                  style={{ background: selTypes.includes(label) ? C.amberBg : C.card, border: `1px solid ${selTypes.includes(label) ? C.gold : C.border}`, borderRadius: 14, padding: '18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: selTypes.includes(label) ? C.gold : C.text, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, color: C.textMid }}>{desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, background: 'transparent', color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 11, padding: '14px', fontSize: 15, cursor: 'pointer' }}>← Back</button>
              <button onClick={() => selTypes.length > 0 && setStep(2)} style={{ flex: 2, background: selTypes.length > 0 ? C.gold : C.bg3, color: selTypes.length > 0 ? '#000' : C.textDim, border: 'none', borderRadius: 11, padding: '14px', fontSize: 16, fontWeight: 700, cursor: selTypes.length > 0 ? 'pointer' : 'default', transition: 'all 0.2s' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 — Confirmation */}
        {step === 2 && (
          <div className="fadeUp" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 34, fontWeight: 700, marginBottom: 14, color: C.text }}>You're all set, {user?.name || 'there'}!</h2>
            <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, maxWidth: 460, margin: '0 auto 32px' }}>
              Monitoring <strong style={{ color: C.text }}>{selStates.length} state{selStates.length > 1 ? 's' : ''}</strong>. Found&nbsp;
              <strong style={{ color: C.red }}>{selStates.reduce((s, a) => s + (SD[a]?.c || 0), 0)} active alert{selStates.reduce((s, a) => s + (SD[a]?.c || 0), 0) !== 1 ? 's' : ''}</strong>
              &nbsp;needing your attention.
            </p>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', maxWidth: 420, margin: '0 auto 36px' }}>
              {selStates.slice(0, 5).map((a, i) => {
                const l = lvl(SD[a].v)
                return (
                  <div key={a} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: i < Math.min(selStates.length, 5) - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{SD[a].n}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', background: l.bg, border: `1px solid ${l.border}`, color: l.hex, padding: '3px 10px', borderRadius: 100 }}>{l.label}</span>
                  </div>
                )
              })}
              {selStates.length > 5 && <div style={{ padding: '12px 20px', fontSize: 13, color: C.textMid, textAlign: 'center' }}>+{selStates.length - 5} more states monitored</div>}
            </div>
            <button onClick={() => onSuccess({ selStates, selTypes })}
              style={{ background: C.gold, color: '#000', border: 'none', borderRadius: 12, padding: '17px 52px', fontSize: 17, fontWeight: 800, cursor: 'pointer', animation: 'goldGlow 3s ease infinite' }}>
              Open My Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
