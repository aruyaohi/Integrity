'use client'
import React from "react";
import { useState} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { X, Menu, Clock, Coins, FolderOpen, Wallet, QrCode,User, HelpCircle, ChevronDown, ChevronRight, Bot, Pen, Bell } from "lucide-react";
import WatchList from "../components/app/watchlist";
import HomePage from "../components/app/home";


interface SubMenuItem {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
}

interface MenuItem {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: string;
    submenu?: SubMenuItem[];
}



const HomeComponent: React.FC = () => {
    const { connected, publicKey ,disconnect} = useWallet();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [activeMenuItem, setActiveMenuItem] = useState<string>('ChatBot');
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMenuItemClick = (item: string): void => {
        setActiveMenuItem(item);
        if (window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    };

    const toggleSubmenu = (menu: string): void => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

     const handleConnectWallet = () => {
    // This will trigger the wallet connection
    // The useEffect above will handle navigation once connected
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
    

    const menuItems: MenuItem[] = [
        { name: 'ChatBot', icon: Bot },
        { 
            name: 'Watchlist', 
            icon: Clock, 
            path: '/waitlist',
            submenu: [
                { name: 'Tokens', icon: Coins, path: '/waitlist/tokens' },
                { name: 'Projects', icon: FolderOpen, path: '/waitlist/projects' },
                { name: 'Wallets', icon: Wallet, path: '/waitlist/wallets' }
            ]
        },
        { name: 'Scan', icon: QrCode, path: '/scanner' },
        { name: 'Notes', icon: Pen, path: '/scanner' },
        { name: 'Alerts', icon: Bell, path: '/scanner' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Help', icon: HelpCircle, path: '/help' }
    ];

    const renderMenuItem = (item: MenuItem) => {
        const isActive = activeMenuItem === item.name;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedMenu === item.name;

        return (
            <div key={item.name} className="mb-1">
                <div
                    className={`flex items-center ${isActive? 'border-r border-[#11DE2C]': 'border-none'} py-5 justify-between w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                        isActive 
                            ? 'text-[#11DE2C]' 
                            : 'text-gray-700 hover:text-[#11DE2C]'
                    }`}
                    onClick={() => {
                        if (hasSubmenu) {
                            toggleSubmenu(item.name);
                        } else {
                            handleMenuItemClick(item.name);
                        }
                    }}
                >
                    <div className={`flex items-center space-x-6`}>
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-[#11DE2C]' : 'text-gray-50'}`} />
                        <span className={`font-semibold text-md text-gray-50 ${isActive? 'text-green-500' : 'text-gray-50'}`}>{item.name}</span>
                    </div>
                    {hasSubmenu && (
                        <div className="transition-transform duration-200">
                            {isExpanded ? (
                                <ChevronDown className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-white'}`} />
                            ) : (
                                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-white'}`} />
                            )}
                        </div>
                    )}
                </div>
                
                {/* {hasSubmenu && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="ml-4 mt-2 space-y-1">
                            {item.submenu.map((subItem: string) => (
                                <div
                                    key={subItem.name}
                                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        activeMenuItem === subItem.name
                                            ? 'text-[#11DE2C] border-l-2 border-[#11DE2C]'
                                            : 'text-gray-200 hover:text-green-500'
                                    }`}
                                    onClick={() => handleMenuItemClick(subItem.name)}
                                >
                                    <subItem.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{subItem.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}
                 {hasSubmenu && item.submenu && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="ml-4 mt-2 space-y-1">
                            {item.submenu.map((subItem: SubMenuItem) => (
                                <div
                                    key={subItem.name}
                                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        activeMenuItem === subItem.name
                                            ? 'text-[#11DE2C] border-l-2 border-[#11DE2C]'
                                            : 'text-gray-200 hover:text-green-500'
                                    }`}
                                    onClick={() => handleMenuItemClick(subItem.name)}
                                >
                                    <subItem.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{subItem.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
};


return (
        <>
            <div className="w-full bg-[#2c2c2c] flex justify-between">
                {/* Sidebar Overlay for Mobile */}
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
                        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={toggleMobileMenu}
                />
                {/* Sidebar */}
                <div 
                    className={`fixed overflow-hidden top-0 left-0 h-screen w-86 flex flex-col justify-between bg-[#2a2a2a] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:shadow-none`}
                >
                    {/* Sidebar Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#11DE2C] rounded-xl w-10 h-10 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">IN</span>
                                </div>
                                <span className="font-bold text-sm bg-gradient-to-r from-gray-800 to-gray-800 bg-clip-text text-white">
                                    TEGRITY
                                </span>
                            </div>
                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                        {menuItems.map(renderMenuItem)}
                    </nav>


                    <div className="py-10 px-10">
                        {connected ? (
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">
                        {formatAddress(publicKey?.toBase58() || '')}
                      </span>
                    </div>
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
                </div>

                              <div className="lg:hidden fixed top-4 left-4 z-30">
    <button
        onClick={toggleMobileMenu}
        className="p-3 rounded-lg bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] transition-colors shadow-lg"
    >
        <Menu className="w-6 h-6" />
    </button>
</div>
                {/* Main Content */}
                <div className="h-screen w-full px-10 overflow-auto">
                    {activeMenuItem === 'ChatBot'? <HomePage/> : activeMenuItem === "Watchlist"?<WatchList/> : <div className="flex justify-center items-center text-white h-screen">Coming Soon</div> }
                </div>
            </div>
        </>
    )
}

export default HomeComponent;