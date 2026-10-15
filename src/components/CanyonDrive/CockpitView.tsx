import React, { useRef, useEffect } from 'react'
import { CanyonRoute } from '../../utils/canyonRoute'
import type { PlayerCarState } from '../../types/game'
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear'

interface Props {
  carState: PlayerCarState;
}

export const CockpitView: React.FC<Props> = ({ carState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wiperAngleRef = useRef<number>(0)
  const wiperDirectionRef = useRef<number>(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      const horizonY = height * 0.42

      // 1. Golden-Hour Orange County Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY)
      skyGrad.addColorStop(0, '#0284c7')
      skyGrad.addColorStop(0.55, '#38bdf8')
      skyGrad.addColorStop(0.85, '#fde047')
      skyGrad.addColorStop(1, '#fb923c')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, horizonY)

      // Golden Sun over the Pacific (right side)
      const sunX = width * 0.78
      const sunY = horizonY - 52
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 95)
      sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)')
      sunGlow.addColorStop(0.4, 'rgba(251, 146, 60, 0.45)')
      sunGlow.addColorStop(1, 'rgba(251, 146, 60, 0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(sunX, sunY, 95, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fef08a'
      ctx.beginPath()
      ctx.arc(sunX, sunY, 26, 0, Math.PI * 2)
      ctx.fill()

      // 2. Left Horizon: Laguna & Dana Point Headlands Bluffs; Right Horizon: Catalina Island Silhouette
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(0, horizonY - 65)
      ctx.lineTo(140, horizonY - 80)
      ctx.lineTo(290, horizonY - 45)
      ctx.lineTo(430, horizonY - 25)
      ctx.lineTo(480, horizonY)
      ctx.closePath()
      ctx.fillStyle = '#78350f'
      ctx.fill()

      // Catalina Island on right ocean horizon
      ctx.beginPath()
      ctx.moveTo(680, horizonY)
      ctx.lineTo(720, horizonY - 18)
      ctx.lineTo(790, horizonY - 24)
      ctx.lineTo(850, horizonY - 12)
      ctx.lineTo(890, horizonY)
      ctx.closePath()
      ctx.fillStyle = '#0369a1'
      ctx.fill()

      // 3. Perspective Road Ahead (Pacific Coast Highway CA-1)
      const currentMile = carState.distanceMiles
      const curve = CanyonRoute.getRoadCurvature(currentMile)
      const steeringOffset = carState.steering * 80

      const roadVanishingX = width / 2 + curve * 180 - steeringOffset * 0.5
      const roadVanishingY = horizonY
      const roadVanishingWidth = 44

      const roadBottomLeftX = width * 0.14 - steeringOffset
      const roadBottomRightX = width * 0.84 - steeringOffset
      const roadBottomY = height * 0.78

      // Left roadside: Sandstone coastal bluffs & iceplant
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(roadVanishingX - roadVanishingWidth / 2, roadVanishingY)
      ctx.lineTo(roadBottomLeftX, roadBottomY)
      ctx.lineTo(0, roadBottomY)
      ctx.closePath()
      ctx.fillStyle = '#d97706'
      ctx.fill()

      // Right roadside: Sandy beach + Turquoise Pacific Ocean!
      ctx.beginPath()
      ctx.moveTo(width, horizonY)
      ctx.lineTo(roadVanishingX + roadVanishingWidth / 2, roadVanishingY)
      ctx.lineTo(roadBottomRightX, roadBottomY)
      ctx.lineTo(width, roadBottomY)
      ctx.closePath()
      const oceanGrad = ctx.createLinearGradient(width * 0.5, horizonY, width, roadBottomY)
      oceanGrad.addColorStop(0, '#0284c7')
      oceanGrad.addColorStop(0.55, '#06b6d4')
      oceanGrad.addColorStop(0.82, '#67e8f9')
      oceanGrad.addColorStop(1, '#fde68a')
      ctx.fillStyle = oceanGrad
      ctx.fill()

      // Animated whitewater wave lines rolling onto the beach on the right
      const wavePhase = (Date.now() * 0.0012) % 1
      for (let w = 0; w < 4; w++) {
        const wt = ((w / 4) + wavePhase) % 1
        const wy = horizonY + 18 + wt * (roadBottomY - horizonY - 30)
        const wxStart = roadVanishingX + roadVanishingWidth / 2 + wt * (roadBottomRightX - (roadVanishingX + roadVanishingWidth / 2)) + 18
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.lineWidth = 2 + wt * 3
        ctx.beginPath()
        ctx.moveTo(wxStart, wy)
        ctx.lineTo(width - 10, wy - 8)
        ctx.stroke()
      }

      // PCH Asphalt Surface
      ctx.beginPath()
      ctx.moveTo(roadVanishingX - roadVanishingWidth / 2, roadVanishingY)
      ctx.lineTo(roadVanishingX + roadVanishingWidth / 2, roadVanishingY)
      ctx.lineTo(roadBottomRightX, roadBottomY)
      ctx.lineTo(roadBottomLeftX, roadBottomY)
      ctx.closePath()
      ctx.fillStyle = '#1e293b'
      ctx.fill()

      // Center dividing yellow PCH stripes in perspective
      const stripeOffset = (Date.now() * 0.05 * (carState.speed / 20)) % 1
      for (let i = 0; i < 9; i++) {
        const t1 = Math.pow((i + stripeOffset) / 9, 2)
        const t2 = Math.pow((i + stripeOffset + 0.4) / 9, 2)
        if (t1 > 1 || t2 > 1) continue

        const y1 = roadVanishingY + (roadBottomY - roadVanishingY) * t1
        const y2 = roadVanishingY + (roadBottomY - roadVanishingY) * t2
        const x1 = roadVanishingX + ((width / 2 - steeringOffset) - roadVanishingX) * t1
        const x2 = roadVanishingX + ((width / 2 - steeringOffset) - roadVanishingX) * t2
        const w = 2 + t1 * 6

        ctx.beginPath()
        ctx.moveTo(x1 - w / 2, y1)
        ctx.lineTo(x1 + w / 2, y1)
        ctx.lineTo(x2 + w / 2, y2)
        ctx.lineTo(x2 - w / 2, y2)
        ctx.closePath()
        ctx.fillStyle = '#facc15'
        ctx.fill()
      }

      // Swaying California Palm Trees along PCH
      for (let p = 0; p < 5; p++) {
        const pt = ((p / 5) + (Date.now() * 0.0004 * (1 + carState.speed / 35))) % 1
        const py = roadVanishingY + (roadBottomY - roadVanishingY) * (pt * pt)
        const pxRight = roadVanishingX + (roadBottomRightX - roadVanishingX) * (pt * pt) + 12 + pt * 45
        const palmScale = 0.25 + pt * 0.9
        drawCockpitPalmTree(ctx, pxRight, py, palmScale)
      }

      // 1000 STEPS BEACH CLIFF ARCH PROJECTION (Near Mile 4.5)
      const distToSilentRock = CanyonRoute.SILENT_ROCK_CENTER - currentMile
      if (distToSilentRock >= -0.15 && distToSilentRock <= 0.45) {
        const rockScale = Math.max(0.25, 1 - (distToSilentRock / 0.45))
        const rockScreenX = roadVanishingX - 70 - rockScale * 210
        const rockScreenY = roadVanishingY + (roadBottomY - roadVanishingY) * rockScale
        drawCockpit1000StepsArch(ctx, rockScreenX, rockScreenY, rockScale)
      }

      // 4. Seagulls & Ocean Spray Mist outside windshield
      drawCockpitSeagullsAndSpray(ctx, width, horizonY, roadBottomY, carState.speed)

      // 5. Windshield Wipers (optional sea spray wipe)
      if (carState.wipersActive) {
        wiperAngleRef.current += 0.04 * wiperDirectionRef.current
        if (wiperAngleRef.current > 1.2) wiperDirectionRef.current = -1
        if (wiperAngleRef.current < -0.2) wiperDirectionRef.current = 1
      }

      // 6. RETRO SURF WAGON DASHBOARD FRAME & INSTRUMENT CLUSTER
      drawRetroDashboard(ctx, width, height, carState)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [carState])

  return (
    <div className="relative w-full h-full min-h-[480px] bg-alpine-bg overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={960}
        height={640}
        className="w-full h-full object-cover max-w-full max-h-full"
      />
    </div>
  )
}

function drawCockpitPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // Curved trunk
  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(8, -55, 14, -110)
  ctx.stroke()

  // Fronds
  ctx.strokeStyle = '#15803d'
  ctx.lineWidth = 4
  const frondAngles = [-2.4, -1.8, -1.2, -0.5, 0.2, 0.8]
  for (const angle of frondAngles) {
    ctx.beginPath()
    ctx.moveTo(14, -110)
    ctx.quadraticCurveTo(
      14 + Math.cos(angle) * 28,
      -110 + Math.sin(angle) * 24 - 10,
      14 + Math.cos(angle) * 48,
      -110 + Math.sin(angle) * 32 + 12
    )
    ctx.stroke()
  }

  ctx.restore()
}

function drawCockpit1000StepsArch(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  // Coastal sandstone cliff & stairway entrance
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(60, -170)
  ctx.lineTo(170, -200)
  ctx.lineTo(250, -130)
  ctx.lineTo(260, 0)
  ctx.closePath()
  ctx.fillStyle = '#b45309'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#f59e0b'
  ctx.stroke()

  // 1000 Steps Beach wooden sign
  ctx.fillStyle = '#0284c7'
  ctx.fillRect(90, -110, 120, 38)
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 2
  ctx.strokeRect(90, -110, 120, 38)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('1000 STEPS BEACH', 150, -87)

  ctx.restore()
}

