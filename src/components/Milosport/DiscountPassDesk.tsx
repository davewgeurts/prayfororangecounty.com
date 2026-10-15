import React, { useState } from 'react'
import { LIFT_PASSES_LIST, type LiftPass } from '../../data/snowboardGear'
import { Ticket, Sparkles, Check, DollarSign, ShieldCheck } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  purchasedPassIds: string[];
  prayersCount: number;
  onBuyPass: (passId: string) => void;
}

export const DiscountPassDesk: React.FC<Props> = ({
  purchasedPassIds,
  prayersCount,
  onBuyPass
}) => {
  const [successPassName, setSuccessPassName] = useState<string | null>(null)

  const handlePurchase = (pass: LiftPass) => {
    onBuyPass(pass.id)
    setSuccessPassName(pass.name)

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: [pass.accentColor, '#06b6d4', '#f59e0b']
      })
    } catch {
      // fallback
    }

    setTimeout(() => setSuccessPassName(null), 3000)
  }

  return (
    <div className="space-y-6 select-none font-mono">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              STATE BEACH PARKING &amp; WSL TRESTLES VIP PASS DESK
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Skip the $25 beach parking meters and get VIP athlete access to Dana Point Doheny, San Clemente Pier, and the WSL Finals at Lower Trestles!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-2xl text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Your Ocean Prayers: <strong className="text-cyan-400">{prayersCount.toLocaleString()}</strong></span>
        </div>
      </div>

      {successPassName && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between shadow-glow-ice animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Pass issued! <strong>{successPassName}</strong> is hanging from your rearview mirror!</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">VIP LINEUP ACCESS</span>
        </div>
      )}

      {/* PASSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LIFT_PASSES_LIST.map(pass => {
          const isPurchased = purchasedPassIds.includes(pass.id)
          const discountPct = Math.round(((pass.priceWindow - pass.priceMilo) / pass.priceWindow) * 100)

          return (
            <div
              key={pass.id}
              className={`relative rounded-3xl border p-5 flex flex-col justify-between transition-all bg-slate-900/80 backdrop-blur-sm ${
                isPurchased
                  ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-glow-ice'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${pass.badgeColor}35`,
                    color: pass.accentColor,
                    border: `1px solid ${pass.accentColor}50`
                  }}
                >
                  {pass.resort} &bull; {discountPct}% OFF
                </span>

                {isPurchased ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 line-through">
                    Gate Rate: ${pass.priceWindow}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {pass.name}
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  {pass.description}
                </p>

                <div className="flex items-baseline gap-2 mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-2xl font-black text-emerald-400 flex items-center">
                    <DollarSign className="w-5 h-5 -mr-1" />
                    {pass.priceMilo}
                  </span>
                  <span className="text-xs text-slate-400">Surf &amp; Paddle Local Rate</span>
                  <span className="text-xs text-slate-500 ml-auto">
                    or {pass.prayersPrice} Prayers
                  </span>
                </div>

                <div className="space-y-1.5 mb-5 text-xs text-slate-300">
                  {pass.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pass)}
                disabled={isPurchased}
                className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPurchased
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-md transform hover:scale-[1.01]'
                }`}
              >
                {isPurchased ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>HANGING ON REARVIEW MIRROR</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>GRAB AT SURF &amp; PADDLE COUNTER (${pass.priceMilo})</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
