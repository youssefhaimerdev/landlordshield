'use client'
import { useState } from 'react'
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '@/lib/supabase'

const C = {
  bg0:'#070C18', bg1:'#0D1425', card:'#0F1924',
  border:'rgba(255,255,255,0.06)',
  gold:'#F59E0B', goldDark:'#D97706',
  amberBg:'rgba(245,158,11,0.1)', amberBorder:'rgba(245,158,11,0.28)',
  text:'#F1F5F9', textMid:'#94A3B8',
  red:'#EF4444', redBg:'rgba(239,68,68,0.1)', redBorder:'rgba(239,68,68,0.28)',
}
const SERIF = "var(--font-playfair,'Playfair Display',Georgia,serif)"

export default function AuthForm({ onSuccess }) {
  const [mode,     setMode]     = useState('signup')
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [err,      setErr]      = useState('')

  const handleGoogle = async () => {
    setGLoading(true)
    setErr('')
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setErr(error.message)
        setGLoading(false)
      }
      // On success the browser redirects — no further action needed here
    } catch (e) {
      setErr('Google sign-in failed. Please try again.')
      setGLoading(false)
    }
  }

  const handleSubmit = async () => {
    setErr('')
    if (!email || !pass) { setErr('Please fill in all fields.'); return }
    if (pass.length < 6)  { setErr('Password must be at least 6 characters.'); return }
    if (mode === 'signup' && !name) { setErr('Please enter your name.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await signUpWithEmail(email, pass, name)
        if (error) { setErr(error.message); setLoading(false); return }
        if (data?.user) {
          onSuccess({ userId: data.user.id, email: data.user.email, name })
        } else {
          setErr('Check your email to confirm your account, then sign in.')
          setMode('signin')
        }
      } else {
        const { data, error } = await signInWithEmail(email, pass)
        if (error) { setErr(error.message); setLoading(false); return }
        onSuccess({
          userId: data.user.id,
          email:  data.user.email,
          name:   data.user.user_metadata?.name || email.split('@')[0],
        })
      }
    } catch (e) {
      setErr('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg0, display:'flex', fontFamily:"var(--font-dm-sans,sans-serif)" }}>
      {/* Left panel */}
      <div style={{ flex:1, background:C.bg1, borderRight:`1px solid ${C.border}`, padding:48, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:C.gold, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡️</div>
          <span style={{ fontFamily:SERIF, fontSize:20, fontWeight:700, color:C.text }}>LandlordShield</span>
        </div>
        <div>
          <h2 style={{ fontFamily:SERIF, fontSize:28, fontWeight:700, marginBottom:24, lineHeight:1.3, fontStyle:'italic', color:C.textMid }}>
            "I got fined $4,200 because I didn't know California changed the deposit rules. LandlordShield would have caught it instantly."
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:C.amberBg, border:`1px solid ${C.amberBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:C.gold }}>MR</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.text }}>Marcus R.</div>
              <div style={{ fontSize:12, color:C.textMid }}>7-unit landlord · Sacramento, CA</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {['50 States','Real-Time Alerts','AI-Powered','Plain English'].map(t=>(
            <div key={t} style={{ padding:'8px 16px', background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:8, fontSize:13, color:C.gold, fontWeight:500 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <h1 style={{ fontFamily:SERIF, fontSize:30, fontWeight:700, marginBottom:8, color:C.text }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ color:C.textMid, fontSize:15, marginBottom:32 }}>
            {mode === 'signup' ? 'Start monitoring for free. No credit card needed.' : 'Sign in to your LandlordShield account.'}
          </p>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={gLoading} style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
            background:'#fff', color:'#1a1a1a', border:'1px solid #e5e7eb',
            borderRadius:11, padding:'13px 16px', fontSize:15, fontWeight:600,
            cursor: gLoading ? 'not-allowed' : 'pointer', marginBottom:20, transition:'background .15s',
            opacity: gLoading ? 0.8 : 1,
          }}
          onMouseEnter={e => { if (!gLoading) e.currentTarget.style.background='#f3f4f6' }}
          onMouseLeave={e => e.currentTarget.style.background='#fff'}>
            {gLoading ? (
              <div style={{ width:18, height:18, border:'2px solid #ccc', borderTopColor:'#4285F4', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.68 28.18C11.25 26.86 11 25.46 11 24s.25-2.86.68-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z"/>
              </svg>
            )}
            {gLoading ? 'Redirecting to Google…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:C.border }} />
            <span style={{ fontSize:13, color:C.textMid }}>or with email</span>
            <div style={{ flex:1, height:1, background:C.border }} />
          </div>

          {/* Form */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:C.textMid, display:'block', marginBottom:7 }}>Full name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="John Smith"
                  style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:11, padding:'13px 16px', fontSize:15, color:C.text }} />
              </div>
            )}
            {[
              { label:'Email address', val:email, set:setEmail, type:'email',    ph:'you@example.com' },
              { label:'Password',      val:pass,  set:setPass,  type:'password', ph:'Min. 6 characters' },
            ].map(({ label, val, set, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize:13, fontWeight:500, color:C.textMid, display:'block', marginBottom:7 }}>{label}</label>
                <input type={type} value={val} onChange={e=>set(e.target.value)}
                  placeholder={ph} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                  style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:11, padding:'13px 16px', fontSize:15, color:C.text }} />
              </div>
            ))}
            {err && (
              <div style={{ fontSize:13, color:C.red, background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:8, padding:'10px 14px' }}>{err}</div>
            )}
            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading ? C.goldDark : C.gold, color:'#000', border:'none',
              borderRadius:11, padding:'15px', fontSize:16, fontWeight:700,
              cursor:'pointer', marginTop:4, transition:'background .2s',
            }}>
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account →' : 'Sign In →'}
            </button>
          </div>

          <p style={{ textAlign:'center', marginTop:22, fontSize:14, color:C.textMid }}>
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <span style={{ color:C.gold, cursor:'pointer', fontWeight:500 }}
              onClick={()=>{ setMode(mode==='signup'?'signin':'signup'); setErr('') }}>
              {mode === 'signup' ? 'Sign in' : 'Sign up free'}
            </span>
          </p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </div>
  )
}

