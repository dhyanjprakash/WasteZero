import Logo from "@/assets/Logo.png"
function BrandPanel() {
  return (
    <div className="hidden bg-[#8DC548] text-white md:flex md:flex-col md:justify-center md:p-12 md:rounded-r-3xl">
      <div className="mx-auto flex max-w-xs flex-col items-center text-center">
        <img
          src={Logo}
          alt="ZeroWaste logo"
          className="mb-6 size-28 rounded-full shadow"
        />
        <h2 className="text-pretty text-3xl font-semibold leading-snug">Welcome back to WasteZero!</h2>
        <p className="mt-3 text-sm leading-6 text-white/90">Smart Waste Pickup & Recycling Platform</p>
      </div>
    </div>
  )
}

export default BrandPanel
