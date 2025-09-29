import { useState } from 'react'
import { ArrowRight, Target, Megaphone, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGame } from '../context/GameContext'
import heroBackground from '../assets/hero-background.jpg'

const Hero = () => {
  const [selectedPath, setSelectedPath] = useState(null)
  const { addXP } = useGame()

  const paths = [
    {
      id: 'campaigns',
      title: 'Campaigns',
      icon: <Megaphone className="w-6 h-6" />,
      description: 'Explore 100+ digital campaigns that drove measurable growth across FMCG categories.',
      action: () => {
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })
        addXP(10, 'hero-path-campaigns')
      }
    },
    {
      id: 'speaking',
      title: 'Speaking',
      icon: <Users className="w-6 h-6" />,
      description: 'Discover workshops and training sessions on brand strategy and digital marketing.',
      action: () => {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
        addXP(10, 'hero-path-speaking')
      }
    },
    {
      id: 'consulting',
      title: 'Consulting',
      icon: <Target className="w-6 h-6" />,
      description: 'Learn about strategic consulting for GTM planning and brand architecture.',
      action: () => {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
        addXP(10, 'hero-path-consulting')
      }
    }
  ]

  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToPortfolio = () => {
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      id="hero" 
      className="pt-24 pb-16 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(28, 35, 33, 0.85), rgba(28, 35, 33, 0.75)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 right-1/3 w-5 h-5 bg-secondary rounded-full animate-float opacity-30" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-in-up drop-shadow-lg">
            Turning Brand Strategy Into Measurable Growth
          </h1>
          
          {/* Subheadline */}
          <div className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed drop-shadow-md">
            <p className="mb-2">I'm MD Sajid Kamal — FMCG brand strategist & digital lead.</p>
            <p>I build new categories, design GTM blueprints and run high-impact digital campaigns that move margins.</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={scrollToContact}
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start a Strategy Quest
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={scrollToPortfolio}
              variant="outline"
              className="border-2 border-white text-primary hover:bg-white hover:text-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              View Selected Missions
            </Button>
          </div>

          {/* Choose Your Path Gamification */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-6">
              Choose Your Path
            </h3>
            
            {!selectedPath ? (
              <div className="grid md:grid-cols-3 gap-4">
                {paths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setSelectedPath(path)}
                    className="quest-tile p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center text-center">
                      {path.icon}
                      <span className="mt-2 font-semibold">{path.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center animate-slide-in-up">
                <div className="flex items-center justify-center mb-4 text-secondary">
                  {selectedPath.icon}
                  <h4 className="ml-2 text-xl font-semibold text-primary">
                    {selectedPath.title}
                  </h4>
                </div>
                <p className="text-gray-700 mb-6">
                  {selectedPath.description}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={selectedPath.action}
                    className="bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore This Path
                  </Button>
                  <Button 
                    onClick={() => setSelectedPath(null)}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    Choose Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

