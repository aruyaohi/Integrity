'use client'
import React, { useState, useEffect } from 'react';
import {Menu, X, ArrowRight, TrendingUp, Github,LoaderCircle, BarChart3, Globe, MessageCircle, Users, Code, Lock, AlertTriangle, CheckCircle, XCircle, Activity, DollarSign, Target, TrendingDown, Eye, BookOpen, Settings, Award, ChevronDown, ChevronUp, ShipWheel } from 'lucide-react';
import {XAxis, YAxis, ResponsiveContainer, Area, AreaChart,} from 'recharts';

// Type definitions
interface ChartDataPoint {
  time: string;
  price: number;
}

interface MarketDataPoint {
  name: string;
  value: number;
  change: number;
}

interface TokenDistribution {
  name: string;
  value: number;
  color: string;
}

interface DevActivityData {
  month: string;
  commits: number;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

interface ExpandedSections {
  [key: string]: boolean;
}

const Web3TradingLanding: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  // Sample chart data
  const chartData: ChartDataPoint[] = [
    { time: '00:00', price: 2340 },
    { time: '04:00', price: 2380 },
    { time: '08:00', price: 2420 },
    { time: '12:00', price: 2450 },
    { time: '16:00', price: 2390 },
    { time: '20:00', price: 2480 },
    { time: '24:00', price: 2520 },
  ];

  // Market data
  const marketData: MarketDataPoint[] = [
    { name: 'Market Cap', value: 240000000000, change: 5.2 },
    { name: 'Volume 24h', value: 12000000000, change: 15.3 },
    { name: 'Circulating Supply', value: 120000000, change: 0.1 },
    { name: 'Total Supply', value: 120000000, change: 0 },
  ];

  // Token distribution data
  const tokenDistribution: TokenDistribution[] = [
    { name: 'Public Sale', value: 40, color: '#10b981' },
    { name: 'Team', value: 20, color: '#3b82f6' },
    { name: 'Advisors', value: 10, color: '#f59e0b' },
    { name: 'Development', value: 15, color: '#ef4444' },
    { name: 'Marketing', value: 10, color: '#8b5cf6' },
    { name: 'Reserve', value: 5, color: '#6b7280' },
  ];

