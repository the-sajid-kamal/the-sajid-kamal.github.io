import { createContext, useContext, useState, useEffect } from 'react'
import contentData from '../data/content.json'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [xp, setXp] = useState(0)
  const [badges, setBadges] = useState([])
  const [viewedMissions, setViewedMissions] = useState([])
  const [completedActions, setCompletedActions] = useState([])

  // Load saved progress from localStorage
  useEffect(() => {
    const savedXp = localStorage.getItem('sajid-xp')
    const savedBadges = localStorage.getItem('sajid-badges')
    const savedMissions = localStorage.getItem('sajid-viewed-missions')
    const savedActions = localStorage.getItem('sajid-completed-actions')

    if (savedXp) setXp(parseInt(savedXp))
    if (savedBadges) setBadges(JSON.parse(savedBadges))
    if (savedMissions) setViewedMissions(JSON.parse(savedMissions))
    if (savedActions) setCompletedActions(JSON.parse(savedActions))
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('sajid-xp', xp.toString())
    localStorage.setItem('sajid-badges', JSON.stringify(badges))
    localStorage.setItem('sajid-viewed-missions', JSON.stringify(viewedMissions))
    localStorage.setItem('sajid-completed-actions', JSON.stringify(completedActions))
  }, [xp, badges, viewedMissions, completedActions])

  const addXP = (amount, action) => {
    setXp(prev => prev + amount)
    if (action && !completedActions.includes(action)) {
      setCompletedActions(prev => [...prev, action])
    }
    checkBadgeUnlocks()
  }

  const viewMission = (missionId) => {
    if (!viewedMissions.includes(missionId)) {
      setViewedMissions(prev => [...prev, missionId])
      addXP(contentData.gamification.xpRewards.viewMission, `view-${missionId}`)
    }
  }

  const unlockBadge = (badgeId) => {
    if (!badges.includes(badgeId)) {
      setBadges(prev => [...prev, badgeId])
      addXP(contentData.gamification.xpRewards.unlockBadge, `badge-${badgeId}`)
      return true
    }
    return false
  }

  const checkBadgeUnlocks = () => {
    const gtmMissions = viewedMissions.filter(id => 
      ['mission-1', 'mission-3', 'mission-4'].includes(id)
    ).length

    const digitalMissions = viewedMissions.filter(id => 
      ['mission-3', 'mission-6'].includes(id)
    ).length

    const productMissions = viewedMissions.filter(id => 
      ['mission-1', 'mission-5'].includes(id)
    ).length

    // Check badge conditions
    if (gtmMissions >= 3 && !badges.includes('gtm-architect')) {
      unlockBadge('gtm-architect')
    }

    if (digitalMissions >= 2 && !badges.includes('digital-growth-hacker')) {
      unlockBadge('digital-growth-hacker')
    }

    if (productMissions >= 2 && !badges.includes('product-innovator')) {
      unlockBadge('product-innovator')
    }

    if (viewedMissions.length >= 6 && !badges.includes('mission-explorer')) {
      unlockBadge('mission-explorer')
    }
  }

  const value = {
    xp,
    badges,
    viewedMissions,
    completedActions,
    addXP,
    viewMission,
    unlockBadge,
    checkBadgeUnlocks
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

