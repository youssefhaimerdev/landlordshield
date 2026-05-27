import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal','italic'], weight: ['500','700'] })

export const metadata = {
  title: 'LawRadar — Never Get Blindsided By A New Landlord Law',
  description: 'Real-time rental law monitoring across all 50 US states. Plain-English summaries delivered the moment a law changes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans), -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
