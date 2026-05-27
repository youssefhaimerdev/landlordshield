'use client'

export default function ScoreRing({ score }) {
  const r = 52, sw = 10
  const circ  = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color  = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="#1C2536" strokeWidth={sw} />
        <circle
          cx={65} cy={65} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#F1F5F9', fontFamily: "'Playfair Display', Georgia, serif" }}>{score}</div>
        <div style={{ fontSize: 11, color, fontWeight: 600 }}>/ 100</div>
      </div>
    </div>
  )
}
