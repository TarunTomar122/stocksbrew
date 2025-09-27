'use client'

import React, { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="fixed inset-0 -z-10 bg-white overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {/* Large floating orb */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/60 to-purple-200/60 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        
        {/* Medium floating orb */}
        <div 
          className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-green-200/50 to-blue-200/50 rounded-full blur-2xl animate-bounce" 
          style={{ animationDuration: '6s', transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        
        {/* Small floating orb */}
        <div 
          className="absolute bottom-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-2xl animate-pulse" 
          style={{ animationDelay: '2s', transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
        
        {/* Another small orb */}
        <div 
          className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-pink-200/50 to-red-200/50 rounded-full blur-xl animate-bounce" 
          style={{ animationDuration: '8s', animationDelay: '1s', transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>

        {/* NEW: Additional colorful orbs */}
        {/* Teal/Cyan orb */}
        <div 
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-br from-teal-200/45 to-cyan-200/45 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '4s', animationDuration: '10s', transform: `translateY(${scrollY * 0.06}px)` }}
        ></div>
        
        {/* Indigo/Violet orb */}
        <div 
          className="absolute top-3/4 left-1/4 w-56 h-56 bg-gradient-to-br from-indigo-200/55 to-violet-200/55 rounded-full blur-2xl animate-bounce" 
          style={{ animationDelay: '3s', animationDuration: '7s', transform: `translateY(${scrollY * -0.07}px)` }}
        ></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Floating squares */}
        <div 
          className="absolute top-1/4 left-1/4 w-6 h-6 bg-gray-300/60 rotate-45 animate-spin" 
          style={{ animationDuration: '5s', transform: `translateY(${scrollY * 0.02}px) translateX(${scrollY * 0.01}px)` }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-4 h-4 bg-gray-400/50 rotate-45 animate-spin" 
          style={{ animationDuration: '5s', animationDirection: 'reverse', transform: `translateY(${scrollY * -0.04}px)` }}
        ></div>
        <div 
          className="absolute top-1/4 left-3/4 w-3 h-3 bg-gray-500/40 rotate-45 animate-spin" 
          style={{ animationDuration: '5s', transform: `translateY(${scrollY * 0.03}px) translateX(${scrollY * -0.02}px)` }}
        ></div>
        
        {/* Floating circles */}
        <div 
          className="absolute top-1/6 right-1/4 w-8 h-8 bg-gradient-to-r from-gray-300/50 to-gray-400/50 rounded-full animate-bounce" 
          style={{ animationDuration: '4s', transform: `translateY(${scrollY * -0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/6 w-6 h-6 bg-gradient-to-r from-gray-400/45 to-gray-500/45 rounded-full animate-bounce" 
          style={{ animationDuration: '5s', animationDelay: '1s', transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/6 w-7 h-7 bg-gradient-to-r from-gray-300/55 to-gray-400/55 rounded-full animate-bounce" 
          style={{ animationDuration: '6s', animationDelay: '2s', transform: `translateY(${scrollY * -0.03}px) translateX(${scrollY * 0.01}px)` }}
        ></div>
      </div>

      {/* Randomized animated lines */}
      <div className="absolute inset-0 opacity-20" style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.1"/>
              <stop offset="50%" stopColor="#000" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.2"/>
              <stop offset="50%" stopColor="#000" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Randomized animated lines */}
          <g className="animate-pulse" style={{ animationDuration: '8s' }}>
            <line x1="0" y1="15%" x2="85%" y2="28%" stroke="url(#lineGradient1)" strokeWidth="1.5"/>
            <line x1="15%" y1="45%" x2="100%" y2="52%" stroke="url(#lineGradient2)" strokeWidth="2"/>
            <line x1="0" y1="72%" x2="90%" y2="20%" stroke="url(#lineGradient1)" strokeWidth="1"/>
          </g>
          
          {/* Additional curved/angled lines */}
          <g className="animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}>
            <line x1="20%" y1="0" x2="60%" y2="35%" stroke="url(#lineGradient2)" strokeWidth="1.5"/>
            <line x1="70%" y1="55%" x2="100%" y2="75%" stroke="url(#lineGradient1)" strokeWidth="1"/>
            <line x1="0" y1="90%" x2="40%" y2="0%" stroke="url(#lineGradient2)" strokeWidth="2"/>
          </g>
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#000" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-gray-50/40 animate-pulse" style={{ animationDuration: '12s' }}></div>
      
      {/* Radial gradient for depth */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.1) 50%, rgba(243,244,246,0.2) 100%)'
        }}
      ></div>
    </div>
  )
} 