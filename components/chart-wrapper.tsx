/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import dynamic from 'next/dynamic'
import { LoadingChart } from '@/components/loading-chart'

// Import CryptoChart with SSR disabled
const CryptoChart = dynamic(
  () => import('@/components/crypto-chart').then((mod: any) => mod.default),
  { 
    ssr: false,
    loading: () => <LoadingChart />
  }
)

export function ChartWrapper() {
  return (
    <div className="min-h-screen bg-[#1a1b23] p-4">
      <CryptoChart />
    </div>
  )
}

