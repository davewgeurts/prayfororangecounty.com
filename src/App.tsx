import { CanyonDriveContainer } from './components/CanyonDrive/CanyonDriveContainer'
import { BombHoleAdBanner } from './components/BombHole/BombHoleAdBanner'

export function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-alpine-bg text-alpine-text flex flex-col">
      <BombHoleAdBanner />
      <div className="flex-1 w-full overflow-hidden relative">
        <CanyonDriveContainer />
      </div>
    </div>
  )
}

export default App
