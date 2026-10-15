import React, { useState } from 'react'
import {
  SNOWBOARDS_LIST,
  RIDERS_LIST,
  MILOSPORT_PHOTOS,
  TIRE_OPTIONS_LIST,
  WAX_FORMULAS_LIST,
  type MilosportPhoto,
  type VehicleTireOption
} from '../../data/snowboardGear'
import {
  Sparkles,
  MapPin,
  Camera,
  Check,
  Zap,
  Volume2,
  Car,
  ChevronRight,
  Info,
  Layers,
  Flame,
  Ticket,
  AlertTriangle,
  Waves
} from 'lucide-react'
import { WaxBenchMiniGame } from './WaxBenchMiniGame'
import { DiscountPassDesk } from './DiscountPassDesk'
import { useOceanBuoyFeed } from '../../utils/oceanBuoyFeed'

interface Props {
  selectedBoardId: string;
  selectedRiderId: string;
  tireOptionId: string;
  purchasedPassIds: string[];
  waxScore: number;
  waxFormulaId: string;
  waxSpeedMultiplier: number;
  prayersCount: number;
  onSelectBoard: (boardId: string) => void;
  onSelectRider: (riderId: string) => void;
  onSelectTire: (tireId: string) => void;
  onBuyPass: (passId: string) => void;
  onApplyWaxTune: (formulaId: string, speedMultiplier: number, score: number) => void;
  onLaunchDrive: () => void;
  onGoToSwig?: () => void;
  onGoToWhale?: () => void;
  onGoTo711?: () => void;
  onGoToX96?: () => void;
}