function drawCockpitSeagullsAndSpray(ctx: CanvasRenderingContext2D, width: number, horizonY: number, bottomY: number, speedMph: number) {
  // Gliding seagulls / pelicans in the sky
  ctx.strokeStyle = '#f8fafc'
  ctx.lineWidth = 2
  for (let b = 0; b < 5; b++) {
    const bx = ((Date.now() * 0.03 + b * 190) % (width - 120)) + 60
    const by = 60 + (b % 3) * 42 + Math.sin(Date.now() * 0.004 + b) * 8
    const wingY = Math.sin(Date.now() * 0.01 + b * 2) * 5
    ctx.beginPath()
    ctx.moveTo(bx - 10, by + wingY)
    ctx.quadraticCurveTo(bx - 4, by - 5, bx, by)
    ctx.quadraticCurveTo(bx + 4, by - 5, bx + 10, by + wingY)
    ctx.stroke()
  }

  // Sunlit ocean mist particles
  ctx.fillStyle = 'rgba(224, 242, 254, 0.55)'
  for (let i = 0; i < 24; i++) {
    const t = (Date.now() * 0.0007 * (1 + speedMph / 40) + i * 0.13) % 1
    const y = horizonY + (bottomY - horizonY) * t
    const x = (width * 0.55) + ((i * 73) % (width * 0.42))
    ctx.beginPath()
    ctx.arc(x, y, 1 + t * 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawRetroDashboard(ctx: CanvasRenderingContext2D, width: number, height: number, car: PlayerCarState) {
  ctx.save()

  // Windshield Pillars / Frame
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, 45, height)
  ctx.fillRect(width - 45, 0, 45, height)
  ctx.fillRect(0, 0, width, 35)

  // Rearview Mirror with hanging Sex Wax / Coconut Surf Air Freshener!
  const mirrorX = width / 2
  const mirrorY = 28
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(mirrorX - 80, mirrorY, 160, 36)
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.strokeRect(mirrorX - 80, mirrorY, 160, 36)
  ctx.fillStyle = '#0284c7'
  ctx.fillRect(mirrorX - 76, mirrorY + 4, 152, 28)

  if (car.isPulledOver || car.hasGasDashChase) {
    const strobeSpeed = car.hasGasDashChase ? 75 : 110
    const strobe = Math.floor(Date.now() / strobeSpeed) % 2 === 0
    ctx.fillStyle = strobe ? '#ef4444' : '#3b82f6'
    ctx.fillRect(mirrorX - 74, mirrorY + 6, 72, 24)
    ctx.fillStyle = !strobe ? '#ef4444' : '#3b82f6'
    ctx.fillRect(mirrorX + 2, mirrorY + 6, 72, 24)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(mirrorX - 4, mirrorY + 12, 8, 12)

    const ambientOpacity = car.hasGasDashChase ? 0.14 : 0.08
    ctx.fillStyle = strobe ? `rgba(239, 68, 68, ${ambientOpacity})` : `rgba(59, 130, 246, ${ambientOpacity})`
    ctx.fillRect(0, 0, width, height)
  } else {
    ctx.fillStyle = '#fde047'
    ctx.fillRect(mirrorX - 18, mirrorY + 14, 36, 8)
  }

  // Round Coconut Surf Wax air freshener disc hanging from mirror
  ctx.beginPath()
  ctx.arc(mirrorX, mirrorY + 54, 12, 0, Math.PI * 2)
  ctx.fillStyle = '#f59e0b'
  ctx.fill()
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Main Dashboard lower console
  const dashTopY = height * 0.72
  ctx.beginPath()
  ctx.moveTo(0, height)
  ctx.lineTo(0, dashTopY + 20)
  ctx.lineTo(width * 0.2, dashTopY)
  ctx.lineTo(width * 0.8, dashTopY)
  ctx.lineTo(width, dashTopY + 20)
  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fillStyle = '#0c1322'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#1e293b'
  ctx.stroke()

  // 1. Speedometer (Left dial)
  drawAnalogGauge(
    ctx,
    width * 0.28,
    dashTopY + 80,
    48,
    car.speed,
    0,
    65,
    'PCH MPH',
    '#38bdf8'
  )

  // 2. Swell / Bluff Elevation Gauge (Center-left dial)
  drawAnalogGauge(
    ctx,
    width * 0.42,
    dashTopY + 80,
    48,
    8.5,
    0,
    12,
    'SWELL FT',
    '#22d3ee'
  )

  // 3. Center KROQ 106.7 / Surf Tape Deck
  const radioX = width * 0.58
  const radioY = dashTopY + 45
  ctx.fillStyle = '#090d16'
  ctx.fillRect(radioX - 60, radioY, 120, 68)
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.strokeRect(radioX - 60, radioY, 120, 68)

  ctx.fillStyle = '#020617'
  ctx.fillRect(radioX - 45, radioY + 12, 90, 24)
  ctx.fillStyle = car.radioMuted ? '#f59e0b' : '#10b981'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(car.radioMuted ? '[1000 STEPS: OCEAN]' : `[${car.radioStationLabel || 'KROQ 106.7 FM'}]`, radioX, radioY + 28)

  if (!car.radioMuted && car.radioNowPlaying) {
    const tickerLeft = radioX - 52
    const tickerWidth = 104
    ctx.save()
    ctx.beginPath()
    ctx.rect(tickerLeft, radioY + 42, tickerWidth, 16)
    ctx.clip()
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'left'
    const ticker = `${car.radioNowPlaying.toUpperCase()}   •   `
    const loopWidth = ctx.measureText(ticker).width
    const offset = (performance.now() / 40) % loopWidth
    ctx.fillText(ticker.repeat(Math.ceil(tickerWidth / loopWidth) + 1), tickerLeft - offset, radioY + 53)
    ctx.restore()
  }

  // 4. PCH Mile Marker Digital Display
  const odoX = width * 0.74
  const odoY = dashTopY + 55
  ctx.fillStyle = '#020617'
  ctx.fillRect(odoX - 45, odoY, 90, 48)
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.strokeRect(odoX - 45, odoY, 90, 48)

  ctx.fillStyle = '#38bdf8'
  ctx.font = 'bold 16px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`MI ${car.distanceMiles.toFixed(1)}`, odoX, odoY + 24)
  ctx.font = 'bold 9px monospace'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`PCH CA-1 SOUTH`, odoX, odoY + 40)

  // 5. Passenger Side Glovebox & Surf & Paddle / Taco Stand Decals
  const activeBoard = SNOWBOARDS_LIST.find(b => b.id === car.selectedBoardId) || SNOWBOARDS_LIST[0]
  const activeRider = RIDERS_LIST.find(r => r.id === car.selectedRiderId) || RIDERS_LIST[0]

  const gloveX = width * 0.88
  const gloveY = dashTopY + 50

  ctx.save()
  ctx.translate(gloveX, gloveY - 14)
  ctx.rotate(-0.05)
  ctx.fillStyle = '#0e7490'
  ctx.fillRect(-40, -10, 80, 20)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 1
  ctx.strokeRect(-40, -10, 80, 20)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('SURF & PADDLE LB', 0, 3)
  ctx.restore()

  ctx.save()
  ctx.translate(gloveX, gloveY + 14)
  ctx.rotate(0.04)
  ctx.fillStyle = activeBoard.accentColor
  ctx.fillRect(-36, -9, 72, 18)
  ctx.fillStyle = '#020617'
  ctx.font = '900 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(activeBoard.brand.toUpperCase(), 0, 3)
  ctx.restore()

  ctx.save()
  ctx.translate(gloveX, gloveY + 36)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
  ctx.fillRect(-45, -7, 90, 15)
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  ctx.strokeRect(-45, -7, 90, 15)
  ctx.fillStyle = '#38bdf8'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${activeRider.name.slice(0, 14)}`, 0, 4)
  ctx.restore()

  // Steering wheel top arc
  ctx.beginPath()
  ctx.arc(width * 0.35, height + 80, 160, Math.PI * 1.15, Math.PI * 1.85)
  ctx.lineWidth = 22
  ctx.strokeStyle = '#1e293b'
  ctx.stroke()

  ctx.restore()
}

function drawAnalogGauge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  value: number,
  minVal: number,
  maxVal: number,
  label: string,
  color: string
) {
  ctx.save()
  ctx.translate(x, y)

  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#030712'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#1e293b'
  ctx.stroke()

  for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.15) {
    const tx1 = Math.cos(a) * (radius - 8)
    const ty1 = Math.sin(a) * (radius - 8)
    const tx2 = Math.cos(a) * (radius - 2)
    const ty2 = Math.sin(a) * (radius - 2)
    ctx.beginPath()
    ctx.moveTo(tx1, ty1)
    ctx.lineTo(tx2, ty2)
    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.stroke()
  }

  const normalized = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)))
  const needleAngle = -Math.PI * 0.75 + normalized * (Math.PI * 1.5)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(Math.cos(needleAngle) * (radius - 10), Math.sin(needleAngle) * (radius - 10))
  ctx.lineWidth = 3
  ctx.strokeStyle = '#ef4444'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#f8fafc'
  ctx.fill()

  ctx.fillStyle = color
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(label, 0, radius * 0.55)

  ctx.restore()
}
