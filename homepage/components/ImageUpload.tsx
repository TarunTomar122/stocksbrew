'use client'

import React, { useState, useRef } from 'react'
import { findStockSymbols } from '@/lib/stocks'

interface ImageUploadProps {
  onStocksExtracted: (symbols: string[]) => void
}

export default function ImageUpload({ onStocksExtracted }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [extractedCount, setExtractedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('processing')
    setUploadProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const extractedSymbols = await processImage(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setExtractedCount(extractedSymbols.length)
      
      if (extractedSymbols.length > 0) {
        setUploadStatus('success')
        onStocksExtracted(extractedSymbols)
      } else {
        setUploadStatus('error')
      }
      
    } catch (error) {
      console.error('Error processing image:', error)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle')
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 3000)
    }
  }

  const processImage = async (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          // In a real implementation, you would use Tesseract.js here
          // For now, we'll simulate the OCR process
          const base64Image = e.target?.result as string
          
          // Simulate OCR processing time
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Mock extracted text - in real implementation, this would come from OCR
          const mockExtractedText = `
            Holdings Portfolio Summary
            TCS - Tata Consultancy Services
            RELIANCE - Reliance Industries
            INFY - Infosys Limited
            HDFCBANK - HDFC Bank
            ICICIBANK - ICICI Bank
            MARUTI - Maruti Suzuki
            BHARTIARTL - Bharti Airtel
            HINDUNILVR - Hindustan Unilever
            WIPRO - Wipro Limited
          `
          
          const extractedSymbols = findStockSymbols(mockExtractedText)
          resolve(extractedSymbols)
        } catch (error) {
          console.error('OCR processing error:', error)
          resolve([])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-accent/50 transition-colors duration-300 bg-white/50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploadStatus === 'idle' && (
          <div className="space-y-2 sm:space-y-3">
            <i className="fas fa-cloud-upload-alt text-2xl sm:text-3xl text-gray-500"></i>
            <div>
              <p className="text-dark font-medium text-sm sm:text-base">Upload Portfolio Screenshot</p>
              <p className="text-gray-600 text-xs sm:text-sm">We'll extract stock symbols automatically</p>
            </div>
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple/20 to-accent/20 border border-purple/30 rounded-lg text-dark text-xs sm:text-sm hover:from-purple/30 hover:to-accent/30 transition-all duration-300 disabled:opacity-50"
            >
              <i className="fas fa-image mr-2"></i>
              Choose Image
            </button>
          </div>
        )}
        
        {uploadStatus === 'processing' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
              <span className="text-dark text-sm">Processing image...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent to-neon h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="space-y-2">
            <i className="fas fa-check-circle text-2xl text-neon"></i>
            <p className="text-neon font-medium text-sm">Stocks extracted successfully!</p>
            <p className="text-gray-600 text-xs">{extractedCount} stocks found</p>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="space-y-2">
            <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
            <p className="text-red-500 font-medium text-sm">Could not extract stocks</p>
            <p className="text-gray-600 text-xs">Please try a clearer image or select manually</p>
          </div>
        )}
      </div>
    </div>
  )
} 