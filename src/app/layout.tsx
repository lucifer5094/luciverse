import type { Metadata } from 'next'
import './globals.css'
import '@/styles/auth.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OwnerAccessBanner from '@/components/OwnerAccessBanner'
import OwnerFloatingControls from '@/components/OwnerFloatingControls'

export const metadata: Metadata = {
  title: 'Luciverse',
  description: 'A universe of creativity and code by Lucifer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
        <OwnerAccessBanner />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <OwnerFloatingControls />
      </body>
    </html>
  )
}
