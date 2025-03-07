"use client"

import Link from "next/link"
import { HexagonIcon, Bell, User, Moon, Sun } from "lucide-react"
import { useState } from "react"
import SignIn from "./sign-in"

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1a1528] bg-opacity-95 backdrop-blur-sm py-4 border-b border-[#4cd6e3]/20">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="text-[#4cd6e3]">
              <HexagonIcon className="h-10 w-10" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-[#4cd6e3]">
                 Home
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3] border-b-2 border-[#4cd6e3] pb-1">
                Game Mechanics
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3]">
                Tokenomics
              </Link>
              <Link href="/marketplace" className="text-white hover:text-[#4cd6e3]">
                 Marketplace
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3]">
                Community
              </Link>
              <SignIn />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-[#2a2339] transition-colors">
              <Bell className="h-5 w-5 text-[#4cd6e3]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#2a2339] transition-colors">
              <User className="h-5 w-5 text-[#4cd6e3]" />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2a2339] transition-colors" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5 text-[#4cd6e3]" /> : <Moon className="h-5 w-5 text-[#4cd6e3]" />}
            </button>
          
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-[#2a2339]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#2a2339] rounded-lg p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link href="#" className="text-white hover:text-[#4cd6e3] py-2">
                 Home
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3] py-2 border-l-2 border-[#4cd6e3] pl-2">
                 Game Mechanics
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3] py-2">
                 Tokenomics
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3] py-2">
                 Marketplace
              </Link>
              <Link href="#" className="text-white hover:text-[#4cd6e3] py-2">
                 Community
              </Link>
              <div className="pt-4 border-t border-gray-700 flex justify-between">
                <button className="p-2 rounded-full hover:bg-[#1a1528] transition-colors">
                  <Bell className="h-5 w-5 text-[#4cd6e3]" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#1a1528] transition-colors">
                  <User className="h-5 w-5 text-[#4cd6e3]" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#1a1528] transition-colors" onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-[#4cd6e3]" />
                  ) : (
                    <Moon className="h-5 w-5 text-[#4cd6e3]" />
                  )}
                </button>
              </div>
           <SignIn/>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

