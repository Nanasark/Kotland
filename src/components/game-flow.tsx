import { ArrowRight } from "lucide-react"

export default function GameFlow() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="bg-[#2a2339] p-4 rounded-lg border border-[#4cd6e3]/30 mb-2">
          <div className="text-[#4cd6e3] text-3xl">🌱</div>
        </div>
        <h3 className="font-medium">Buy Land & Plant</h3>
      </div>

      <ArrowRight className="hidden md:block text-[#4cd6e3]" />
      <div className="rotate-90 md:hidden text-[#4cd6e3]">
        <ArrowRight />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="bg-[#2a2339] p-4 rounded-lg border border-[#4cd6e3]/30 mb-2">
          <div className="text-[#4cd6e3] text-3xl">🏭</div>
        </div>
        <h3 className="font-medium">Process in Factory</h3>
      </div>

      <ArrowRight className="hidden md:block text-[#4cd6e3]" />
      <div className="rotate-90 md:hidden text-[#4cd6e3]">
        <ArrowRight />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="bg-[#2a2339] p-4 rounded-lg border border-[#4cd6e3]/30 mb-2">
          <div className="text-[#4cd6e3] text-3xl">🚚</div>
        </div>
        <h3 className="font-medium">Transport Goods</h3>
      </div>

      <ArrowRight className="hidden md:block text-[#4cd6e3]" />
      <div className="rotate-90 md:hidden text-[#4cd6e3]">
        <ArrowRight />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="bg-[#2a2339] p-4 rounded-lg border border-[#4cd6e3]/30 mb-2">
          <div className="text-[#4cd6e3] text-3xl">💰</div>
        </div>
        <h3 className="font-medium">Trade & Earn</h3>
      </div>
    </div>
  )
}

