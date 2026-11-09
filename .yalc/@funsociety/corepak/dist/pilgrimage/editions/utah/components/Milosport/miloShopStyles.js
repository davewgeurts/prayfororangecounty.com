// Plain CSS for the Milosport shop scenes. Injected with a <style> tag so the keyframes
// ship with corepak and never depend on a consumer's Tailwind purge.
//
// The figure rig (MiloFigure.tsx) is drawn in a 60x120 viewBox; every limb rotates
// around its joint via transform-box: view-box, so origins below are in SVG units.
export const MILO_SHOP_CSS = `
.milo-1080-title {
  font-family: 'Arial Black', 'Helvetica Neue', Impact, sans-serif;
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  background: linear-gradient(180deg, #ffffff 0%, #dbeeff 48%, #5aa2ff 52%, #1e4fd8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px #061a4a;
  filter: drop-shadow(3px 3px 0 #061a4a);
}
.milo-1080-banner {
  display: inline-block;
  white-space: nowrap;
  transform: skewX(-14deg);
  background: linear-gradient(90deg, #0a2f8f 0%, #1d6fe0 70%, #4fa3ff 100%);
  border: 2px solid #e6f3ff;
  box-shadow: 4px 4px 0 #04112e;
}
.milo-1080-banner > * { display: inline-block; transform: skewX(14deg); }
.milo-1080-panel {
  background: linear-gradient(160deg, rgba(10, 40, 120, 0.92), rgba(4, 14, 46, 0.95));
  border: 2px solid #bcdcff;
  box-shadow: inset 0 0 0 2px #0a2f8f, 6px 6px 0 rgba(2, 8, 28, 0.85);
  border-radius: 6px;
}
.milo-seg-bar { display: flex; gap: 2px; transform: skewX(-14deg); }
.milo-seg-bar > span { width: 10px; height: 10px; background: #0b1a3d; border: 1px solid #23407a; }
.milo-seg-bar > span.on { background: linear-gradient(180deg, #ffffff, #7cc4ff 60%, #2563eb); border-color: #dbeeff; }
.milo-seg-bar > span.on.hot { background: linear-gradient(180deg, #fff7d6, #fbbf24 60%, #ea580c); border-color: #fde68a; }

.milo-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 6px;
  width: max-content;
  max-width: 220px;
  padding: 6px 9px;
  background: #ffffff;
  color: #061a4a;
  border: 2px solid #061a4a;
  border-radius: 10px;
  box-shadow: 3px 3px 0 #1d6fe0;
  font: italic 800 11px/1.25 'Arial Black', 'Helvetica Neue', sans-serif;
  text-align: center;
  pointer-events: none;
  z-index: 40;
  animation: milo-pop 0.18s ease-out;
}
.milo-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-top-color: #061a4a;
}
@keyframes milo-pop { from { transform: translateX(-50%) scale(0.6); opacity: 0; } to { transform: translateX(-50%) scale(1); opacity: 1; } }

/* ---------- board wall ---------- */
.milo-board-hang {
  transform-origin: 50% 0%;
  transition: transform 0.22s cubic-bezier(.3, 1.6, .5, 1), filter 0.22s;
  animation: milo-board-sway 5s ease-in-out infinite;
}
.milo-board-hang:hover, .milo-board-hang:focus-visible {
  animation: none;
  transform: translateY(-8px) rotate(-3deg) scale(1.06);
  filter: drop-shadow(0 14px 10px rgba(0, 0, 0, 0.55));
}
.milo-board-hang.is-picked {
  animation: none;
  transform: translateY(26px) scale(0.92);
  opacity: 0.25;
  filter: grayscale(0.6);
}
@keyframes milo-board-sway { 0%, 100% { transform: rotate(0.6deg); } 50% { transform: rotate(-0.6deg); } }
.milo-board-spin { animation: milo-board-spin 0.9s cubic-bezier(.2, .8, .3, 1); }
@keyframes milo-board-spin {
  0% { transform: translateY(-40px) rotateY(0deg) scale(0.7); opacity: 0; }
  60% { transform: translateY(4px) rotateY(330deg) scale(1.04); opacity: 1; }
  100% { transform: translateY(0) rotateY(360deg) scale(1); }
}

/* ---------- figure rig ---------- */
.milo-fig { overflow: visible; }
.milo-fig .mf-body, .milo-fig .mf-head, .milo-fig .mf-arm-l, .milo-fig .mf-arm-r,
.milo-fig .mf-fore-l, .milo-fig .mf-fore-r, .milo-fig .mf-leg-l, .milo-fig .mf-leg-r, .milo-fig .mf-prop-board {
  transform-box: view-box;
  transition: transform 0.22s cubic-bezier(.3, 1.4, .5, 1);
}
.milo-fig .mf-body { transform-origin: 30px 118px; animation: mf-breathe 3.2s ease-in-out infinite; animation-delay: var(--mf-delay, 0s); }
.milo-fig .mf-head { transform-origin: 30px 38px; }
.milo-fig .mf-arm-l { transform-origin: 17px 45px; }
.milo-fig .mf-fore-l { transform-origin: 17px 59px; }
.milo-fig .mf-arm-r { transform-origin: 43px 45px; }
.milo-fig .mf-fore-r { transform-origin: 43px 59px; }
.milo-fig .mf-leg-l { transform-origin: 26px 72px; }
.milo-fig .mf-leg-r { transform-origin: 34px 72px; }
.milo-fig .mf-prop-board { transform-origin: 30px 116px; }
@keyframes mf-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-0.8px); } }

/* hover poses */
.mf--flex .mf-arm-l { transform: rotate(100deg); } .mf--flex .mf-fore-l { transform: rotate(80deg); }
.mf--flex .mf-arm-r { transform: rotate(-100deg); } .mf--flex .mf-fore-r { transform: rotate(-80deg); }
.mf--point .mf-arm-r { transform: rotate(-125deg); } .mf--point .mf-arm-l { transform: rotate(20deg); } .mf--point .mf-fore-l { transform: rotate(-100deg); }
.mf--point .mf-head { transform: rotate(-6deg); }
.mf--shaka .mf-arm-r { transform: rotate(-55deg); } .mf--shaka .mf-fore-r { transform: rotate(-95deg); } .mf--shaka .mf-head { transform: rotate(8deg); }
.mf--dab .mf-arm-l { transform: rotate(135deg); } .mf--dab .mf-arm-r { transform: rotate(60deg); } .mf--dab .mf-fore-r { transform: rotate(80deg); }
.mf--dab .mf-head { transform: rotate(28deg) translateY(2px); }
.mf--peace .mf-arm-r { transform: rotate(-160deg); } .mf--peace .mf-arm-l { transform: rotate(18deg); } .mf--peace .mf-fore-l { transform: rotate(-95deg); }
.mf--hands-up .mf-arm-l { transform: rotate(155deg); } .mf--hands-up .mf-arm-r { transform: rotate(-155deg); }
.mf--hands-up .mf-body { animation: mf-hop 0.45s ease-in-out infinite; }
.mf--crossed .mf-arm-l { transform: rotate(-14deg); } .mf--crossed .mf-fore-l { transform: rotate(-112deg); }
.mf--crossed .mf-arm-r { transform: rotate(14deg); } .mf--crossed .mf-fore-r { transform: rotate(112deg); }
.mf--crossed .mf-head { transform: rotate(-5deg); }
@keyframes mf-hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

/* ---------- Fortnite dances ---------- */
.mf--dance .mf-body, .mf--dance .mf-head, .mf--dance .mf-arm-l, .mf--dance .mf-arm-r,
.mf--dance .mf-fore-l, .mf--dance .mf-fore-r, .mf--dance .mf-leg-l, .mf--dance .mf-leg-r { transition: none; }

/* floss */
.mf--floss .mf-arm-l, .mf--floss .mf-arm-r { animation: fl-arms 0.42s ease-in-out infinite alternate; }
.mf--floss .mf-body { animation: fl-hips 0.42s ease-in-out infinite alternate; }
@keyframes fl-arms { from { transform: rotate(32deg); } to { transform: rotate(-32deg); } }
@keyframes fl-hips { from { transform: translateX(-3px) rotate(-3deg); } to { transform: translateX(3px) rotate(3deg); } }

/* default dance */
.mf--default .mf-arm-l { animation: dd-al 0.5s ease-in-out infinite; }
.mf--default .mf-arm-r { animation: dd-ar 0.5s ease-in-out infinite; }
.mf--default .mf-fore-l { transform: rotate(70deg); } .mf--default .mf-fore-r { transform: rotate(-70deg); }
.mf--default .mf-body { animation: mf-hop 0.25s ease-in-out infinite; }
.mf--default .mf-head { animation: dd-head 0.5s ease-in-out infinite; }
@keyframes dd-al { 0%, 100% { transform: rotate(40deg); } 50% { transform: rotate(150deg); } }
@keyframes dd-ar { 0%, 100% { transform: rotate(-150deg); } 50% { transform: rotate(-40deg); } }
@keyframes dd-head { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }

/* take the L */
.mf--take-the-l .mf-arm-r { transform: rotate(-150deg); } .mf--take-the-l .mf-fore-r { transform: rotate(-70deg); }
.mf--take-the-l .mf-arm-l { animation: tl-arm 0.3s ease-in-out infinite alternate; }
.mf--take-the-l .mf-leg-l { animation: tl-kick 0.3s ease-in-out infinite alternate; }
.mf--take-the-l .mf-body { animation: mf-hop 0.3s ease-in-out infinite; }
.mf--take-the-l .mf-head { transform: rotate(-10deg); }
@keyframes tl-arm { from { transform: rotate(10deg); } to { transform: rotate(50deg); } }
@keyframes tl-kick { from { transform: rotate(0deg); } to { transform: rotate(38deg); } }

/* orange justice */
.mf--orange-justice .mf-arm-l { animation: oj-al 0.36s ease-in-out infinite alternate; }
.mf--orange-justice .mf-arm-r { animation: oj-ar 0.36s ease-in-out infinite alternate; }
.mf--orange-justice .mf-leg-l { animation: oj-ll 0.36s ease-in-out infinite alternate; }
.mf--orange-justice .mf-leg-r { animation: oj-lr 0.36s ease-in-out infinite alternate; }
.mf--orange-justice .mf-body { animation: mf-hop 0.36s ease-in-out infinite; }
@keyframes oj-al { from { transform: rotate(70deg); } to { transform: rotate(-35deg); } }
@keyframes oj-ar { from { transform: rotate(35deg); } to { transform: rotate(-70deg); } }
@keyframes oj-ll { from { transform: rotate(18deg); } to { transform: rotate(-4deg); } }
@keyframes oj-lr { from { transform: rotate(4deg); } to { transform: rotate(-18deg); } }

/* electro shuffle */
.mf--electro-shuffle .mf-leg-l { animation: es-l 0.22s linear infinite alternate; }
.mf--electro-shuffle .mf-leg-r { animation: es-l 0.22s linear infinite alternate-reverse; }
.mf--electro-shuffle .mf-arm-l { transform: rotate(60deg); } .mf--electro-shuffle .mf-fore-l { animation: es-fore 0.44s ease-in-out infinite alternate; }
.mf--electro-shuffle .mf-arm-r { transform: rotate(-60deg); } .mf--electro-shuffle .mf-fore-r { animation: es-fore 0.44s ease-in-out infinite alternate-reverse; }
.mf--electro-shuffle .mf-body { animation: es-slide 0.88s ease-in-out infinite alternate; }
@keyframes es-l { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
@keyframes es-fore { from { transform: rotate(-60deg); } to { transform: rotate(60deg); } }
@keyframes es-slide { from { transform: translateX(-5px); } to { transform: translateX(5px); } }

/* hype */
.mf--hype .mf-arm-r { animation: hy-punch 0.28s ease-in-out infinite alternate; }
.mf--hype .mf-arm-l { animation: hy-punch-l 0.28s ease-in-out infinite alternate-reverse; }
.mf--hype .mf-body { animation: mf-hop 0.28s ease-in-out infinite; }
.mf--hype .mf-head { animation: hy-nod 0.28s ease-in-out infinite alternate; }
@keyframes hy-punch { from { transform: rotate(-175deg); } to { transform: rotate(-100deg); } }
@keyframes hy-punch-l { from { transform: rotate(175deg); } to { transform: rotate(100deg); } }
@keyframes hy-nod { from { transform: rotate(0deg); } to { transform: rotate(10deg) translateY(1px); } }

/* griddy */
.mf--griddy .mf-arm-l { animation: gr-arm 0.3s ease-in-out infinite alternate; }
.mf--griddy .mf-arm-r { animation: gr-arm 0.3s ease-in-out infinite alternate-reverse; }
.mf--griddy .mf-fore-l { transform: rotate(-50deg); } .mf--griddy .mf-fore-r { transform: rotate(50deg); }
.mf--griddy .mf-leg-l { animation: gr-heel 0.3s ease-in-out infinite alternate; }
.mf--griddy .mf-leg-r { animation: gr-heel 0.3s ease-in-out infinite alternate-reverse; }
.mf--griddy .mf-body { animation: gr-lean 0.6s ease-in-out infinite; }
@keyframes gr-arm { from { transform: rotate(-40deg); } to { transform: rotate(40deg); } }
@keyframes gr-heel { from { transform: rotate(-14deg) translateY(-3px); } to { transform: rotate(6deg); } }
@keyframes gr-lean { 0%, 100% { transform: rotate(6deg); } 50% { transform: rotate(10deg) translateY(-2px); } }

/* ride the pony */
.mf--ride-the-pony .mf-arm-r { transform: rotate(-150deg); }
.mf--ride-the-pony .mf-fore-r { animation: rp-lasso 0.5s linear infinite; }
.mf--ride-the-pony .mf-arm-l { transform: rotate(-20deg); } .mf--ride-the-pony .mf-fore-l { transform: rotate(-105deg); }
.mf--ride-the-pony .mf-leg-l { animation: es-l 0.25s ease-in-out infinite alternate; }
.mf--ride-the-pony .mf-leg-r { animation: es-l 0.25s ease-in-out infinite alternate-reverse; }
.mf--ride-the-pony .mf-body { animation: mf-hop 0.25s ease-in-out infinite; }
@keyframes rp-lasso { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* best mates */
.mf--best-mates .mf-body { animation: bm-hop 0.7s ease-in-out infinite; }
.mf--best-mates .mf-arm-l { animation: bm-arm 0.35s ease-in-out infinite alternate; }
.mf--best-mates .mf-arm-r { animation: bm-arm 0.35s ease-in-out infinite alternate; }
.mf--best-mates .mf-head { animation: dd-head 0.7s ease-in-out infinite; }
@keyframes bm-hop {
  0%, 100% { transform: translateX(-6px) translateY(0); }
  25% { transform: translateX(0) translateY(-6px); }
  50% { transform: translateX(6px) translateY(0); }
  75% { transform: translateX(0) translateY(-6px); }
}
@keyframes bm-arm { from { transform: rotate(55deg); } to { transform: rotate(-55deg); } }

/* ---------- local NPC idles ---------- */
.mf--idle-sway .mf-body { animation: id-sway 4.5s ease-in-out infinite; animation-delay: var(--mf-delay, 0s); }
.mf--idle-sway .mf-head { animation: id-tilt 4.5s ease-in-out infinite; animation-delay: var(--mf-delay, 0s); }
@keyframes id-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes id-tilt { 0%, 100% { transform: rotate(6deg); } 50% { transform: rotate(-4deg); } }
.mf--idle-gloves .mf-arm-l { transform: rotate(50deg); } .mf--idle-gloves .mf-fore-l { animation: id-glove 1.4s ease-in-out infinite alternate; }
.mf--idle-gloves .mf-arm-r { transform: rotate(-50deg); } .mf--idle-gloves .mf-fore-r { animation: id-glove-r 1.4s ease-in-out infinite alternate; }
.mf--idle-gloves .mf-head { transform: rotate(10deg) translateY(1px); }
@keyframes id-glove { from { transform: rotate(70deg); } to { transform: rotate(110deg); } }
@keyframes id-glove-r { from { transform: rotate(-70deg); } to { transform: rotate(-110deg); } }
.mf--idle-kickflip .mf-body { animation: kf-ollie 1.6s ease-in-out infinite; }
.mf--idle-kickflip .mf-prop-board { animation: kf-board 1.6s ease-in-out infinite; }
.mf--idle-kickflip .mf-arm-l { transform: rotate(60deg); } .mf--idle-kickflip .mf-arm-r { transform: rotate(-60deg); }
@keyframes kf-ollie { 0%, 55%, 100% { transform: translateY(0); } 70% { transform: translateY(-14px); } 85% { transform: translateY(-4px); } }
@keyframes kf-board { 0%, 55%, 100% { transform: translateY(0) scaleY(1); } 65% { transform: translateY(-12px) scaleY(-1); } 75% { transform: translateY(-14px) scaleY(1); } 85% { transform: translateY(-2px) rotate(8deg); } }
.mf--idle-phone .mf-arm-r { transform: rotate(-30deg); } .mf--idle-phone .mf-fore-r { transform: rotate(-120deg); }
.mf--idle-phone .mf-head { animation: id-tilt 3.4s ease-in-out infinite; }
.mf--idle-browse .mf-arm-r { animation: id-reach 3s ease-in-out infinite; }
.mf--idle-browse .mf-head { transform: rotate(-12deg); }
@keyframes id-reach { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(-95deg); } }
.mf--idle-dig .mf-body { transform: rotate(14deg); animation: none; }
.mf--idle-dig .mf-arm-r { animation: id-dig 0.6s ease-in-out infinite alternate; }
.mf--idle-dig .mf-arm-l { animation: id-dig 0.6s ease-in-out infinite alternate-reverse; }
@keyframes id-dig { from { transform: rotate(-10deg); } to { transform: rotate(-40deg); } }

.milo-dance-banner { animation: milo-dance-banner 0.5s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes milo-dance-banner { from { transform: skewX(-14deg) scale(0.4); opacity: 0; } to { transform: skewX(-14deg) scale(1); opacity: 1; } }
.milo-neon { animation: milo-neon 3.8s steps(1) infinite; }
@keyframes milo-neon { 0%, 100% { opacity: 1; } 47% { opacity: 1; } 48% { opacity: 0.35; } 50% { opacity: 1; } 52% { opacity: 0.5; } 53% { opacity: 1; } }
.milo-tv-static { animation: milo-tv 0.18s steps(2) infinite; }
@keyframes milo-tv { from { opacity: 0.85; } to { opacity: 1; } }

/* ---------- saiyan easter egg ---------- */
.mf--saiyan { filter: drop-shadow(0 0 3px #fde047) drop-shadow(0 0 10px #f59e0b); }
.milo-fig .mf-aura { transform-box: view-box; transform-origin: 30px 118px; animation: mf-aura 0.32s ease-in-out infinite alternate; }
@keyframes mf-aura { from { transform: scale(0.96, 0.94); opacity: 0.45; } to { transform: scale(1.1, 1.05); opacity: 0.85; } }
.mf--saiyan.mf--dance .mf-body, .mf--saiyan.mf--dance .mf-arm-l, .mf--saiyan.mf--dance .mf-arm-r,
.mf--saiyan.mf--dance .mf-fore-l, .mf--saiyan.mf--dance .mf-fore-r, .mf--saiyan.mf--dance .mf-leg-l,
.mf--saiyan.mf--dance .mf-leg-r, .mf--saiyan.mf--dance .mf-head { animation-duration: 0.18s !important; }

/* ---------- ambient shop motion ---------- */
.milo-flake { animation: milo-flake 4s linear infinite; }
@keyframes milo-flake { from { transform: translate(0, -60px); } to { transform: translate(6px, 300px); } }
.milo-wander { animation: milo-wander 11s ease-in-out infinite; }
@keyframes milo-wander {
  0% { transform: translateX(-140%) scaleX(1); }
  45% { transform: translateX(140%) scaleX(1); }
  50% { transform: translateX(140%) scaleX(-1); }
  95% { transform: translateX(-140%) scaleX(-1); }
  100% { transform: translateX(-140%) scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .milo-fig *, .milo-board-hang, .milo-board-spin, .milo-neon, .milo-tv-static, .milo-bubble, .milo-dance-banner,
  .milo-flake, .milo-wander { animation: none !important; }
}
`;
