import Header from '@/components/Header'
import DemoPortfolioClient from '@/components/DemoPortfolioClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DemoPortfolioClient />
    </div>
  )
}

