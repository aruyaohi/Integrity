'use client'
import React, { useState, useEffect, } from 'react';
import {Menu, X, Github, MessageCircle, Twitter, ArrowRight} from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const Web3TradingLanding: React.FC = () => {
  const {connected, publicKey, disconnect} = useWallet()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to /app when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected:", publicKey.toBase58());
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        router.push('/app');
      }, 1000);
    }
  }, [connected, publicKey, router]);

  const handleConnectWallet = () => {
    // This will trigger the wallet connection
    // The useEffect above will handle navigation once connected
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const socialLinks: SocialLink[] = [
    { icon: Github, href: 'https://github.com/your-project', label: 'GitHub' },
    { icon: MessageCircle, href: 'https://t.me/your-project', label: 'Telegram' },
    { icon: Twitter, href: 'https://twitter.com/your-project', label: 'Twitter' },
  ];

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-[#1c1c1c]">
        {/* Header */}
        <header 
          className={`fixed top-1 left-4 right-4 z-50 transition-all duration-500 ease-in-out  ${
            isScrolled ? 'bg-[#1c1c1c] py-3' : 'bg-transparent'
          }`}
        >
          <div className="w-full mx-auto px-6 lg:px-20">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-1">
                 <div 
                  className={`bg-[#11DE2C] rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                >
                  <span className="text-white font-bold text-xl">IN</span>
                </div>
                <span 
                  className={`font-bold bg-gradient-to-r from-gray-800 to-gray-800 bg-clip-text text-white transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}
                >
                  TEGRITY
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {/* Add navigation items here if needed */}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                {connected ? (
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">
                        {formatAddress(publicKey?.toBase58() || '')}
                      </span>
                    </div>
                    <button 
                      onClick={() => router.push('/app')}
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
                    >
                      <span>Launch App</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={disconnect}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div onClick={handleConnectWallet}>
                    <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-500 !hover:from-green-500 !hover:to-green-400 !text-white !px-6 !py-3 !rounded-xl !font-semibold !transition-all !duration-300 !transform !hover:scale-105 !hover:shadow-lg !hover:shadow-green-500/25" />
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-200/50 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div 
              className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-gray-200 pt-6">
                <nav className="flex flex-col space-y-4">
                  {connected ? (
                    <div className="space-y-3">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">
                          {formatAddress(publicKey?.toBase58() || '')}
                        </span>
                      </div>
                      <button 
                        onClick={() => router.push('/app')}
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-center flex items-center justify-center space-x-2"
                      >
                        <span>Launch App</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={disconnect}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-300 text-center"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <div onClick={handleConnectWallet}>
                      <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-500 !hover:from-green-500 !hover:to-green-400 !text-white !px-6 !py-3 !rounded-xl !font-semibold !transition-all !duration-300 !w-full" />
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="pt-32 relative z-10">
          <section className="min-h-screen/2 px-4 py-20 flex items-center">
            <div className="px-20 mx-auto relative">
              <div className="flex flex-col gap-12 items-center justify-center">
                {/* Left Column - Text Content */}
                <div className='gap-2'>
                  <div className="space-y-8">
                    {/* Main Heading */}
                    <h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-50 leading-tight text-center"
                      style={{
                        animation: 'fadeInUp 1s ease-out 0.4s both'
                      }}
                    >
                      Make Quicker Informed trades
                      <span className="text-gray-50 block mt-4 text-center">
                        With your personal <span className='text-[#11DE2C]'>DYOR</span> Agent
                      </span>
                    </h1>

                    {/* Subheading */}
                    <p
                      className="text-lg md:text-xl leading-relaxed max-w-4xl text-gray-50 text-center"
                      style={{
                        animation: 'fadeInUp 1s ease-out 0.6s both'
                      }}
                    >
                      Comprehensive analysis covering fundamentals, market metrics, on-chain data, 
                      and risk assessment to help you make informed trading decisions.
                    </p>

                    {/* Connection Status or CTA */}
                    {connected ? (
                      <div 
                        className="flex flex-col items-center space-y-4"
                        style={{
                          animation: 'fadeInUp 1s ease-out 0.8s both'
                        }}
                      >
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-6 py-3 flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 font-medium">
                            Wallet Connected: {formatAddress(publicKey?.toBase58() || '')}
                          </span>
                        </div>
                        <p className="text-gray-400 text-center">
                          Redirecting to app...
                        </p>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center space-y-4"
                        style={{
                          animation: 'fadeInUp 1s ease-out 0.8s both'
                        }}
                      >
                        <div onClick={handleConnectWallet} className="cursor-pointer">
                          <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-500 !hover:from-green-500 !hover:to-green-400 !text-white !px-8 !py-4 !rounded-xl !font-semibold !transition-all !duration-300 !transform !hover:scale-105 !hover:shadow-lg !hover:shadow-green-500/25 !text-lg" />
                        </div>
                        <p className="text-gray-400 text-center">
                          Connect your wallet to access your Personal DYOR Agent
                        </p>
                      </div>
                    )}
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
                      className="text-gray-400 hover:text-green-500 transition-colors duration-300 cursor-pointer hover:scale-110 transform"
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
                <p className="text-gray-500 text-sm">
                  © 2025 Integrity. All rights reserved. Trading involves risk and may not be suitable for all investors.
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