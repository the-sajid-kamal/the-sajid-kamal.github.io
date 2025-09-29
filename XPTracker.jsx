import { useGame } from '../context/GameContext'

const XPTracker = () => {
  const { xp } = useGame()
  const maxXP = 200
  const progress = Math.min((xp / maxXP) * 100, 100)

  return (
    <div className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg p-4 min-w-[200px] pointer-events-none md:pointer-events-auto">
      <div className="text-sm font-semibold text-primary mb-2">
        Strategy XP: {xp}/{maxXP}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="xp-progress h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-600">
        {xp >= 100 ? (
          <span className="text-emerald font-semibold">🎉 Strategy Mailer Unlocked!</span>
        ) : (
          `Unlock: Strategy Mailer (100 XP)`
        )}
      </div>
    </div>
  )
}

export default XPTracker

