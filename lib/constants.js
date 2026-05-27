// ─── Design tokens ───────────────────────────────────────────
export const C = {
  bg0:'#070C18', bg1:'#0D1425', bg2:'#111827', bg3:'#1C2536',
  card:'#0F1924', cardHover:'#16243A',
  border:'rgba(255,255,255,0.06)', borderLight:'rgba(255,255,255,0.12)',
  gold:'#F59E0B', goldLight:'#FCD34D', goldDark:'#D97706',
  amberBg:'rgba(245,158,11,0.1)', amberBorder:'rgba(245,158,11,0.28)',
  text:'#F1F5F9', textMid:'#94A3B8', textDim:'#374151',
  red:'#EF4444', redBg:'rgba(239,68,68,0.1)', redBorder:'rgba(239,68,68,0.28)',
  green:'#10B981', greenBg:'rgba(16,185,129,0.08)', greenBorder:'rgba(16,185,129,0.25)',
}

// ─── FIPS → State abbreviation ────────────────────────────────
export const FIPS = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN',
  '19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA',
  '26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV',
  '33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH',
  '40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN',
  '48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY'
}

// ─── Alert level helper ───────────────────────────────────────
export const lvl = v => ({
  high:  { bg:'rgba(239,68,68,0.13)',   border:'rgba(239,68,68,0.35)',   text:'#FCA5A5', hex:'#EF4444', label:'Urgent'    },
  medium:{ bg:'rgba(245,158,11,0.11)',  border:'rgba(245,158,11,0.32)',  text:'#FCD34D', hex:'#F59E0B', label:'Attention' },
  low:   { bg:'rgba(255,255,255,0.025)',border:'rgba(255,255,255,0.06)', text:'#4B5563', hex:'#334155', label:'Clear'     },
}[v] || {})

// ─── State fill colours for the SVG map ──────────────────────
export const stateFill = (v, hovered) => {
  if (hovered) {
    if (v === 'high')   return '#EF444460'
    if (v === 'medium') return '#F59E0B50'
    return '#2D4060'
  }
  if (v === 'high')   return '#EF444428'
  if (v === 'medium') return '#F59E0B22'
  return '#1A2840'
}

// ─── Mock AI responses for demo (replace with real Gemini calls) ─
export const AI_RESPONSES = {
  ca_deposit: "Under California's AB 414 (effective June 2026), you and your tenant can now agree electronically on deposit refund procedures. You must return the deposit within 21 days of move-out with an itemized statement. AB 2801 also requires timestamped photos at both move-in and move-out. Update your lease to include an electronic deposit agreement clause and implement a photo workflow immediately. Failure to comply can result in your tenant claiming up to 2x the deposit amount in damages.",
  or_rent: "Oregon's SB 611 (effective June 1 2026) reduced the annual rent increase cap from 10% to 7% above CPI. For 2026 that means your maximum statewide increase is approximately 9.1% — but Portland adds a city cap limiting Portland properties to 5% regardless. Buildings built within the past 15 years are exempt. Always verify your building's construction date before calculating.",
  wa_eviction: "Yes — as of May 30 2026, Washington's HB 2057 expands just cause eviction statewide. You must now document a legally recognised reason for every eviction AND every non-renewal of tenancy, anywhere in Washington. Recognised causes include: non-payment, material lease violations, owner move-in, demolition, and others. You can no longer simply choose not to renew without documented cause. Review every upcoming lease expiration in your portfolio now.",
  default: "Based on your monitored states I can see several active alerts that may need attention. Ask me specifically about deposit rules, rent increase limits, eviction procedures, or notice requirements in any state — I'll give you a plain-English explanation grounded in current legislation.",
}

