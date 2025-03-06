export default function TokenChart() {
  return (
    <div className="w-full h-32 bg-[#1a1528] rounded relative overflow-hidden">
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
      <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-gray-500 px-1">
        <span>100</span>
        <span>200</span>
        <span>300</span>
        <span>400</span>
        <span>500</span>
        <span>600</span>
      </div>
    </div>
  )
}