export const MilosportShopScreen: React.FC<Props> = ({
  selectedBoardId,
  selectedRiderId,
  tireOptionId,
  purchasedPassIds,
  waxScore,
  waxFormulaId,
  waxSpeedMultiplier,
  prayersCount,
  onSelectBoard,
  onSelectRider,
  onSelectTire,
  onBuyPass,
  onApplyWaxTune,
  onLaunchDrive,
  onGoToSwig,
  onGoToWhale,
  onGoTo711,
  onGoToX96
}) => {
  const buoy = useOceanBuoyFeed()
  const [activeTab, setActiveTab] = useState<'gear' | 'riders' | 'wax' | 'passes' | 'gallery' | 'rig'>('gear')
  const [boardBrandFilter, setBoardBrandFilter] = useState<string>('all')
  const [riderCategoryFilter, setRiderCategoryFilter] = useState<string>('all')
  const [activePhoto, setActivePhoto] = useState<MilosportPhoto>(MILOSPORT_PHOTOS[0])
  const [lightboxPhoto, setLightboxPhoto] = useState<MilosportPhoto | null>(null)

  const selectedBoard = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0]
  const selectedRider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0]
  const selectedTire: VehicleTireOption = TIRE_OPTIONS_LIST.find(t => t.id === tireOptionId) || TIRE_OPTIONS_LIST[1]
  const activeWax = WAX_FORMULAS_LIST.find(w => w.id === waxFormulaId) || WAX_FORMULAS_LIST[0]

  const filteredBoards = boardBrandFilter === 'all'
    ? SNOWBOARDS_LIST
    : boardBrandFilter === 'surfboard' || boardBrandFilter === 'boogie'
    ? SNOWBOARDS_LIST.filter(b => b.craftType === boardBrandFilter)
    : SNOWBOARDS_LIST.filter(b => b.brand.toLowerCase() === boardBrandFilter.toLowerCase())

  const filteredRiders = riderCategoryFilter === 'all'
    ? RIDERS_LIST
    : RIDERS_LIST.filter(r => r.category === riderCategoryFilter)

  return (
    <div className="relative w-full h-full min-h-screen bg-[#041824] text-slate-100 flex flex-col font-sans select-none overflow-y-auto">
      {/* BACKGROUND OCEAN GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/35 via-[#041824] to-[#020c14] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-10 bg-slate-900/90 border-b border-cyan-800/50 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 border border-cyan-300 flex items-center justify-center font-black text-xl text-slate-950 shadow-glow-ice">
            🌊
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sm sm:text-lg font-black tracking-wider text-white uppercase flex items-center gap-2">
                SURF &amp; PADDLE<span className="hidden sm:inline">&nbsp;&bull; LAGUNA BEACH</span>
              </h1>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950 border border-amber-500 text-amber-300 font-bold">
                BY THE TACO STAND 🌮
              </span>
              <span
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-500/70 text-cyan-200 font-bold"
                title={`${buoy.stationId}: ${buoy.stationName}`}
              >
                <Waves className="w-3 h-3 text-cyan-400" />
                <span>
                  {buoy.stationId}: {buoy.waveHeightFt}–{buoy.waveMaxFt}ft @ {buoy.swellPeriodSec}s {buoy.swellCompass} &bull; {buoy.waterTempF}°F &bull; Tide {buoy.tideStage}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-cyan-200/80 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span className="truncate">699 S Coast Hwy, Laguna Beach<span className="hidden sm:inline"> &bull; Surfboards, Boogie Boards &amp; Al Pastor Next Door</span></span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto w-full lg:w-auto max-w-full *:shrink-0 max-sm:*:py-2">
          <button
            onClick={() => setActiveTab('gear')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gear'
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Surf / Boogie Board</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'riders'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Pro Surfer</span>
          </button>

          <button
            onClick={() => setActiveTab('wax')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wax'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>3. Sticky Bumps Wax</span>
            {waxScore > 0 && <span className="text-[10px] text-emerald-400">✓</span>}
          </button>

          <button
            onClick={() => setActiveTab('passes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'passes'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>4. Beach &amp; WSL Passes ({purchasedPassIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-teal-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Coast Spots</span>
          </button>

          <button
            onClick={() => setActiveTab('rig')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rig'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>PCH Surf Rig</span>
          </button>
        </div>
      </header>

      {/* QUICK PREVIEW BANNER */}
      <div className="relative z-10 bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{selectedBoard.craftType === 'boogie' ? 'BOOGIE:' : 'SURFBOARD:'}</span>
            <span
              className="px-2 py-0.5 rounded font-bold text-white border"
              style={{
                backgroundColor: `${selectedBoard.accentColor}25`,
                borderColor: selectedBoard.accentColor
              }}
            >
              {selectedBoard.craftType === 'boogie' ? '🌊 ' : '🏄 '}
              {selectedBoard.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">SHOTGUN PRO:</span>
            <span
              className="px-2 py-0.5 rounded font-bold text-white border flex items-center gap-1.5"
              style={{
                backgroundColor: `${selectedRider.accentColor}25`,
                borderColor: selectedRider.accentColor
              }}
            >
              <span>{selectedRider.iconEmoji}</span>
              <span>{selectedRider.name} &bull; {selectedRider.nickname}</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">RACKS:</span>
            <span className={`px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
              selectedTire.udotApproved
                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                : 'bg-rose-950/60 border-rose-600 text-rose-300'
            }`}>
              {selectedTire.udotApproved ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>{selectedTire.name.split(' ')[0]} {selectedTire.name.split(' ')[1]}</span>
            </span>
          </div>

          {waxScore > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-600">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{activeWax.name.split(' ')[0]}: +{Math.round((waxSpeedMultiplier - 1) * 100)}% Grip &amp; Speed</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {onGoToSwig && (
            <button
              onClick={onGoToSwig}
              className="px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-500 text-amber-200 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all text-xs"
              title="Order Al Pastor Tacos & California Burritos next door at The Taco Stand Laguna Beach!"
            >
              <span>🌮 The Taco Stand</span>
            </button>
          )}

          {onGoToWhale && (
            <button
              onClick={onGoToWhale}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all text-xs"
              title="Visit the Laguna Wyland Whaling Wall & Dolphin Shrine for a 6-8ft SSW Swell Blessing"
            >
              <span>🐬 Dolphin Swell Shrine</span>
            </button>
          )}

          {onGoTo711 && (
            <button
              onClick={onGoTo711}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-emerald-200 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all text-xs"
              title="Stop at PCH Surf Gas & Ice Chest for Fuel, Zinc Sunscreen & Açaí Bowls"
            >
              <span>⛽ PCH Gas &amp; Zinc</span>
            </button>
          )}

          {onGoToX96 && (
            <button
              onClick={onGoToX96}
              className="px-3 py-1.5 rounded-xl bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500 text-yellow-200 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all text-xs"
              title="Hit the KROQ / Surfline Broadcast Booth for Kook of the Day & Free WSL Finals Passes"
            >
              <span>📻 KROQ / Surfline</span>
            </button>
          )}

          <button
            onClick={onLaunchDrive}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black tracking-wide flex items-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>CRUISE PCH TO SAN CLEMENTE &amp; TRESTLES</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: SURFBOARD & BOOGIE BOARD SELECTOR */}
        {activeTab === 'gear' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
                  <Waves className="w-6 h-6 text-cyan-400" />
                  <span>Pick Your Surfboard or Boogie Board</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Inside <strong>Surf &amp; Paddle Laguna Beach</strong> (right next to The Taco Stand): Choose a high-performance <strong>Surfboard</strong> or a barrel-slaying <strong>Boogie Board / Bodyboard</strong>!
                </p>
              </div>

              {/* Craft & Brand Filters */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {[
                  { id: 'all', label: 'All Quiver (10)' },
                  { id: 'surfboard', label: '🏄 Surfboards' },
                  { id: 'boogie', label: '🌊 Boogie Boards' },
                  { id: 'Lost Mayhem', label: 'Lost Mayhem' },
                  { id: 'Channel Islands', label: 'Channel Islands' },
                  { id: 'Catch Surf', label: 'Catch Surf' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setBoardBrandFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      boardBrandFilter === f.id
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Boards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoards.map(board => {
                const isSelected = board.id === selectedBoardId
                const isBoogie = board.craftType === 'boogie'
                return (
                  <div
                    key={board.id}
                    onClick={() => onSelectBoard(board.id)}
                    className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all cursor-pointer bg-slate-900/80 backdrop-blur-sm ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-glow-ice scale-[1.01]'
                        : 'border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>STRAPPED ON ROOF</span>
                      </div>
                    )}

                    <div>
                      {/* Brand & Craft Type Badge */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase"
                          style={{
                            backgroundColor: `${board.accentColor}25`,
                            color: board.accentColor,
                            border: `1px solid ${board.accentColor}50`
                          }}
                        >
                          {isBoogie ? '🌊 BOOGIE BOARD' : '🏄 SURFBOARD'} &bull; {board.brand}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 font-bold">
                          {board.badge}
                        </span>
                      </div>

                      {/* Board Name */}
                      <h3 className="text-lg font-bold text-white mb-1">
                        {board.name}
                      </h3>
                      <div className="text-xs font-mono text-cyan-300 mb-3">
                        {board.dimensionsLabel} &bull; {board.camber}
                      </div>

                      {/* Surfboard vs Boogie Board Silhouette */}
                      <div className="relative w-full h-24 my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                        {isBoogie ? (
                          /* Boogie Board Silhouette (Wide nose, crescent tail, swimfins icon) */
                          <div
                            className="relative w-3/5 h-14 rounded-l-2xl rounded-r-lg border-2 flex items-center justify-between px-4 transition-all shadow-lg"
                            style={{
                              backgroundColor: board.topGraphicColor,
                              borderColor: board.accentColor
                            }}
                          >
                            <div className="w-2 h-8 rounded-full bg-white/30" />
                            <span
                              className="font-black text-xs tracking-widest uppercase truncate"
                              style={{ color: board.accentColor }}
                            >
                              BOOGIE • {board.lengthCm}&quot;
                            </span>
                            <div className="w-3 h-10 border-r-4 border-white/40 rounded-r" />
                          </div>
                        ) : (
                          /* Surfboard Pointed Nose + Stringer + Swallow/Squash Tail Silhouette */
                          <div
                            className="relative w-4/5 h-12 rounded-l-full rounded-r-2xl border-2 flex items-center justify-between px-4 transition-all shadow-lg"
                            style={{
                              backgroundColor: board.topGraphicColor,
                              borderColor: board.accentColor
                            }}
                          >
                            {/* Center wood stringer line */}
                            <div className="absolute inset-x-0 top-1/2 h-[1.5px] bg-amber-200/40 pointer-events-none" />
                            <div className="w-2 h-2 rounded-full bg-white/30 z-10" />
                            <span
                              className="font-black text-xs tracking-widest uppercase truncate max-w-[160px] z-10"
                              style={{ color: board.accentColor }}
                            >
                              {board.brand}
                            </span>
                            {/* Tail traction pad + fins */}
                            <div className="w-5 h-7 rounded bg-slate-950/80 border border-white/20 z-10" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                        {board.description}
                      </p>

                      {/* Stats bars */}
                      <div className="space-y-1.5 text-[11px] font-mono mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">DOWN-THE-LINE SPEED:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-300 mr-1">{board.flex}/10</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400"
                                style={{ width: `${board.flex * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{isBoogie ? 'EL ROLLO / ARS POP:' : 'AIR & LIP SNAP:'}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-300 mr-1">{board.pop}/10</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-400"
                                style={{ width: `${board.pop * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">BARREL &amp; PADDLE FLOAT:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-300 mr-1">{board.float}/10</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-400"
                                style={{ width: `${board.float * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perk description */}
                      <div className="flex items-start gap-1.5 text-xs text-amber-300/90 font-mono bg-amber-950/20 border border-amber-800/40 p-2 rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{board.perkDescription}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectBoard(board.id)
                      }}
                      className={`w-full mt-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected
                        ? `ACTIVE ${isBoogie ? 'BOOGIE BOARD' : 'SURFBOARD'} ON ROOF`
                        : `PICK THIS ${isBoogie ? 'BOOGIE BOARD' : 'SURFBOARD'}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PRO SURFER / BOOGIE BUDDY SELECTOR */}
        {activeTab === 'riders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  Select Your Pro Surfer or Boogie Legend
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Who’s riding shotgun from The Taco Stand in Laguna Beach down PCH to Dana Point, San Clemente Pier &amp; the WSL Finals at Trestles?
                </p>
              </div>

              {/* Rider Category Filter */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {[
                  { id: 'all', label: 'All Pros (13)' },
                  { id: 'forum', label: 'San Clemente 2% Crew' },
                  { id: 'burton', label: 'WSL World Champs' },
                  { id: 'thirtytwo', label: 'Laguna & Boogie Legends' },
                  { id: 'local_kids', label: 'OC Local Groms & Crew' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setRiderCategoryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      riderCategoryFilter === f.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Riders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRiders.map(rider => {
                const isSelected = rider.id === selectedRiderId
                return (
                  <div
                    key={rider.id}
                    onClick={() => onSelectRider(rider.id)}
                    className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all cursor-pointer bg-slate-900/80 backdrop-blur-sm ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-glow-ice scale-[1.01]'
                        : 'border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>RIDING SHOTGUN</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2"
                          style={{
                            backgroundColor: `${rider.avatarColor}25`,
                            borderColor: rider.accentColor
                          }}
                        >
                          {rider.iconEmoji}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase"
                              style={{
                                backgroundColor: `${rider.accentColor}20`,
                                color: rider.accentColor
                              }}
                            >
                              {rider.categoryLabel}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {rider.name}
                          </h3>
                          <div className="text-xs font-mono text-emerald-400">
                            &ldquo;{rider.nickname}&rdquo;
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                        <div className="truncate">
                          SPONSOR: <span className="text-slate-200">{rider.sponsor}</span>
                        </div>
                        <div>&bull;</div>
                        <div className="shrink-0">
                          STANCE: <span className="text-cyan-400">{rider.stance}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{rider.hometown}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          <strong className="text-slate-300">SIGNATURE MOVE:</strong> {rider.favoriteTrick}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mb-4 line-clamp-3">
                        {rider.bio}
                      </p>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-emerald-400" />
                          <span>At Surf &amp; Paddle / Taco Stand:</span>
                        </div>
                        <p className="text-emerald-300 italic">
                          &ldquo;{rider.dialogue.atShop}&rdquo;
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectRider(rider.id)
                      }}
                      className={`w-full py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'SHOTGUN LOCKED IN' : 'CHOOSE AS SURF BUDDY'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SURF WAX BENCH MINI-GAME */}
        {activeTab === 'wax' && (
          <WaxBenchMiniGame
            selectedBoardId={selectedBoardId}
            onApplyWaxTune={onApplyWaxTune}
            onClose={() => setActiveTab('gear')}
          />
        )}

        {/* TAB 4: BEACH & WSL PASSES DESK */}
        {activeTab === 'passes' && (
          <DiscountPassDesk
            purchasedPassIds={purchasedPassIds}
            prayersCount={prayersCount}
            onBuyPass={onBuyPass}
          />
        )}

        {/* TAB 5: COASTAL SPOTS & SHOP ARCHIVES */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                Orange County Coastline: Laguna Beach to Lower Trestles
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Surf &amp; Paddle Laguna Beach, The Taco Stand, Treasure Island by the Montage, 1000 Steps Beach, Dana Point, San Clemente Pier, and the WSL Finals at Trestles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div
                  onClick={() => setLightboxPhoto(activePhoto)}
                  className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video max-h-[480px] cursor-zoom-in shadow-2xl"
                >
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-[10px] font-black uppercase mb-1.5 inline-block">
                      {activePhoto.categoryLabel}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {activePhoto.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                      {activePhoto.caption}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 font-mono flex items-start gap-3">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">South Coast Local Lore:</strong>
                    {activePhoto.lore}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Select Spot ({MILOSPORT_PHOTOS.length})
                </h4>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {MILOSPORT_PHOTOS.map(photo => {
                    const isPhotoActive = photo.id === activePhoto.id
                    return (
                      <div
                        key={photo.id}
                        onClick={() => setActivePhoto(photo)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isPhotoActive
                            ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {photo.title}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 truncate">
                            {photo.categoryLabel}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: THE PCH SURF RIG & ROOF RACKS */}
        {activeTab === 'rig' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                The PCH Coastal Surf Rig &amp; Roof Racks
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                1996 Pacific Coast Woody Cruiser &bull; Parked outside Surf &amp; Paddle &amp; The Taco Stand at 699 S Coast Hwy, Laguna Beach.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-cyan-300">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">1996 South Coast Surf Wagon</h3>
                    <div className="text-xs font-mono text-cyan-400">Roof Surf Racks &bull; Super73 Hitch Carrier</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">ORIGIN:</span>
                    <span className="text-emerald-400 font-bold">Surf &amp; Paddle + Taco Stand (Laguna)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">SCENIC STOPS:</span>
                    <span className="text-amber-300 font-bold">Treasure Island Montage &amp; 1000 Steps</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">BREAKS AHEAD:</span>
                    <span className="text-cyan-400 font-bold">Dana Point &bull; SC Pier &bull; Trestles WSL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">MOUNTED BOARD:</span>
                    <span className="text-white font-bold">{selectedBoard.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">SHOTGUN PRO:</span>
                    <span className="text-emerald-300 font-bold">{selectedRider.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Passenger PCH Departure Hype:</span>
                  </div>
                  <p className="text-sm font-mono text-emerald-300 italic">
                    &ldquo;{selectedRider.dialogue.leavingShop}&rdquo;
                  </p>
                </div>

                {/* ROOF RACK & TIRE SELECTOR */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Select Roof Rack &amp; E-Bike Setup (CHP &amp; State Beach Inspection at Mile 1.0):
                  </h4>
                  <div className="space-y-2">
                    {TIRE_OPTIONS_LIST.map(tire => {
                      const isTireSelected = tire.id === tireOptionId
                      return (
                        <div
                          key={tire.id}
                          onClick={() => onSelectTire(tire.id)}
                          className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all flex items-center justify-between ${
                            isTireSelected
                              ? 'bg-slate-800 border-cyan-400 text-white'
                              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{tire.name}</span>
                              {tire.udotApproved ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  CHP APPROVED
                                </span>
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700">
                                  SKETCHY STRAP!
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{tire.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={lightboxPhoto.imageUrl}
              alt={lightboxPhoto.title}
              className="w-full max-h-[70vh] object-cover"
            />
            <div className="p-5 font-mono">
              <h3 className="text-lg font-black text-white">{lightboxPhoto.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{lightboxPhoto.caption}</p>
              <p className="text-xs text-cyan-300 mt-2">{lightboxPhoto.lore}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
