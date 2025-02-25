import MapPageComponent from "@/components/screens/MapPageComponent"

export default function Map() {
    
    const sample = "This is the map page. Balendu find a way to put the map page here"

    return (
        <div className="w-full h-screen bg-black text-white font-600 text-[30px] flex flex-col justify-center items-center">
            {sample}
            <br></br>
            You can create a component where you create all the complex stuff there and just render it here as 
            <MapPageComponent />
        </div>
    )
}

