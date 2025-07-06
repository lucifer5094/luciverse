'use client'

import { useUserTracking } from '@/hooks/useUserTracking'
import React from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Enable user tracking automatically
  useUserTracking()

  return <>{children}</>
}