// ─── Full 50-state data ───────────────────────────────────────
// In production this comes from Supabase (populated by the daily cron job).
// This static export is used for the demo UI and fallback rendering.
export const SD = {
  AK:{n:"Alaska",v:"low",c:0,law:"No recent changes",s:"Alaska maintains its standard landlord-tenant framework. No major legislative changes in the current monitoring period.",d:null,a:"No action required."},
  AL:{n:"Alabama",v:"low",c:0,law:"No recent changes",s:"Alabama remains landlord-friendly with no significant 2026 regulatory changes.",d:null,a:"No action required."},
  AR:{n:"Arkansas",v:"low",c:0,law:"No recent changes",s:"Stable regulatory environment. No major changes detected.",d:null,a:"No action required."},
  AZ:{n:"Arizona",v:"low",c:0,law:"No recent changes",s:"Arizona maintains a landlord-friendly framework with no major 2026 changes.",d:null,a:"No action required."},
  CA:{n:"California",v:"high",c:3,law:"AB 414 — Security Deposit Reform Act",s:"Landlords and tenants may now agree electronically on deposit refund procedures. AB 2801 adds mandatory timestamped photo documentation at move-in and move-out.",d:"June 15, 2026",a:"Update lease templates. Implement timestamped photo workflow for all move-ins and move-outs."},
  CO:{n:"Colorado",v:"medium",c:1,law:"HB 1099 — Habitability Standards Update",s:"Broadband internet is now a required utility for all new rental agreements signed after January 2026.",d:"September 1, 2026",a:"Add broadband clause to all new leases. Assess internet infrastructure."},
  CT:{n:"Connecticut",v:"medium",c:1,law:"HB 5327 — Lead Paint Disclosure Update",s:"Enhanced disclosure requirements for pre-1978 properties with new testing protocols and electronic documentation standards.",d:"August 15, 2026",a:"Schedule lead paint assessments for pre-1978 properties."},
  DE:{n:"Delaware",v:"low",c:0,law:"No recent changes",s:"No major legislative changes in 2026.",d:null,a:"No action required."},
  FL:{n:"Florida",v:"medium",c:1,law:"SB 892 — Notice Period Extension",s:"Lease termination notice extended from 30 to 45 days for month-to-month tenancies in counties over 500K population.",d:"August 1, 2026",a:"Update termination clauses for Broward, Dade, Palm Beach, and Hillsborough county properties."},
  GA:{n:"Georgia",v:"low",c:0,law:"No recent changes",s:"Georgia maintains its landlord-friendly posture with no significant 2026 changes.",d:null,a:"No action required."},
  HI:{n:"Hawaii",v:"high",c:3,law:"SB 3117 — Short-Term Rental Restrictions",s:"Comprehensive restrictions on STRs across all residential zones. New permits required with nightly caps enforced by district.",d:"July 1, 2026",a:"Review all Hawaiian rental durations. File new STR permits before the deadline."},
  ID:{n:"Idaho",v:"low",c:0,law:"No recent changes",s:"Stable regulatory environment in 2026.",d:null,a:"No action required."},
  IL:{n:"Illinois",v:"medium",c:2,law:"Chicago RLTO Amendment 2026",s:"60-day relocation assistance extended to 4+ unit buildings. Security deposit interest rate updated to 0.5% annually.",d:"June 30, 2026",a:"Update relocation policies for Chicago 4+ unit buildings."},
  IN:{n:"Indiana",v:"low",c:0,law:"No recent changes",s:"Indiana maintains its landlord-friendly stance.",d:null,a:"No action required."},
  IA:{n:"Iowa",v:"low",c:0,law:"No recent changes",s:"No major legislative changes.",d:null,a:"No action required."},
  KS:{n:"Kansas",v:"low",c:0,law:"No recent changes",s:"Stable regulatory environment.",d:null,a:"No action required."},
  KY:{n:"Kentucky",v:"low",c:0,law:"No recent changes",s:"No major legislative changes in 2026.",d:null,a:"No action required."},
  LA:{n:"Louisiana",v:"low",c:0,law:"No recent changes",s:"No major changes in 2026.",d:null,a:"No action required."},
  MA:{n:"Massachusetts",v:"high",c:2,law:"H.4040 — Tenant Protections Act 2026",s:"Just cause eviction required for all tenancies over 12 months. Security deposit max reduced to 1 month's rent.",d:"October 1, 2026",a:"Update all leases. Adjust deposit policies. Schedule habitability inspections."},
  MD:{n:"Maryland",v:"medium",c:1,law:"HB 693 — Tenant Relief Integration",s:"Mandatory 7-business-day landlord response when tenants apply for emergency rental assistance.",d:"July 15, 2026",a:"Register with Maryland Tenant Relief Portal."},
  ME:{n:"Maine",v:"medium",c:1,law:"LD 2049 — Rent Notice Extension",s:"Notice for rent increases over 10% extended from 45 to 75 days for all tenancy types.",d:"August 1, 2026",a:"Update rent increase procedures to 75-day advance notice."},
  MI:{n:"Michigan",v:"low",c:0,law:"No recent changes",s:"Michigan maintains standard laws with no major 2026 changes.",d:null,a:"No action required."},
  MN:{n:"Minnesota",v:"medium",c:2,law:"SF 3350 — Rent Stabilization Extension",s:"Twin Cities pilot extended through 2027. Now covers buildings with 10+ units built before 2015.",d:"June 1, 2026",a:"Verify covered properties. Calculate permitted increases."},
  MS:{n:"Mississippi",v:"low",c:0,law:"No recent changes",s:"Mississippi remains highly landlord-friendly.",d:null,a:"No action required."},
  MO:{n:"Missouri",v:"low",c:0,law:"No recent changes",s:"No major legislative changes.",d:null,a:"No action required."},
  MT:{n:"Montana",v:"low",c:0,law:"No recent changes",s:"No major changes in 2026.",d:null,a:"No action required."},
  NC:{n:"North Carolina",v:"low",c:0,law:"No recent changes",s:"NC maintains standard landlord-tenant framework.",d:null,a:"No action required."},
  ND:{n:"North Dakota",v:"low",c:0,law:"No recent changes",s:"No major legislative changes.",d:null,a:"No action required."},
  NE:{n:"Nebraska",v:"low",c:0,law:"No recent changes",s:"Stable regulatory environment.",d:null,a:"No action required."},
  NH:{n:"New Hampshire",v:"low",c:0,law:"No recent changes",s:"No major legislative changes in 2026.",d:null,a:"No action required."},
  NJ:{n:"New Jersey",v:"high",c:3,law:"Anti-Eviction Protection Act Amendment 2026",s:"Long-term tenant (3+ years) protections expanded. Owner move-ins now require 3 months notice + 3 months rent relocation assistance.",d:"July 1, 2026",a:"URGENT: Review all 3+ year tenancies. Budget relocation assistance for owner move-ins."},
  NM:{n:"New Mexico",v:"low",c:0,law:"No recent changes",s:"No major changes in 2026.",d:null,a:"No action required."},
  NV:{n:"Nevada",v:"medium",c:1,law:"AB 340 — Post-Pandemic Normalization",s:"All pandemic-era eviction protections have fully expired statewide. Standard 7-day notice now applies everywhere.",d:"Effective now",a:"Update eviction procedures to pre-2020 standard rules."},
  NY:{n:"New York",v:"high",c:2,law:"Housing Stability Act Amendment 2026",s:"Rent stabilization expanded to 3+ unit buildings built before 1974. Annual increases capped at 2.5% through 2027.",d:"July 1, 2026",a:"Review all stabilisation registrations. Recalculate planned increases."},
  OH:{n:"Ohio",v:"low",c:0,law:"No recent changes",s:"Ohio maintains a landlord-friendly environment.",d:null,a:"No action required."},
  OK:{n:"Oklahoma",v:"low",c:0,law:"No recent changes",s:"No major legislative changes in 2026.",d:null,a:"No action required."},
  OR:{n:"Oregon",v:"high",c:2,law:"SB 611 — Rent Control Reduction 2026",s:"Annual increase cap reduced from 10% to 7% above CPI. Portland adds a 5% city cap. New buildings exempt for first 15 years.",d:"June 1, 2026",a:"Recalculate all 2026 rent increases. Verify building exemption status."},
  PA:{n:"Pennsylvania",v:"medium",c:1,law:"SB 2162 — Philadelphia Habitability Update",s:"Philadelphia extends warranty of habitability to HVAC systems under 10 years old. Annual certification required.",d:"September 1, 2026",a:"Audit HVAC at Philadelphia properties. Schedule required certifications."},
  RI:{n:"Rhode Island",v:"medium",c:1,law:"H.7123 — Providence Just Cause Eviction",s:"Just cause eviction enacted for Providence and Pawtucket. Non-renewal of 12+ month tenancies requires documented justification.",d:"August 1, 2026",a:"Update non-renewal procedures for Providence and Pawtucket properties."},
  SC:{n:"South Carolina",v:"low",c:0,law:"No recent changes",s:"South Carolina remains highly landlord-friendly.",d:null,a:"No action required."},
  SD:{n:"South Dakota",v:"low",c:0,law:"No recent changes",s:"No major legislative changes.",d:null,a:"No action required."},
  TN:{n:"Tennessee",v:"low",c:0,law:"No recent changes",s:"Tennessee maintains landlord-friendly laws.",d:null,a:"No action required."},
  TX:{n:"Texas",v:"low",c:0,law:"No recent changes",s:"Texas maintains one of the most landlord-friendly frameworks in the US.",d:null,a:"No action required."},
  UT:{n:"Utah",v:"low",c:0,law:"No recent changes",s:"No major legislative changes in 2026.",d:null,a:"No action required."},
  VA:{n:"Virginia",v:"medium",c:1,law:"HB 1601 — Source of Income Protection",s:"New statewide ban prohibits refusing housing voucher applicants. Applies to all rental properties.",d:"July 1, 2026",a:"Update screening criteria. Revise marketing materials. Train staff."},
  VT:{n:"Vermont",v:"medium",c:1,law:"H.789 — Statewide Rental Registry",s:"All landlords must register every unit with the state. Annual $30/unit fee from September 2026.",d:"September 15, 2026",a:"Register all Vermont units at vermont.gov/rentalregistry before Sept 15."},
  WA:{n:"Washington",v:"high",c:4,law:"HB 2057 — Statewide Just Cause Eviction",s:"Just cause eviction now required statewide. All landlords must document just cause for every eviction and non-renewal.",d:"May 30, 2026",a:"URGENT: Review all pending evictions and non-renewals immediately."},
  WI:{n:"Wisconsin",v:"low",c:0,law:"No recent changes",s:"Wisconsin remains landlord-friendly with no major 2026 changes.",d:null,a:"No action required."},
  WV:{n:"West Virginia",v:"low",c:0,law:"No recent changes",s:"No major legislative changes.",d:null,a:"No action required."},
  WY:{n:"Wyoming",v:"low",c:0,law:"No recent changes",s:"Wyoming maintains minimal rental regulations.",d:null,a:"No action required."},
}
