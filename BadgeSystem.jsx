import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { X } from 'lucide-react'
import contentData from '../data/content.json'

const BadgeSystem = () => {
  const { badges } = useGame()
  const [newBadge, setNewBadge] = useState(null)
  const [showBadgeModal, setShowBadgeModal] = useState(false)

  useEffect(() => {
    // Check for new badges
    const lastBadgeCount = parseInt(localStorage.getItem('sajid-last-badge-count') || '0')
    if (badges.length > lastBadgeCount) {
      const latestBadge = badges[badges.length - 1]
      const badgeData = contentData.gamification.badges.find(b => b.id === latestBadge)
      if (badgeData) {
        setNewBadge(badgeData)
        setShowBadgeModal(true)
      }
      localStorage.setItem('sajid-last-badge-count', badges.length.toString())
    }
  }, [badges])

  const closeBadgeModal = () => {
    setShowBadgeModal(false)
    setNewBadge(null)
  }

  if (!showBadgeModal || !newBadge) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center badge-unlock">
        <button
          onClick={closeBadgeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-6xl mb-4">{newBadge.icon}</div>
        <h3 className="font-playfair text-2xl font-bold text-navy mb-2">
          Badge Unlocked!
        </h3>
        <h4 className="text-xl font-semibold text-gold mb-2">
          {newBadge.name}
        </h4>
        <p className="text-gray-600 mb-6">
          {newBadge.description}
        </p>
        
        <button
          onClick={closeBadgeModal}
          className="bg-gold hover:bg-gold/90 text-navy font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}

export default BadgeSystem

