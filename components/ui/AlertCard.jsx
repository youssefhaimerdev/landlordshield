'use client'
import { C, lvl } from '@/lib/constants'

export default function AlertCard({ abbr, data }) {
  const l = lvl(data.v)
  return (
    <div
      style={{ background: C.card, border: `1px solid ${l.border}`, borderRadius: 18, padding: 26, transition: 'transform 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.text }}>{data.n}</h3>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', background: l.bg, border: `1px solid ${l.border}`, color: l.hex, padding: '3px 10px', borderRadius: 100 }}>{l.label}</span>
          </div>
          <div style={{ fontSize: 14, color: l.hex, fontWeight: 600 }}>{data.law}</div>
        </div>
        {data.d && (
          <div style={{ fontSize: 13, color: C.red, fontWeight: 700, background: C.redBg, border: `1px solid ${C.redBorder}`, padding: '7px 14px', borderRadius: 9, whiteSpace: 'nowrap', flexShrink: 0 }}>
            ⏰ {data.d}
          </div>
        )}
      </div>
      <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 18 }}>{data.s}</p>
      <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 11, padding: '13px 16px', display: 'flex', gap: 10 }}>
        <span style={{ fontSize: 14 }}>⚡</span>
        <div>
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Required Action: </span>
          <span style={{ fontSize: 13, color: C.goldLight }}>{data.a}</span>
        </div>
      </div>
    </div>
  )
}
