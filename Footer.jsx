import { Download, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useGame } from '../context/GameContext'
import contentData from '../data/content.json'

const Footer = () => {
  const { addXP } = useGame()

  const downloadCV = () => {
    addXP(contentData.gamification.xpRewards.downloadCV, 'footer-download-cv')
    // Create a link to the CV file
    const link = document.createElement('a')
    link.href = '/CV-Sajid-Kamal(Updated).pdf'
    link.download = 'CV-Sajid-Kamal(Updated).pdf'
    link.click()
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-eerie-black text-nyanza py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <h3 className="font-playfair text-2xl font-bold mb-4">
                Mohammad Sajid Kamal
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                FMCG brand strategist — product & category builder, GTM planner, 
                digital campaign lead. Data & tech driven.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href={contentData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-navy p-2 rounded-lg hover:bg-gold/90 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${contentData.personal.email}`}
                  className="bg-gold text-navy p-2 rounded-lg hover:bg-gold/90 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={`tel:${contentData.personal.phone}`}
                  className="bg-gold text-navy p-2 rounded-lg hover:bg-gold/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('hero')}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('portfolio')}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    Missions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    Quests
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gold mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    {contentData.personal.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gold" />
                  <span className="text-gray-300 text-sm">
                    {contentData.personal.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gold" />
                  <span className="text-gray-300 text-sm">
                    {contentData.personal.phone}
                  </span>
                </div>
              </div>
              
              {/* Download CV */}
              <button
                onClick={downloadCV}
                className="mt-4 bg-gold hover:bg-gold/90 text-navy font-semibold px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

