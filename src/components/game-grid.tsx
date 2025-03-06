// import Image from "next/image"

export default function GameGrid() {
  return (
    <div className="relative w-full aspect-square">
      {/* This would ideally be replaced with the actual isometric game grid image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative">
          {/* <Image
            src="/banner.jpeg"
            alt="Isometric Game Grid"
            width={600}
            height={600}
            className="w-full h-auto"
          /> */}

          {/* Overlay elements could be positioned absolutely here */}
          <div className="absolute top-1/4 right-1/4 bg-[#4cd6e3]/20 p-4 rounded-lg border border-[#4cd6e3]">
            <span className="text-[#4cd6e3]">$SED</span>
          </div>

          <div className="absolute bottom-1/3 left-1/3 bg-[#4cd6e3]/20 p-2 rounded-full border border-[#4cd6e3]">
            <div className="h-4 w-4 bg-[#4cd6e3] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