  // Developer activity data
  const devActivityData: DevActivityData[] = [
    { month: 'Jan', commits: 145 },
    { month: 'Feb', commits: 189 },
    { month: 'Mar', commits: 223 },
    { month: 'Apr', commits: 267 },
    { month: 'May', commits: 198 },
    { month: 'Jun', commits: 234 },
  ];

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (page: string): void => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(`Navigating to ${page}`);
      setIsLoading(false);
    }, 2000);
  };

  const toggleSection = (section: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRiskColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const socialLinks: SocialLink[] = [
    { icon: Github, href: 'https://github.com/your-project', label: 'GitHub' },
    { icon: MessageCircle, href: 'https://t.me/your-project', label: 'Telegram' },
    { icon: Globe, href: 'https://twitter.com/your-project', label: 'Twitter' },
  ];

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-white">
        {/* Header */}
        <header 
          className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out  ${
            isScrolled ? 'bg-white py-3' : 'bg-transparent'
          }`}
        >
          <div className="w-full mx-auto px-6 lg:px-20">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-1">
                 <div 
                  className={`bg-gradient-to-br from-green-500 to-green-500 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                >
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span 
                  className={`font-bold bg-gradient-to-r from-gray-800 to-gray-800 bg-clip-text text-transparent transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}
                >
                  ROBE
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {/* Add navigation items here if needed */}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/app')}
                  className={`bg-gradient-to-r from-gray-800 to-gray-800 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 ${
                    isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-3'
                  }`}
                >
                  Get Started
                </button>
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
                  <button 
                    onClick={() => handleNavigation('/app')}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-center"
                  >
                    Get Started
                  </button>
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
    className="inline-flex items-center bg-white text-green-500 px-6 py-3 rounded-full text-sm font-medium border border-green-500/30 shadow-lg shadow-orange-500/10"
    style={{
      animation: 'fadeInUp 0.8s ease-out 0.2s both'
    }}
  >
    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
    Personal DYOR Agent
  </div>

  {/* Main Heading */}
  <h1 
    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
    style={{
      animation: 'fadeInUp 1s ease-out 0.4s both'
    }}
  >
    Make Quicker Informed trades
    <span className="text-gray-800 block mt-4">
      With your personal <span className='text-green-500'>DYOR</span> Agent
    </span>
  </h1>

  {/* Subheading */}
  <p
    className="text-lg md:text-xl leading-relaxed max-w-2xl text-gray-600"
    style={{
      animation: 'fadeInUp 1s ease-out 0.6s both'
    }}
  >
    Comprehensive analysis covering fundamentals, market metrics, on-chain data, 
    and risk assessment to help you make informed trading decisions.
  </p>

  {/* Token Input Section */}
  <div 
    className="max-w-2xl space-y-4"
    style={{
      animation: 'fadeInUp 1s ease-out 0.7s both'
    }}
  >
    <div className="relative">
      <input
        type="text"
        placeholder="Enter token name, symbol, or official website URL..."
        className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-lg placeholder-gray-400 transition-all duration-300"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Upload Whitepaper Button */}
    <div className="flex items-center">
      <label className="cursor-pointer group">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 group-hover:border-green-300">
          <svg className="w-4 h-4 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">
            Upload Whitepaper
          </span>
        </div>
      </label>
      <div className="ml-3 text-xs text-gray-500">
        PDF, DOC, DOCX accepted
      </div>
    </div>
  </div>

  {/* CTA Buttons */}
  <div 
    className="flex items-center"
    style={{
      animation: 'fadeInUp 1s ease-out 0.8s both'
    }}
  >
    <button 
      onClick={() => handleNavigation('/app')}
      className="group bg-gradient-to-r from-gray-800 to-gray-800 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 flex items-center"
    >
      {isLoading ? (
        <LoaderCircle size={20} className='text-white animate-spin'/>
      ) : (
        <>
         Get Started
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </>
      )}
    </button>
  </div>
</div>

                

                {/* Right Column - Comprehensive Analysis Dashboard */}
                <div className="relative">
                  <div 
                    className="absolute top-20 -right-8 w-16 h-16 bg-green-500/10 rounded-full opacity-40 blur-sm"
                    style={{
                      animation: 'float 8s ease-in-out infinite 2s'
                    }}
                  ></div>
                  <div 
                    className="absolute -bottom-10 left-10 w-12 h-12 bg-green-500/15 rounded-full opacity-50 blur-sm"
                    style={{
                      animation: 'float 7s ease-in-out infinite 1s'
                    }}
                  ></div>

                  {/* Comprehensive DYOR Dashboard */}
                  <div 
                    className="bg-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-gray-200"
                    style={{
                      animation: 'slideInUp 1.2s ease-out 1s both'
                    }}
                  >
                    {/* Header with Project Info */}
                    <div className="mb-6">
                        <div className='py-4'>
                          <p className='font-bold '>July 15,2025 <span className='text-gray-600'>GMT: 7:52AM</span></p>
                        </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">ETH</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Ethereum</h3>
                            <p className="text-sm text-gray-500">ETH/USD</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">$2,520.00</div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-500 font-medium">+5.2%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall DYOR Score</span>
                        <span className="text-2xl font-bold text-green-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Strong fundamentals with moderate risk</p>
                    </div>
                    
                    {/* Price Chart */}
                    <div className="h-32 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="time" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            domain={['dataMin - 20', 'dataMax + 20']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Analysis Categories */}
                    <div className="space-y-4">
                      {/* I. Project & Whitepaper Analysis */}
                      <div className="border border-gray-100 rounded-xl">
                        <button 
                          onClick={() => toggleSection('fundamentals')}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <ShipWheel className="w-5 h-5 text-gray-900" />
                            <span className="font-medium text-gray-800">Technology</span>
                            {/* <span className="text-sm font-bold text-blue-600">88/100</span> */}
                          </div>
                          {expandedSections.fundamentals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedSections.fundamentals && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="flex flex-col gap-3">
                              <div className="bg-white rounded-lg p-2 flex flex-col">
                                <div className='flex justify-start gap-2 items-center'>
                                <div className="font-semibold text-gray-900">Problem/Solution - </div>
                                <div className="font-semibold text-green-600">feasible</div>
                                </div>
                                <div>
                                <p>
                                  Bitcoin is a decentralized, peer-to-peer digital cash system that solves the "double-spending" problem without needing a central authority, achieved through a public, immutable blockchain and Proof-of-Work.
                                </p>
                                </div>
                              </div>
                                <div className="bg-white rounded-lg p-2 flex flex-col">
                                <div className='flex justify-start gap-2 items-center'>
                                <div className="font-semibold text-gray-900">Technology - </div>
                                <div className="font-semibold text-green-600">Practical</div>
                                </div>
                                <div>
                                <p>
                                 Bitcoin's technology is built upon a decentralized digital ledger known as a blockchain. This public ledger meticulously records every transaction, with identical copies distributed and maintained across a global network of independent computers, not a central server. Individual transactions are grouped into "blocks," and each new block is cryptographically linked to the preceding one, forming an immutable chain. The process of adding these new blocks is called "mining," where powerful computers compete to solve complex computational puzzles. The first to find a solution validates the block and adds it to the chain, receiving a reward. This intricate mechanism ensures the integrity and order of all transactions. Because all network participants collectively verify these additions, a consensus is naturally achieved on the true state of the ledger, thereby eliminating the need for any single controlling authority.

The profound importance of this technology lies in its ability to establish a secure, transparent, and censorship-resistant system for digital value exchange. It fundamentally removes reliance on traditional financial intermediaries, fostering trust through mathematical proof and network-wide verification rather than institutional oversight.
                                </p>
                                </div>
                              </div>
                                <div className="bg-white rounded-lg p-2 flex flex-col">
                                <div className='flex justify-start gap-2 items-center'>
                                <div className="font-semibold text-gray-900">White Paper Score - </div>
                                <div className="font-semibold text-green-600">8/10</div>
                                </div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Team</div>
                                <div className="font-semibold text-green-600">Excellent</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* II. Market & On-Chain Analysis */}
                      <div className="border border-gray-100 rounded-xl">
                        <button 
                          onClick={() => toggleSection('market')}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="w-5 h-5 text-gray-800" />
                            <span className="font-medium text-gray-800">Onchain Analysis</span>
                            {/* <span className="text-sm font-bold text-green-600">82/100</span> */}
                          </div>
                          {expandedSections.market ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedSections.market && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Market Cap</div>
                                <div className="font-semibold text-gray-800">$240B</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">24h Volume</div>
                                <div className="font-semibold text-gray-800">$12B</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Active Addresses</div>
                                <div className="font-semibold text-gray-800">420K</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Dev Activity</div>
                                <div className="font-semibold text-green-600">High</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* III. Community & Sentiment */}
                      <div className="border border-gray-100 rounded-xl">
                        <button 
                          onClick={() => toggleSection('community')}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-gray-800" />
                            <span className="font-medium text-gray-800">Team</span>
                          </div>
                          {expandedSections.community ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedSections.community && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Social Score</div>
                                <div className="font-semibold text-green-600">High</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Sentiment</div>
                                <div className="font-semibold text-green-600">Bullish</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* IV. Risk Assessment */}
                      <div className="border border-gray-100 rounded-xl">
                        <button 
                          onClick={() => toggleSection('risk')}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-gray-800" />
                            <span className="font-medium text-gray-800">Risk Assessment</span>
                            <span className="text-sm font-bold text-green-600">safe</span>
                          </div>
                          {expandedSections.risk ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedSections.risk && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Regulatory</div>
                                <div className="font-semibold text-yellow-600">Medium</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Security</div>
                                <div className="font-semibold text-green-600">Low</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Market</div>
                                <div className="font-semibold text-yellow-600">Medium</div>
                              </div>
                              <div className="text-center bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500">Competitive</div>
                                <div className="font-semibold text-green-600">Low</div>
                              </div>
                            </div>
                          </div>
                        )}
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
                  © 2025 Probe. All rights reserved. Trading involves risk and may not be suitable for all investors.
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