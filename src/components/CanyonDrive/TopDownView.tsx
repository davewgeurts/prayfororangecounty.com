import React, { useRef, useEffect } from 'react'
import { CanyonRoute } from '../../utils/canyonRoute'
import type { PlayerCarState } from '../../types/game'
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear'
import {
  drawGpuOceanCausticsAndSunbeams,
  drawCelShadedPalmTree,
  drawCelShadedUmbrellaAndSunbather,
  drawCelShadedLifeguardTower,
  drawCelShadedDolphin,
  drawCelShadedSeaTurtle,
  drawCelShadedPelican
} from '../../utils/oceanShaderEngine'

interface Props {
  carState: PlayerCarState;
}

interface SeaBird {
  x: number;
  y: number;
  speed: number;
  wingPhase: number;
  drift: number;
}

export const TopDownView: React.FC<Props> = ({ carState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const birdsRef = useRef<SeaBird[]>([])

  useEffect(() => {
    birdsRef.current = Array.from({ length: 18 }, () => ({
      x: Math.random() * 960,
      y: Math.random() * 640,
      speed: 1.2 + Math.random() * 1.8,
      wingPhase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 1.2
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      const timeSec = Date.now() * 0.001

      // Base multi-stop deep Pacific Ocean gradient + WebGPU/GLSL Caustics & Sunbeams
      const baseOcean = ctx.createLinearGradient(0, 0, width, height)
      baseOcean.addColorStop(0, '#082f49')
      baseOcean.addColorStop(0.5, '#0369a1')
      baseOcean.addColorStop(1, '#0891b2')
      ctx.fillStyle = baseOcean
      ctx.fillRect(0, 0, width, height)
      drawGpuOceanCausticsAndSunbeams(ctx, 0, 0, width, height, timeSec)

      ctx.save()

      // Center camera on player's surf wagon
      const centerX = width / 2
      const centerY = height * 0.65

      ctx.translate(centerX, centerY)
      ctx.rotate(-carState.angle)

      const currentMile = carState.distanceMiles
      const currentPos = CanyonRoute.getRoadPosition(currentMile)

      const roadHalfWidth = 55
      const shoulderWidth = 80

      const samplePoints: { x: number; y: number; mile: number }[] = []
      const lookBehind = 0.55
      const lookAhead = 0.95
      const step = 0.02

      for (let m = Math.max(0, currentMile - lookBehind); m <= Math.min(CanyonRoute.TOTAL_MILES, currentMile + lookAhead); m += step) {
        const p = CanyonRoute.getRoadPosition(m)
        samplePoints.push({
          x: p.x - currentPos.x,
          y: p.y - currentPos.y,
          mile: m
        })
      }

      if (samplePoints.length > 2) {
        // 1. LEFT SIDE (EAST): Coastal Sandstone Bluffs & Hills
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x - Math.sin(normAngle) * (roadHalfWidth + 10)
          const sy = pt.y + Math.cos(normAngle) * (roadHalfWidth + 10)
          if (i === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        for (let i = samplePoints.length - 1; i >= 0; i--) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x - Math.sin(normAngle) * 520
          const sy = pt.y + Math.cos(normAngle) * 520
          ctx.lineTo(sx, sy)
        }
        ctx.closePath()
        ctx.fillStyle = '#78350f' // Warm Laguna / San Clemente sandstone bluffs
        ctx.fill()

        // 2. RIGHT SIDE (WEST): Golden Sandy Beach
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x + Math.sin(normAngle) * roadHalfWidth
          const sy = pt.y - Math.cos(normAngle) * roadHalfWidth
          if (i === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        for (let i = samplePoints.length - 1; i >= 0; i--) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x + Math.sin(normAngle) * (shoulderWidth + 95)
          const sy = pt.y - Math.cos(normAngle) * (shoulderWidth + 95)
          ctx.lineTo(sx, sy)
        }
        ctx.closePath()
        ctx.fillStyle = '#fde68a' // Golden OC Beach Sand
        ctx.fill()

        // 3. RIGHT SIDE BEYOND BEACH: Turquoise Shallows & Rolling Whitewater Waves
        const wavePulse = Math.sin(Date.now() * 0.003) * 10
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x + Math.sin(normAngle) * (shoulderWidth + 88 + wavePulse)
          const sy = pt.y - Math.cos(normAngle) * (shoulderWidth + 88 + wavePulse)
          if (i === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.lineWidth = 18
        ctx.strokeStyle = '#67e8f9' // Turquoise shorebreak water
        ctx.stroke()

        // Whitewater foam line
        ctx.lineWidth = 5
        ctx.strokeStyle = '#ffffff'
        ctx.stroke()

        // Second outer reef / pointbreak wave line
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const sx = pt.x + Math.sin(normAngle) * (shoulderWidth + 165 - wavePulse * 0.8)
          const sy = pt.y - Math.cos(normAngle) * (shoulderWidth + 165 - wavePulse * 0.8)
          if (i === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
        ctx.stroke()

        // 4. PCH Asphalt Highway
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const rx = pt.x + Math.sin(normAngle) * roadHalfWidth
          const ry = pt.y - Math.cos(normAngle) * roadHalfWidth
          if (i === 0) ctx.moveTo(rx, ry)
          else ctx.lineTo(rx, ry)
        }
        for (let i = samplePoints.length - 1; i >= 0; i--) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const rx = pt.x - Math.sin(normAngle) * roadHalfWidth
          const ry = pt.y + Math.cos(normAngle) * roadHalfWidth
          ctx.lineTo(rx, ry)
        }
        ctx.closePath()
        ctx.fillStyle = '#1e293b'
        ctx.fill()

        // Center double-yellow PCH line
        ctx.beginPath()
        for (let i = 0; i < samplePoints.length; i++) {
          const pt = samplePoints[i]
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.lineWidth = 3
        ctx.strokeStyle = '#eab308'
        ctx.setLineDash([12, 10])
        ctx.stroke()
        ctx.setLineDash([])

        // White bike-lane / shoulder lines
        for (const side of [1, -1]) {
          ctx.beginPath()
          for (let i = 0; i < samplePoints.length; i++) {
            const pt = samplePoints[i]
            const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
            const rx = pt.x + side * Math.sin(normAngle) * (roadHalfWidth - 3)
            const ry = pt.y - side * Math.cos(normAngle) * (roadHalfWidth - 3)
            if (i === 0) ctx.moveTo(rx, ry)
            else ctx.lineTo(rx, ry)
          }
          ctx.lineWidth = 2
          ctx.strokeStyle = '#f8fafc'
          ctx.stroke()
        }

        // 5. Render Palm Trees, Beach Umbrellas, Sunbathers, Kids, Lifeguard Towers, Turtles & Dolphins!
        for (let i = 0; i < samplePoints.length; i += 3) {
          const pt = samplePoints[i]
          const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2
          const seed = Math.round(pt.mile * 50)

          // Left bluff palm tree
          const lx = pt.x - Math.sin(normAngle) * (roadHalfWidth + 28)
          const ly = pt.y + Math.cos(normAngle) * (roadHalfWidth + 28)
          drawPalmTree(ctx, lx, ly, 16)

          // Right beach palm tree near bike path
          if (seed % 2 === 0) {
            const rpx = pt.x + Math.sin(normAngle) * (roadHalfWidth + 22)
            const rpy = pt.y - Math.cos(normAngle) * (roadHalfWidth + 22)
            drawPalmTree(ctx, rpx, rpy, 14)
          }

          // Beach Sunbathers on Towels & Colorful Umbrellas on the sand!
          const bx = pt.x + Math.sin(normAngle) * (roadHalfWidth + 58 + (seed % 3) * 10)
          const by = pt.y - Math.cos(normAngle) * (roadHalfWidth + 58 + (seed % 3) * 10)
          drawBeachUmbrellaAndSunbather(ctx, bx, by, seed)

          // Kids playing in the shallow water & seashells on the sand
          if (seed % 3 === 0) {
            const kx = pt.x + Math.sin(normAngle) * (shoulderWidth + 82)
            const ky = pt.y - Math.cos(normAngle) * (shoulderWidth + 82)
            drawKidsAndSeashells(ctx, kx, ky, seed)
          }

          // California Lifeguard Tower every ~0.35 miles
          if (seed % 9 === 0) {
            const lgx = pt.x + Math.sin(normAngle) * (roadHalfWidth + 75)
            const lgy = pt.y - Math.cos(normAngle) * (roadHalfWidth + 75)
            drawLifeguardTower(ctx, lgx, lgy)
          }

          // Ocean Wildlife: Dolphins, Sea Turtles & Local Surfers in the Pacific!
          if (seed % 4 === 0) {
            const ox = pt.x + Math.sin(normAngle) * (shoulderWidth + 145 + (seed % 5) * 18)
            const oy = pt.y - Math.cos(normAngle) * (shoulderWidth + 145 + (seed % 5) * 18)
            drawOceanWildlifeAndSurfers(ctx, ox, oy, seed)
          }
        }

        // 6. LANDMARK 1: SURF & PADDLE LAGUNA BEACH + THE TACO STAND (Mile 0.0)
        if (currentMile < 0.7) {
          const lotPos = CanyonRoute.getRoadPosition(0.0)
          const lx = lotPos.x - currentPos.x
          const ly = lotPos.y - currentPos.y
          const lotNorm = lotPos.angle + Math.PI / 2
          const lotX = lx - Math.sin(lotNorm) * (roadHalfWidth + 95)
          const lotY = ly + Math.cos(lotNorm) * (roadHalfWidth + 95)
          drawSurfAndPaddleAndTacoStandLot(ctx, lotX, lotY)
        }

        // 7. LANDMARK 2: TREASURE ISLAND BEACH BY THE MONTAGE (Mile 3.2)
        if (Math.abs(currentMile - 3.2) < 0.85) {
          const tiPos = CanyonRoute.getRoadPosition(3.2)
          const tx = tiPos.x - currentPos.x
          const ty = tiPos.y - currentPos.y
          const tiNorm = tiPos.angle + Math.PI / 2
          const archX = tx + Math.sin(tiNorm) * (roadHalfWidth + 55)
          const archY = ty - Math.cos(tiNorm) * (roadHalfWidth + 55)
          drawTreasureIslandMontage(ctx, archX, archY)
        }

        // 8. LANDMARK 3: 1000 STEPS BEACH CLIFF OVERLOOK (Mile 4.5)
        if (Math.abs(currentMile - CanyonRoute.SILENT_ROCK_CENTER) < 0.95) {
          const rockPos = CanyonRoute.getRoadPosition(CanyonRoute.SILENT_ROCK_CENTER)
          const rx = rockPos.x - currentPos.x
          const ry = rockPos.y - currentPos.y
          const rockNorm = rockPos.angle + Math.PI / 2
          const rockX = rx - Math.sin(rockNorm) * (roadHalfWidth + 45)
          const rockY = ry + Math.cos(rockNorm) * (roadHalfWidth + 45)
          draw1000StepsLandmark(ctx, rockX, rockY)
        }

        // 9. LANDMARK 4: DANA POINT HARBOR & DOHENY (Mile 9.5)
        if (Math.abs(currentMile - 9.5) < 0.95) {
          const dpPos = CanyonRoute.getRoadPosition(9.5)
          const dx = dpPos.x - currentPos.x
          const dy = dpPos.y - currentPos.y
          const dpNorm = dpPos.angle + Math.PI / 2
          const harborX = dx + Math.sin(dpNorm) * (roadHalfWidth + 110)
          const harborY = dy - Math.cos(dpNorm) * (roadHalfWidth + 110)
          drawDanaPointHarbor(ctx, harborX, harborY)
        }

        // 10. LANDMARK 5: SAN CLEMENTE PIER (Mile 13.5)
        if (Math.abs(currentMile - 13.5) < 1.0) {
          const scPos = CanyonRoute.getRoadPosition(13.5)
          const sx = scPos.x - currentPos.x
          const sy = scPos.y - currentPos.y
          const scNorm = scPos.angle + Math.PI / 2
          const pierX = sx + Math.sin(scNorm) * (roadHalfWidth + 45)
          const pierY = sy - Math.cos(scNorm) * (roadHalfWidth + 45)
          drawSanClementePier(ctx, pierX, pierY, scNorm)
        }

        // 11. LANDMARK 6: LOWER TRESTLES WSL FINALS ARENA (Mile 16.5)
        if (Math.abs(currentMile - 16.5) < 1.1) {
          const trPos = CanyonRoute.getRoadPosition(16.4)
          const tx = trPos.x - currentPos.x
          const ty = trPos.y - currentPos.y
          const trNorm = trPos.angle + Math.PI / 2
          const arenaX = tx + Math.sin(trNorm) * (roadHalfWidth + 85)
          const arenaY = ty - Math.cos(trNorm) * (roadHalfWidth + 85)
          drawTrestlesWslArena(ctx, arenaX, arenaY)
        }
      }

      // 12. RENDER PLAYER'S SURF WAGON (Center of view, with Surfboard or Boogie Board on Roof!)
      drawCar(ctx, 0, 0, carState)

      // 13. IF PULLED OVER OR PURSUIT: RENDER CHP CRUISER BEHIND
      if (carState.isPulledOver) {
        drawPoliceCruiser(ctx, 0, 82)
      } else if (carState.hasGasDashChase) {
        const wobble = Math.sin(Date.now() / 140) * 16
        drawPoliceCruiser(ctx, wobble, 96)
      }

      ctx.restore()

      // 14. Foreground Seagulls & Pelicans gliding over the coast
      renderSeagulls(ctx, width, height, birdsRef.current)

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

function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  drawCelShadedPalmTree(ctx, x, y, radius, Date.now() * 0.001)
}

function drawBeachUmbrellaAndSunbather(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  drawCelShadedUmbrellaAndSunbather(ctx, x, y, seed)
}

function drawKidsAndSeashells(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(seed % 2 === 0 ? '🐚' : '🏖️', -8, 0)
  ctx.fillText('🧒', 8, 4)
  ctx.restore()
}

function drawLifeguardTower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawCelShadedLifeguardTower(ctx, x, y)
}

function drawOceanWildlifeAndSurfers(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  const timeSec = Date.now() * 0.001
  if (seed % 2 === 0) {
    drawCelShadedDolphin(ctx, x, y, timeSec, seed)
  } else {
    drawCelShadedSeaTurtle(ctx, x, y, timeSec, seed)
  }
}

function drawSurfAndPaddleAndTacoStandLot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Shared Laguna Beach Parking Lot
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.roundRect(-115, -75, 230, 155, 8)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 2
  ctx.stroke()

  // Parked surf wagons
  drawParkedCar(ctx, -60, -42, '#0284c7')
  drawParkedCar(ctx, 20, -42, '#d97706')

  // Left Building: SURF & PADDLE LAGUNA BEACH
  ctx.fillStyle = '#083344'
  ctx.beginPath()
  ctx.roundRect(-105, 12, 102, 54, 4)
  ctx.fill()
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#22d3ee'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('SURF & PADDLE', -54, 32)
  ctx.fillStyle = '#bae6fd'
  ctx.font = 'bold 7px monospace'
  ctx.fillText('BOARDS • BOOGIES • WAX', -54, 48)

  // Right Building Next Door: THE TACO STAND (699 S Coast Hwy)
  ctx.fillStyle = '#7c2d12'
  ctx.beginPath()
  ctx.roundRect(5, 12, 102, 54, 4)
  ctx.fill()
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('THE TACO STAND', 56, 32)
  ctx.fillStyle = '#fed7aa'
  ctx.font = 'bold 7px monospace'
  ctx.fillText('AL PASTOR • CHURROS 🌮', 56, 48)

  // Landmark Header Banner
  ctx.fillStyle = 'rgba(6, 11, 20, 0.92)'
  ctx.fillRect(-108, -92, 216, 22)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 1
  ctx.strokeRect(-108, -92, 216, 22)
  ctx.fillStyle = '#67e8f9'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('LAGUNA: SURF & PADDLE + TACO STAND', 0, -78)

  ctx.restore()
}

function drawTreasureIslandMontage(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Treasure Island Stone Arch & Tidepools by the Montage
  ctx.fillStyle = '#d97706'
  ctx.beginPath()
  ctx.roundRect(-55, -28, 110, 56, 12)
  ctx.fill()
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#06b6d4'
  ctx.beginPath()
  ctx.arc(0, 0, 18, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('TREASURE ISLAND', 0, -14)
  ctx.fillStyle = '#fef08a'
  ctx.fillText('MONTAGE (3.2 MI)', 0, 22)

  ctx.restore()
}

function draw1000StepsLandmark(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Sandstone Bluff & 1000 Steps Stairway
  ctx.beginPath()
  ctx.moveTo(-60, 40)
  ctx.lineTo(-40, -50)
  ctx.lineTo(25, -70)
  ctx.lineTo(65, -25)
  ctx.lineTo(55, 45)
  ctx.closePath()
  ctx.fillStyle = '#b45309'
  ctx.fill()
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 3
  ctx.stroke()

  // Steps descending
  ctx.fillStyle = '#fef3c7'
  for (let s = -35; s <= 25; s += 10) {
    ctx.fillRect(-12, s, 24, 5)
  }

  ctx.fillStyle = 'rgba(6, 11, 20, 0.9)'
  ctx.fillRect(-75, 55, 150, 24)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 1.5
  ctx.strokeRect(-75, 55, 150, 24)
  ctx.fillStyle = '#67e8f9'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('1000 STEPS BEACH (4.5 MI)', 0, 70)

  ctx.restore()
}

function drawDanaPointHarbor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  ctx.fillStyle = 'rgba(8, 51, 68, 0.92)'
  ctx.beginPath()
  ctx.roundRect(-75, -30, 150, 60, 8)
  ctx.fill()
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#67e8f9'
  ctx.font = 'bold 10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('⛵ DANA POINT & DOHENY', 0, -6)
  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 8px monospace'
  ctx.fillText('MILE 9.5 • LONGBOARDS & DOLPHINS', 0, 12)

  ctx.restore()
}

function drawSanClementePier(ctx: CanvasRenderingContext2D, x: number, y: number, normAngle: number) {
  ctx.save()
  ctx.translate(x, y)

  // Wooden Pier extending out into the Pacific Ocean
  const pierLen = 190
  const px = Math.sin(normAngle) * pierLen
  const py = -Math.cos(normAngle) * pierLen

  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 22
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(px, py)
  ctx.stroke()

  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 16
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(px, py)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = 'rgba(6, 11, 20, 0.92)'
  ctx.fillRect(-78, -28, 156, 24)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1.5
  ctx.strokeRect(-78, -28, 156, 24)
  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('SAN CLEMENTE PIER (13.5 MI)', 0, -13)

  ctx.restore()
}

function drawTrestlesWslArena(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // WSL Finals Judges Scaffolding & Fan VIP Tent on the Cobblestones
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.roundRect(-85, -36, 170, 72, 8)
  ctx.fill()
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 2.5
  ctx.stroke()

  ctx.fillStyle = '#facc15'
  ctx.font = 'bold 10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('🏆 LOWER TRESTLES WSL FINALS', 0, -12)
  ctx.fillStyle = '#67e8f9'
  ctx.font = 'bold 8px monospace'
  ctx.fillText('JUDGES TOWER • CHEERING FANS • PROS', 0, 6)
  ctx.fillStyle = '#f8fafc'
  ctx.fillText('🌊🐬🐢🐚🏖️🎉', 0, 24)

  ctx.restore()
}

function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, car: PlayerCarState) {
  ctx.save()
  ctx.translate(x, y)

  // 1. Headlight beams
  if (car.headlights) {
    const beamGrad = ctx.createRadialGradient(0, -30, 10, 0, -200, 120)
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.42)')
    beamGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.16)')
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)')

    ctx.beginPath()
    ctx.moveTo(-16, -25)
    ctx.lineTo(-75, -220)
    ctx.lineTo(75, -220)
    ctx.lineTo(16, -25)
    ctx.closePath()
    ctx.fillStyle = beamGrad
    ctx.fill()
  }

  // 2. Soft Ground Drop Shadow
  ctx.beginPath()
  ctx.roundRect(-24, -39, 48, 80, 9)
  ctx.fillStyle = 'rgba(2, 6, 23, 0.5)'
  ctx.fill()

  // 3. Cel-Shaded PCH Woody Surf Wagon Body (Metallic Pacific Blue + Teak Wood Side Trim)
  const bodyGrad = ctx.createLinearGradient(-20, -36, 20, 36)
  bodyGrad.addColorStop(0, '#38bdf8')
  bodyGrad.addColorStop(0.45, '#0284c7')
  bodyGrad.addColorStop(1, '#0369a1')

  ctx.beginPath()
  ctx.roundRect(-20, -36, 40, 72, 8)
  ctx.fillStyle = bodyGrad
  ctx.fill()
  ctx.lineWidth = 2.2
  ctx.strokeStyle = '#020617'
  ctx.stroke()

  // Classic California "Woody" Teak Side Trim Panels
  ctx.fillStyle = '#b45309'
  ctx.fillRect(-20, -16, 3.5, 42)
  ctx.fillRect(16.5, -16, 3.5, 42)

  // Specular Hood Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.beginPath()
  ctx.roundRect(-14, -33, 12, 9, 3)
  ctx.fill()

  // 4. Windshield & Rear Glass with Diagonal Sky Reflection
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.roundRect(-16, -24, 32, 11, 3)
  ctx.roundRect(-15, 19, 30, 9, 3)
  ctx.fill()

  ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(-12, -16)
  ctx.lineTo(-4, -22)
  ctx.stroke()

  // 5. Roof Surf Rack with Player's Surfboard/Boogie Board & Pro Surfer's Board!
  ctx.fillStyle = '#020617'
  ctx.fillRect(-18, -14, 36, 3.5)
  ctx.fillRect(-18, 12, 36, 3.5)

  const activeBoard = SNOWBOARDS_LIST.find(b => b.id === car.selectedBoardId) || SNOWBOARDS_LIST[0]
  const activeRider = RIDERS_LIST.find(r => r.id === car.selectedRiderId) || RIDERS_LIST[0]
  const riderBoard = SNOWBOARDS_LIST.find(b => b.id === activeRider.defaultBoardId) || SNOWBOARDS_LIST[1]

  // Player's board (driver side)
  drawRoofCraft(ctx, -9.5, 0, activeBoard.accentColor, activeBoard.craftType === 'boogie')

  // Shotgun Pro's board (passenger side)
  drawRoofCraft(ctx, 9.5, 0, riderBoard.accentColor, riderBoard.craftType === 'boogie')

  // 6. Headlights & Taillights
  ctx.fillStyle = '#fef08a'
  ctx.fillRect(-17, -37, 8, 4)
  ctx.fillRect(9, -37, 8, 4)

  ctx.fillStyle = '#ef4444'
  ctx.fillRect(-17, 33, 8, 4)
  ctx.fillRect(9, 33, 8, 4)

  ctx.restore()
}

function drawRoofCraft(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isBoogie: boolean) {
  ctx.save()
  ctx.translate(x, y)

  if (isBoogie) {
    ctx.beginPath()
    ctx.roundRect(-6.5, -20, 13, 40, 3)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.4
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(0, -34)
    ctx.quadraticCurveTo(7, -16, 6, 28)
    ctx.lineTo(-6, 28)
    ctx.quadraticCurveTo(-7, -16, 0, -34)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.4
    ctx.stroke()

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.7)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, -32)
    ctx.lineTo(0, 27)
    ctx.stroke()
  }

  ctx.restore()
}

