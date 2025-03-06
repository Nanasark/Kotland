import { Twitter } from "lucide-react"

export default function TwitterFeed() {
  const tweets = [
    {
      id: 1,
      author: "CryptoFarmGame",
      handle: "@CryptoFarm",
      content:
        "Winter season is ending soon! Make sure to harvest your winter crops before the Spring update arrives. #GameUpdate",
      time: "2h ago",
    },
    {
      id: 2,
      author: "CryptoFarmGame",
      handle: "@CryptoFarm",
      content:
        "New factory NFTs dropping this weekend! Limited supply of advanced processing plants will be available. #NFTDrop",
      time: "1d ago",
    },
    {
      id: 3,
      author: "CryptoFarmGame",
      handle: "@CryptoFarm",
      content:
        "Community AMA scheduled for Friday at 3PM UTC. Join us to discuss the upcoming economic rebalance! #CommunityEvent",
      time: "2d ago",
    },
  ]

  return (
    <div className="bg-[#2a2339] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Twitter className="h-5 w-5 text-[#4cd6e3]" />
        <h3 className="text-lg font-semibold">Latest Updates</h3>
      </div>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="border-b border-gray-700 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium">{tweet.author}</div>
              <div className="text-sm text-gray-400">{tweet.handle}</div>
            </div>
            <p className="text-sm mb-1">{tweet.content}</p>
            <div className="text-xs text-gray-400">{tweet.time}</div>
          </div>
        ))}
      </div>
      <button className="w-full mt-2 text-center text-[#4cd6e3] text-sm hover:underline">Follow Us on Twitter</button>
    </div>
  )
}

