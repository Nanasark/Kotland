import { ArrowUp, ArrowDown } from "lucide-react"

export default function MarketplaceActivity() {
  const recentTrades = [
    { id: 1, item: "Apple Orchard NFT", price: "1,250 $SEED", change: "+12%", up: true },
    { id: 2, item: "Logistics Truck #422", price: "850 $SEED", change: "-3%", up: false },
    { id: 3, item: "Wheat Processing Factory", price: "3,200 $SEED", change: "+8%", up: true },
    { id: 4, item: "Corn Field Plot", price: "720 $SEED", change: "+5%", up: true },
  ]

  return (
    <div className="bg-[#2a2339] rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Marketplace Activity</h3>
      <div className="space-y-3">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
            <div>
              <div className="font-medium">{trade.item}</div>
              <div className="text-sm text-gray-400">{trade.price}</div>
            </div>
            <div className={`flex items-center ${trade.up ? "text-green-400" : "text-red-400"}`}>
              {trade.up ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {trade.change}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-center text-[#4cd6e3] text-sm hover:underline">
        View All Marketplace Activity
      </button>
    </div>
  )
}

