'use client'
import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { FIPS, SD, stateFill, lvl, C } from '@/lib/constants'

export default function USMap({ hovered, onHover, compact = false }) {
  const [paths,    setPaths]    = useState([])
  const [centroids,setCentroids]= useState({})
  const [loading,  setLoading]  = useState(true)
  const [tooltip,  setTooltip]  = useState({ show: false, x: 0, y: 0, abbr: null })
  const containerRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      try {
        const [topoMod, us] = await Promise.all([
          import('topojson-client'),
          fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
        ])
        const geo     = topoMod.feature(us, us.objects.states)
        const proj    = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
        const pathGen = d3.geoPath(proj)

        const ps = [], cs = {}
        for (const f of geo.features) {
          const fips = String(f.id).padStart(2, '0')
          const abbr = FIPS[fips]
          if (!abbr) continue
          const d = pathGen(f)
          if (!d) continue
          ps.push({ abbr, d })
          const c = pathGen.centroid(f)
          if (c && !isNaN(c[0])) cs[abbr] = c
        }
        setPaths(ps)
        setCentroids(cs)
      } catch (e) {
        console.error('USMap load error:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const onMove = (e, abbr) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setTooltip({ show: true, x: e.clientX - r.left, y: e.clientY - r.top, abbr })
    onHover?.(abbr)
  }
  const onLeave = () => { setTooltip({ show: false, x: 0, y: 0, abbr: null }); onHover?.(null) }

  if (loading) return (
    <div style={{ width: '100%', height: compact ? 320 : 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: C.textMid }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'shimmer 0.9s linear infinite' }} />
      <span style={{ fontSize: 14 }}>Loading map data…</span>
    </div>
  )

  const tip   = tooltip.abbr ? SD[tooltip.abbr] : null
  const tipLv = tip ? lvl(tip.v) : null
  const tipW  = 260
  const tipX  = tooltip.x > 660 ? tooltip.x - tipW - 12 : tooltip.x + 16
  const tipY  = Math.max(8, tooltip.y - 16)
  const SKIP  = new Set(['RI','CT','DE','NJ','NH','VT','MA','MD'])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <svg viewBox="0 0 975 610" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {paths.map(({ abbr, d }) => {
          const data = SD[abbr]
          const isH  = hovered === abbr
          return (
            <path key={abbr} d={d}
              fill={stateFill(data?.v, isH)}
              stroke={isH ? lvl(data?.v).hex : 'rgba(148,163,184,0.18)'}
              strokeWidth={isH ? 2.2 : 0.6}
              strokeLinejoin="round"
              style={{ cursor: 'pointer', transition: 'fill 0.15s, stroke-width 0.15s' }}
              onMouseMove={e => onMove(e, abbr)}
              onMouseLeave={onLeave}
            />
          )
        })}

        {/* Alert indicator dots */}
        {paths.map(({ abbr }) => {
          const c = centroids[abbr]
          if (!c || !SD[abbr] || SD[abbr].c === 0) return null
          const isHigh = SD[abbr].v === 'high'
          return (
            <circle key={`dot-${abbr}`}
              cx={c[0]} cy={c[1]} r={isHigh ? 6 : 4}
              fill={isHigh ? '#EF4444' : '#F59E0B'}
              opacity={0.9}
              style={{ animation: isHigh ? 'pulse 1.8s ease-in-out infinite' : 'none' }}
              pointerEvents="none"
            />
          )
        })}

        {/* State abbreviation labels */}
        {!compact && paths.map(({ abbr }) => {
          if (SKIP.has(abbr)) return null
          const c    = centroids[abbr]
          if (!c) return null
          const data = SD[abbr]
          const isH  = hovered === abbr
          const big  = ['TX','CA','MT','AK','NM','AZ','NV','CO'].includes(abbr)
          return (
            <text key={`lbl-${abbr}`}
              x={c[0]} y={data?.v !== 'low' ? c[1] + 9 : c[1]}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={big ? 11 : 9} fontWeight={isH ? 700 : 500}
              fill={isH ? '#fff' : 'rgba(203,213,225,0.55)'}
              fontFamily="var(--font-dm-sans), sans-serif"
              letterSpacing="0.06em"
              pointerEvents="none"
              style={{ transition: 'fill 0.15s' }}
            >{abbr}</text>
          )
        })}
      </svg>

      {/* Floating tooltip */}
      {tooltip.show && tip && (
        <div style={{
          position: 'absolute', left: tipX, top: tipY, width: tipW,
          background: 'rgba(9,15,28,0.97)',
          border: `1px solid ${tipLv?.border || C.border}`,
          borderRadius: 14, padding: '16px 18px',
          pointerEvents: 'none', zIndex: 100,
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.text }}>{tip.n}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: tipLv?.bg, border: `1px solid ${tipLv?.border}`, color: tipLv?.hex, borderRadius: 100, padding: '3px 8px' }}>{tipLv?.label}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: tipLv?.hex, marginBottom: 8, lineHeight: 1.3 }}>
            {tip.c > 0 ? tip.law : 'No recent changes'}
          </div>
          <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.55, marginBottom: tip.d ? 10 : 0 }}>
            {tip.s.slice(0, 120)}{tip.s.length > 120 ? '…' : ''}
          </div>
          {tip.d && <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginTop: 8 }}>⏰ Deadline: {tip.d}</div>}
        </div>
      )}
    </div>
  )
}