function drawParkedCar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(-10, -18, 20, 36, 4)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-8, -8, 16, 14)
  ctx.restore()
}

function renderSeagulls(ctx: CanvasRenderingContext2D, width: number, height: number, birds: SeaBird[]) {
  const timeSec = Date.now() * 0.001

  for (let i = 0; i < birds.length; i++) {
    const b = birds[i]
    b.y += b.speed
    b.x += b.drift
    b.wingPhase += 0.12

    if (b.y > height + 20) {
      b.y = -15
      b.x = Math.random() * width
    }
    if (b.x < -20) b.x = width + 15
    if (b.x > width + 20) b.x = -15

    if (i % 3 === 0) {
      drawCelShadedPelican(ctx, b.x, b.y, timeSec, i)
    } else {
      const flap = Math.sin(b.wingPhase) * 4
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(b.x - 7, b.y + flap)
      ctx.quadraticCurveTo(b.x - 3, b.y - 3, b.x, b.y)
      ctx.quadraticCurveTo(b.x + 3, b.y - 3, b.x + 7, b.y + flap)
      ctx.stroke()
    }
  }
}

function drawPoliceCruiser(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  const strobe = Math.floor(Date.now() / 100) % 2 === 0

  const redHalo = ctx.createRadialGradient(-15, 0, 5, -15, 0, 90)
  redHalo.addColorStop(0, strobe ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.05)')
  redHalo.addColorStop(1, 'rgba(239, 68, 68, 0)')
  ctx.fillStyle = redHalo
  ctx.fillRect(-100, -90, 180, 180)

  const blueHalo = ctx.createRadialGradient(15, 0, 5, 15, 0, 90)
  blueHalo.addColorStop(0, !strobe ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.05)')
  blueHalo.addColorStop(1, 'rgba(59, 130, 246, 0)')
  ctx.fillStyle = blueHalo
  ctx.fillRect(-80, -90, 180, 180)

  ctx.beginPath()
  ctx.roundRect(-22, -40, 44, 80, 8)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fill()

  ctx.beginPath()
  ctx.roundRect(-20, -38, 40, 76, 7)
  ctx.fillStyle = '#f8fafc'
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-18, -36, 36, 16)
  ctx.fillRect(-18, 22, 36, 14)

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(-15, -20, 30, 12)
  ctx.fillRect(-14, 12, 28, 9)

  ctx.fillStyle = strobe ? '#fef08a' : '#ffffff'
  ctx.fillRect(-18, -39, 7, 4)
  ctx.fillStyle = !strobe ? '#fef08a' : '#ffffff'
  ctx.fillRect(11, -39, 7, 4)

  ctx.fillStyle = '#020617'
  ctx.fillRect(-18, -4, 36, 8)

  ctx.fillStyle = strobe ? '#ef4444' : '#7f1d1d'
  ctx.fillRect(-17, -3, 16, 6)

  ctx.fillStyle = !strobe ? '#3b82f6' : '#1e3a8a'
  ctx.fillRect(1, -3, 16, 6)

  ctx.fillStyle = strobe ? '#ffffff' : '#94a3b8'
  ctx.fillRect(-2, -3, 4, 6)

  ctx.fillStyle = '#f59e0b'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('CHP', 0, 20)

  ctx.restore()
}
