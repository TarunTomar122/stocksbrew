import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StocksBrew - AI-Powered Stock Newsletter',
  description: 'Your personalized portfolio insights delivered straight to your inbox, every day at 8 am.',
  keywords: 'stocks, newsletter, AI, portfolio, investment, Indian stocks',
  authors: [{ name: 'StocksBrew Team' }],
  openGraph: {
    title: 'StocksBrew - AI-Powered Stock Newsletter',
    description: 'Your personalized portfolio insights delivered straight to your inbox, every day at 8 am.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 overflow-x-hidden min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 