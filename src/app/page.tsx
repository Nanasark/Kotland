"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Twitter, Mail, HexagonIcon, TrendingUp, ArrowUpRight } from "lucide-react"
import Header from "@/components/Header"
import SeasonCountdown from "@/components/season-countdown"
import GameFlow from "@/components/game-flow"
import MarketplaceActivity from "@/components/marketplace-activity"
import TwitterFeed from "@/components/twitter-feed"
import MapCard from "@/components/map-card"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto mt-8 md:mt-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-6 leading-tight">
              BUILD. <span className="text-[#4cd6e3]">TRADE.</span> CONQUER.
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Build your farming empire, process resources, and trade in a dynamic economy affected by seasonal changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-3 px-8 rounded-lg font-medium text-lg transition-colors">
                Start Playing
              </button>
              <button className="bg-transparent border-2 border-[#4cd6e3] text-[#4cd6e3] hover:bg-[#4cd6e3]/10 py-3 px-8 rounded-lg font-medium text-lg transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="md:col-span-7 relative">
            <div className="aspect-square relative">
              <Image
                src="/banner2.png"
                alt="Isometric Game Grid"
                width={600}
                height={600}
                className="w-full h-auto"
              />

              {/* Live Economy Stats Overlay */}
              <div className="absolute top-4 right-4 bg-[#1a1528]/80 backdrop-blur-sm p-3 rounded-lg border border-[#4cd6e3]/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Economy</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>$SEED:</span>
                    <span className="text-[#4cd6e3]">
                      $0.0842 <span className="text-green-400 text-xs">+2.4%</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>$T:</span>
                    <span className="text-[#4cd6e3]">
                      $1.245 <span className="text-red-400 text-xs">-0.8%</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Season:</span>
                    <span className="text-[#4cd6e3]">Winter</span>
                  </div>
                </div>
              </div>

              {/* Animated Notification */}
              <div className="absolute bottom-8 left-8 bg-[#4cd6e3] text-black p-2 rounded-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Apple prices rising!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season Countdown */}
      <section className="container mx-auto mb-16">
        <SeasonCountdown />
      </section>

      {/* Maps Section */}
      <section className="container mx-auto mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Our Maps</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover different regions, claim properties, and build your empire across multiple cities.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Link href="/maps">
            <MapCard
              id="maps"
              name="City Maps Collection"
              description="Explore our collection of detailed city maps including Toronto, New York, London, and more. Click to view all available maps and start claiming properties."
              imageUrl="/worldmap.jpeg"
            />
          </Link>
        </div>
      </section>

      {/* Game Features Overview */}
      <section className="container mx-auto mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Build your farming empire through a simple but strategic gameplay loop. Plant, process, transport, and trade
            to maximize profits!
          </p>
        </div>

        <GameFlow />

        <div className="mt-8 bg-[#2a2339] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-[#1a1528] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Strategic Farming</h3>
              <p className="text-gray-300 text-sm">
                Choose the right crops for the current season. Adapt to weather changes and market demands.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#1a1528] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Processing</h3>
              <p className="text-gray-300 text-sm">
                Build and upgrade factories to process raw materials into valuable goods with higher market value.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#1a1528] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💹</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Economy</h3>
              <p className="text-gray-300 text-sm">
                Trade in a player-driven marketplace where prices fluctuate based on supply, demand, and seasonal
                factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Economy & Market Insights */}
      <section className="container mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <h2 className="text-3xl font-bold mb-6">Tokenomics Overview</h2>
            <div className="bg-[#2a2339] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">$SEED Token</h3>
                  <p className="text-gray-300">Governance & Utility Token</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#4cd6e3]">$0.0842</div>
                  <div className="text-green-400 flex items-center justify-end">
                    <ArrowUpRight className="h-4 w-4 mr-1" /> +2.4%
                  </div>
                </div>
              </div>

              <div className="h-64 bg-[#1a1528] rounded-lg p-4 mb-4">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d="M0,40 L5,30 L10,35 L15,25 L20,30 L25,20 L30,25 L35,15 L40,20 L45,10 L50,15 L55,5 L60,10 L65,5 L70,15 L75,10 L80,20 L85,15 L90,25 L95,20 L100,30 L100,40 Z"
                    fill="rgba(76, 214, 227, 0.2)"
                  />
                  <path
                    d="M0,40 L5,30 L10,35 L15,25 L20,30 L25,20 L30,25 L35,15 L40,20 L45,10 L50,15 L55,5 L60,10 L65,5 L70,15 L75,10 L80,20 L85,15 L90,25 L95,20 L100,30"
                    fill="none"
                    stroke="#4cd6e3"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1528] p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="font-semibold">$24.5M</div>
                </div>
                <div className="bg-[#1a1528] p-3 rounded-lg">
                  <div className="text-sm text-gray-400">24h Volume</div>
                  <div className="font-semibold">$3.2M</div>
                </div>
                <div className="bg-[#1a1528] p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Circulating</div>
                  <div className="font-semibold">291.2M</div>
                </div>
                <div className="bg-[#1a1528] p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Total Supply</div>
                  <div className="font-semibold">500M</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <h2 className="text-3xl font-bold mb-6">Seasonal Impact</h2>
            <div className="bg-[#2a2339] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Current Season: <span className="text-[#4cd6e3]">Winter</span>
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍎</span>
                    <span>Apple Orchards</span>
                  </div>
                  <div className="text-green-400 font-medium">+25% Yield</div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌽</span>
                    <span>Corn Fields</span>
                  </div>
                  <div className="text-red-400 font-medium">-15% Yield</div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚚</span>
                    <span>Logistics</span>
                  </div>
                  <div className="text-red-400 font-medium">-10% Speed</div>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏭</span>
                    <span>Factories</span>
                  </div>
                  <div className="text-green-400 font-medium">+5% Efficiency</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Coming Next: <span className="text-green-400">Spring</span>
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Prepare your farm for the Spring season! Corn and wheat will thrive, while apple production decreases.
                Logistics will return to normal speeds.
              </p>

              <button className="w-full bg-[#1a1528] hover:bg-[#252036] text-[#4cd6e3] py-2 rounded-lg transition-colors">
                View Seasonal Strategy Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Activity */}
      <section className="container mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Marketplace Activity</h2>
            <MarketplaceActivity />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Community Updates</h2>
            <TwitterFeed />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto mb-16">
        <div className="bg-gradient-to-r from-[#1a1528] via-[#2a2339] to-[#1a1528] rounded-lg p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Farming Empire?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of players already building, trading, and earning in our dynamic ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-3 px-8 rounded-lg font-medium text-lg transition-colors">
              Start Playing Now
            </button>
            <button className="bg-transparent border-2 border-[#4cd6e3] text-[#4cd6e3] hover:bg-[#4cd6e3]/10 py-3 px-8 rounded-lg font-medium text-lg transition-colors">
              Join Discord Community
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1528] border-t border-[#4cd6e3]/20 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-[#4cd6e3] mb-4">
                <HexagonIcon className="h-10 w-10" />
              </div>
              <p className="text-gray-400 text-sm">
                The premier blockchain-based farming simulation with real economic dynamics and player-driven markets.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Tokenomics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Medium
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Crypto Farm Game. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#4cd6e3]">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

