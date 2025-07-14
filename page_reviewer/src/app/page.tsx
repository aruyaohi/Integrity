'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, TrendingUp, Github, FileText, LoaderCircle, BarChart3, Zap,Twitter, Shield, Globe, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Web3TradingLanding = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (page: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/app')
      setIsLoading(false);
    }, 2000);
  };

  const handleNavigateToExternalSite = (url: string) => {
    window.open(url, '_blank');
  };

  // const mobileNav = [
  //   { name: 'GitHub', icon: Github, href: 'https://github.com/your-project' },
  //   { name: 'Docs', icon: FileText, href: '#' },
  //   { name: 'Analytics', icon: BarChart3, href: '#' }
  // ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/your-project', label: 'GitHub' },
    { icon: MessageCircle, href: 'https://t.me/your-project', label: 'Telegram' },
    { icon: Globe, href: 'https://twitter.com/your-project', label: 'Twitter' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Animated Network Background */}
        <div className="absolute inset-0 bg-white">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
          
          {/* Animated Grid Lines */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 136, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 136, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              animation: 'gridMove 20s linear infinite'
            }}
          ></div>
        </div>

        {/* Network Connections */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" style={{ filter: 'blur(0.5px)' }}>
            {/* Animated network lines */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 255, 136, 0.1)" />
                <stop offset="50%" stopColor="rgba(0, 255, 136, 0.3)" />
                <stop offset="100%" stopColor="rgba(0, 255, 136, 0.1)" />
              </linearGradient>
            </defs>
            
            <g className="animate-pulse">
              <line x1="10%" y1="20%" x2="90%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
              <line x1="20%" y1="10%" x2="80%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.4" />
              <line x1="30%" y1="80%" x2="70%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.5" />
              <line x1="5%" y1="60%" x2="95%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3" />
            </g>
            
            {/* Network nodes */}
            <circle cx="15%" cy="25%" r="2" fill="rgba(255, 187, 0, 0.98)" className="animate-pulse" />
            <circle cx="85%" cy="35%" r="2" fill="rgba(255, 187, 0, 0.98)" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="25%" cy="15%" r="2" fill="rgba(255, 187, 0, 0.98)" className="animate-pulse" style={{ animationDelay: '2s' }} />
            <circle cx="75%" cy="75%" r="2" fill="rgba(255, 187, 0, 0.98)" className="animate-pulse" style={{ animationDelay: '3s' }} />
          </svg>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-full blur-3xl"
            style={{
              animation: 'float 15s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/8 to-gray-400/5 rounded-full blur-3xl"
            style={{
              animation: 'float 12s ease-in-out infinite 3s'
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-400/5 rounded-full blur-3xl"
            style={{
              animation: 'float 18s ease-in-out infinite 6s'
            }}
          ></div>
        </div>

        {/* Header */}
        <header 
          className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'bg-white' 
              : 'bg-white'
          } rounded-2xl`}
        >
          <div className="w-full mx-auto px-6 lg:px-20">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-1">
                 <div 
                  className={`bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                >
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <span 
                  className={`font-bold bg-orange-500 bg-clip-text text-transparent transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}
                >
                  RIVA
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {/* {mobileNav.map((item, index) => (
                  <div key={item.name} className='flex justify-start gap-3 items-center hover:translate-x-2 transform hover:text-emerald-400 transition-all duration-300 cursor-pointer' onClick={() => handleNavigateToExternalSite(item.href)}>
                    <item.icon size={18} className='text-gray-400'/>
                    <span className="text-gray-400 font-medium hover:text-emerald-400 transition-colors duration-300">
                      {item.name}
                    </span>
                  </div>
                ))} */}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/app')}
                  className={`bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 ${
                    isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div 
              className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-gray-800 pt-6">
                <nav className="flex flex-col space-y-4">
                  {/* {mobileNav.map((item, index) => (
                    <div key={item.name} className='flex justify-start gap-3 items-center cursor-pointer' onClick={() => handleNavigateToExternalSite(item.href)}>
                      <item.icon size={18} className='text-gray-400'/>
                      <span className="text-gray-400 hover:text-emerald-400 transition-all duration-300 font-medium hover:translate-x-2 transform">
                        {item.name}
                      </span>
                    </div>
                  ))} */}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="pt-32 relative z-10">
          <section className="min-h-screen/2 px-4 py-20 flex items-center">
            <div className="px-20 mx-auto relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                  {/* Animated Badge */}
                  <div 
                    className="inline-flex items-center bg-white text-orange-500 px-6 py-3 rounded-full text-sm font-medium border border-orange-500/30 shadow-lg shadow-gray-500/10"
                    style={{
                      animation: 'fadeInUp 0.8s ease-out 0.2s both'
                    }}
                  >
                    <div className="w-2 h-2 bg-orange-700 rounded-full mr-3 animate-pulse"></div>
                    Next-Gen DeFi Analytics
                  </div>

                  {/* Main Heading */}
                  <h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
                    style={{
                      animation: 'fadeInUp 1s ease-out 0.4s both'
                    }}
                  >
                    Make Quicker Informed trades
                    <span className="bg-gray-800 to-cyan-400 bg-clip-text text-transparent block mt-4">
                      With your personal <span className='text-orange-500'>DYOR</span> Agent
                    </span>
                  </h1>

                  {/* Subheading */}
                  <p 
                    className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-2xl"
                    style={{
                      animation: 'fadeInUp 1s ease-out 0.6s both'
                    }}
                  >
                    Leverage advanced algorithms and real-time market data to identify opportunities, 
                    minimize risks, and maximize your trading potential in the decentralized finance space.
                  </p>


                  {/* CTA Buttons */}
                  <div 
                    className="flex items-center"
                    style={{
                      animation: 'fadeInUp 1s ease-out 0.8s both'
                    }}
                  >
                    <button 
                      onClick={() => handleNavigation('/app')}
                      className="group bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 hover:text-white text-black px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 hover:text-white flex items-center"
                    >
                      {isLoading ? (
                        <LoaderCircle size={20} className='text-black animate-spin'/>
                      ) : (
                        <>
                         Get Started
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column - Trading Dashboard Mock */}
                <div className="relative">
                  {/* Floating Elements */}
                  <div 
                    className="absolute -top-10 -left-10 w-20 h-20 bg-emerald-500/10 rounded-full opacity-60 blur-sm"
                    style={{
                      animation: 'float 6s ease-in-out infinite'
                    }}
                  ></div>
                  <div 
                    className="absolute top-20 -right-8 w-16 h-16 bg-cyan-500/10 rounded-full opacity-40 blur-sm"
                    style={{
                      animation: 'float 8s ease-in-out infinite 2s'
                    }}
                  ></div>
                  <div 
                    className="absolute -bottom-10 left-10 w-12 h-12 bg-purple-500/15 rounded-full opacity-50 blur-sm"
                    style={{
                      animation: 'float 7s ease-in-out infinite 1s'
                    }}
                  ></div>

                  {/* Dashboard Preview */}
                  <div 
                    className="bg-transparent rounded-3xl p-8 relative overflow-hidden"
                    style={{
                      animation: 'slideInUp 1.2s ease-out 1s both'
                    }}
                  >
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-white rounded-3xl"></div>
                    
                    {/* Mock trading interface */}
                    <div className="relative z-10">
                        <img src={'/bg.png'}/>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-800/50 rounded-lg w-full"></div>
                        <div className="h-4 bg-orange-500/50 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-orange-500/20 rounded-lg w-5/6"></div>
                        <div className="h-4 bg-gray-800/50 rounded-lg w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex justify-center space-x-8 mb-8">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a 
                      key={social.label}
                      href={social.href} 
                      className="text-gray-500 hover:text-orange-500 transition-colors duration-300 cursor-pointer hover:scale-110 transform"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
              
              <div className="pt-8">
                <p className="text-gray-600 text-sm">
                  © 2025 Oriva. All rights reserved. Trading involves risk and may not be suitable for all investors.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Web3TradingLanding;