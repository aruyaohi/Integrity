'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight,Brain,Github,ScrollIcon, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (page:string)  =>{
    setIsLoading(true)
    setTimeout(() =>{
      router.push(page)
    },3000) 
  }

  // type navItem =  {
  //   name: string,
  //   icon: React.ComponentType<{ className?: string }>;
  // }

  const mobileNav = [
    {name: 'Gihub', icon: Github, href: 'https://github.com/aruyaohi/academic_paper_reviewer'},
    {name: 'Docs', icon: ScrollIcon, href: '#'}
  ]

   const socialLinks = [
    { icon: Github, href: 'https://github.com/aruyaohi/academic_paper_reviewer', label: 'GitHub' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const router = useRouter();

  return (
    <>
      {/* Unified Background Container */}
      <div className="min-h-screen relative overflow-hidden bg-white">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-100/50"></div>
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-sky-300/20 rounded-full blur-3xl"
            style={{
              animation: 'float 15s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-sky-200/25 to-blue-300/15 rounded-full blur-3xl"
            style={{
              animation: 'float 12s ease-in-out infinite 3s'
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-sky-200/10 rounded-full blur-3xl"
            style={{
              animation: 'float 18s ease-in-out infinite 6s'
            }}
          ></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Header */}
        <header 
          className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-xl shadow-md border border-blue-100/50 py-3' 
              : 'bg-white/70 backdrop-blur-md border border-blue-50/30 py-6'
          } rounded-2xl`}
        >
          <div className="w-full mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div 
                  className={`bg-white rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                >
                  <Brain className={`text-blue-500 transition-all duration-300 ${isScrolled ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
                <span 
                  className={`font-bold text-gray-900 transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}
                >
                  PeerReview
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {mobileNav.map((item,index) => (
                  <div key={item.name} className='flex justify-start gap-3 items-center hover:translate-x-2 transform hover:text-blue-500  transition-all duration-300'>
                    <item.icon size={18} className='text-gray-900'/>
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-gray-600 font-medium  ${
                        isMobileMenuOpen ? 'animate-slideIn' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </a>
                    </div>
                ))}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/app')}
                  className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'
                  }`}
                >
                  Try Demo
                </button>
              </div>

              {/* Mobile Menu Button */}
                              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
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
              <div className="border-t border-blue-100 pt-6">
                <nav className="flex flex-col space-y-4">
                  {mobileNav.map((item, index) => (
                    <div key={item.name} className='flex justify-start gap-3 items-center'>
                    <item.icon size={18} className='text-gray-900'/>
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-gray-600 hover:text-purple-600 transition-all duration-300 font-medium hover:translate-x-2 transform ${
                        isMobileMenuOpen ? 'animate-slideIn' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </a>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="pt-32 relative z-10">
          <section className="min-h-screen px-4 py-20 flex items-center">
            <div className="max-w-6xl mx-auto text-center relative">
              {/* Animated Badge */}
              <div 
                className="inline-flex items-center bg-white/60 backdrop-blur-sm text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-blue-200/50 shadow-lg"
                style={{
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                AI-Powered Document Analysis
              </div>

              {/* Main Heading */}
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.4s both'
                }}
              >
                Analyze Research Papers
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block mt-4">
                  For Errors & Insights
                </span>
              </h1>

              {/* Subheading */}
              <p 
                className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.6s both'
                }}
              >
                Upload your documents and let our AI agents detect inconsistencies, 
                factual errors, and provide intelligent insights to improve your research quality.
              </p>

              {/* CTA Buttons */}
              <div 
                className="flex justify-center items-center mb-20"
                style={{
                  animation: 'fadeInUp 1s ease-out 0.8s both'
                }}
              >
                <button 
                onClick={() => handleNavigation('/app')}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center shadow-lg">
                 {isLoading? <LoaderCircle size={20} className='text-white animate-spin'/>: <>Try Demo
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" /> </>}
                </button>
              </div>

              {/* Floating Elements */}
              <div className="relative">
                {/* Smaller Animated Orbs */}
                <div 
                  className="absolute top-10 left-10 w-20 h-20 bg-blue-200/40 rounded-full opacity-60 blur-sm"
                  style={{
                    animation: 'float 6s ease-in-out infinite'
                  }}
                ></div>
                <div 
                  className="absolute top-32 right-16 w-16 h-16 bg-blue-300/30 rounded-full opacity-40 blur-sm"
                  style={{
                    animation: 'float 8s ease-in-out infinite 2s'
                  }}
                ></div>
                <div 
                  className="absolute bottom-20 left-20 w-12 h-12 bg-blue-400/50 rounded-full opacity-50 blur-sm"
                  style={{
                    animation: 'float 7s ease-in-out infinite 1s'
                  }}
                ></div>

                {/* Document Preview Mock */}
                <div 
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-8 max-w-4xl mx-auto relative overflow-hidden"
                  style={{
                    animation: 'slideInUp 1.2s ease-out 1s both'
                  }}
                >
                  {/* Shimmer effect for the preview */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                  
                  {/* Mock content lines */}
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200/60 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200/60 rounded-lg w-full"></div>
                    <div className="h-4 bg-gray-200/60 rounded-lg w-5/6"></div>
                    <div className="h-4 bg-blue-200/60 rounded-lg w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <footer className="bg-white border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xl font-bold text-gray-900">PeerReview</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Advanced AI-powered document analysis that helps researchers and professionals 
                detect errors, inconsistencies, and gain valuable insights from their white papers.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a 
                      key={social.label}
                      href={social.href} 
                      className="text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {mobileNav.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href} 
                      className="text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
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
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AnimatedHeader;