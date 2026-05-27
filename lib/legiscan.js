const BASE = 'https://api.legiscan.com/'

// Keywords indicating a bill affects residential landlords
const KEYWORDS = [
  'landlord', 'tenant', 'rental property', 'rent control', 'eviction',
  'security deposit', 'residential lease', 'habitability', 'just cause',
  'relocation assistance', 'notice to quit', 'tenancy',
]

async function legiscan(params) {
  const url = new URL(BASE)
  url.searchParams.set('key', process.env.LEGISCAN_API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  return res.json()
}

// ── Get recent landlord-relevant bills for a state ────────────
export async function fetchLandlordBills(stateAbbr) {
  const data = await legiscan({ op: 'getMasterList', state: stateAbbr })
  if (data.status !== 'OK') return []

  const allBills = Object.values(data.masterlist).filter(b => typeof b === 'object' && b.bill_id)

  return allBills.filter(bill => {
    const title = (bill.title || '').toLowerCase()
    return KEYWORDS.some(kw => title.includes(kw))
  })
}

// ── Get full bill details ─────────────────────────────────────
export async function getBillDetails(billId) {
  const data = await legiscan({ op: 'getBill', id: billId })
  return data.status === 'OK' ? data.bill : null
}

// ── Get bill text (base64-decoded) ────────────────────────────
export async function getBillText(docId) {
  const data = await legiscan({ op: 'getBillText', id: docId })
  if (data.status !== 'OK' || !data.text?.doc) return ''
  return Buffer.from(data.text.doc, 'base64').toString('utf-8').slice(0, 5000)
}
