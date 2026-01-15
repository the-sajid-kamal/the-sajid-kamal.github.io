import { useState } from 'react'
import { X, Play, Award, TrendingUp, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGame } from '../context/GameContext'
import contentData from '../data/content.json'

const Portfolio = () => {
  const [selectedMission, setSelectedMission] = useState(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const { viewMission, addXP } = useGame()

  const openMissionModal = (mission) => {
    setSelectedMission(mission)
    viewMission(mission.id)
  }

  const closeMissionModal = () => {
    setSelectedMission(null)
    setShowStrategyModal(false)
  }

  const playStrategy = () => {
    setShowStrategyModal(true)
    addXP(15, 'play-strategy')
  }

  const getBadgeIcon = (badgeId) => {
    const badge = contentData.gamification.badges.find(b => b.id === badgeId)
    return badge ? badge.icon : '🏆'
  }

  return (
    <section id="portfolio" className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-navy mb-4">
              Mission Portfolio
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore strategic missions that delivered measurable growth across FMCG categories. 
              Each mission showcases data-driven approaches and innovative solutions.
            </p>
          </div>

          {/* Mission Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentData.missions.map((mission) => (
              <div 
                key={mission.id}
                className="mission-card rounded-xl p-6 cursor-pointer"
                onClick={() => openMissionModal(mission)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {mission.badges.map((badgeId, index) => (
                      <span key={index} className="text-lg">
                        {getBadgeIcon(badgeId)}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs bg-emerald text-white px-2 py-1 rounded-full">
                    +{mission.xp} XP
                  </span>
                </div>
                
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">
                  {mission.title}
                </h3>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p className="font-medium">{mission.company}</p>
                  <p>{mission.timeframe}</p>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {mission.brief}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mission.tools.slice(0, 3).map((tool, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-navy text-white px-2 py-1 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                  {mission.tools.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{mission.tools.length - 3} more
                    </span>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold"
                  onClick={(e) => {
                    e.stopPropagation()
                    openMissionModal(mission)
                  }}
                >
                  Request Mission Brief
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-3xl font-bold text-navy">
                  {selectedMission.title}
                </h2>
                <button
                  onClick={closeMissionModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {!showStrategyModal ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-navy mb-2">Company & Role</h3>
                      <p className="text-gray-700">{selectedMission.company}</p>
                      <p className="text-gray-600">{selectedMission.role}</p>
                      <p className="text-sm text-gray-500">{selectedMission.timeframe}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy mb-2">Mission Badges</h3>
                      <div className="flex space-x-2">
                        {selectedMission.badges.map((badgeId, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <span className="text-2xl">{getBadgeIcon(badgeId)}</span>
                            <span className="text-sm text-gray-600 capitalize">
                              {badgeId.replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-navy mb-2">Mission Brief</h3>
                    <p className="text-gray-700">{selectedMission.brief}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-navy mb-2">Strategy Approach</h3>
                    <p className="text-gray-700">{selectedMission.strategy}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-navy mb-2">Results & Impact</h3>
                    <p className="text-gray-700">{selectedMission.result}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-navy mb-2">Tools & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMission.tools.map((tool, index) => (
                        <span 
                          key={index}
                          className="bg-navy text-white px-3 py-1 rounded-full text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      onClick={playStrategy}
                      className="bg-emerald hover:bg-emerald/90 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play the Strategy
                    </Button>
                    <Button 
                      onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                      className="bg-gold hover:bg-gold/90 text-navy"
                    >
                      Request Similar Mission
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold text-navy">
                    Strategy Playthrough: {selectedMission.title}
                  </h3>
                  
                  <div className="bg-light-gray rounded-lg p-6">
                    <h4 className="font-semibold text-navy mb-4">Decision Point 1: Initial Approach</h4>
                    <p className="text-gray-700 mb-4">
                      How would you approach {selectedMission.title.toLowerCase()}?
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border-2 border-emerald">
                        <h5 className="font-semibold text-emerald mb-2">✓ Chosen Strategy</h5>
                        <p className="text-sm text-gray-700">
                          {selectedMission.strategy}
                        </p>
                        <div className="mt-3 text-xs text-emerald font-semibold">
                          Result: {selectedMission.result.split('.')[0]}.
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                        <h5 className="font-semibold text-gray-600 mb-2">Alternative Path</h5>
                        <p className="text-sm text-gray-700">
                          Traditional approach without data-driven insights and digital integration.
                        </p>
                        <div className="mt-3 text-xs text-coral font-semibold">
                          Estimated Result: 30-50% lower performance
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy rounded-lg p-6 text-white">
                    <h4 className="font-semibold mb-2">Strategy Insights Earned</h4>
                    <div className="flex items-center space-x-4">
                      <Award className="w-6 h-6 text-gold" />
                      <span>+15 XP for completing strategy playthrough</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setShowStrategyModal(false)}
                    className="bg-gold hover:bg-gold/90 text-navy"
                  >
                    Back to Mission Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio

