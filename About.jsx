import { useState } from 'react'
import { Download, MapPin, Mail, Phone, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGame } from '../context/GameContext'
import contentData from '../data/content.json'

const About = () => {
  const { addXP } = useGame()

  const downloadCV = () => {
    // In a real implementation, this would download the actual CV
    addXP(contentData.gamification.xpRewards.downloadCV, 'download-cv')
    // Create a link to the CV file
    const link = document.createElement('a')
    link.href = '/CV-Sajid-Kamal(Updated).pdf'
    link.download = 'CV-Sajid-Kamal(Updated).pdf'
    link.click()
  }

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Bio */}
            <div>
              <h2 className="font-playfair text-4xl font-bold text-navy mb-8">
                About MD Sajid Kamal
              </h2>
              
              {/* Short Bio Card */}
              <div className="bg-light-gray rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-navy mb-4">Quick Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  {contentData.about.shortBio}
                </p>
              </div>

              {/* Long Bio */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy mb-3">Career Summary & Specialties</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {contentData.about.careerSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Technical Skills & Expertise</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Specialized in {contentData.about.specialQualifications.toLowerCase()}.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Personal Approach</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Strategy-first, data-backed, end-to-end product & campaign builder. Certified in Meta Business Suite, 
                    Google Analytics 4, and Google Ads. I believe in leveraging technology and data to create marketing 
                    strategies that deliver measurable business outcomes.
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-6 bg-navy rounded-lg text-white">
                <h4 className="font-semibold mb-4">Get In Touch</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-gold" />
                    <span className="text-sm">{contentData.personal.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gold" />
                    <span className="text-sm">{contentData.personal.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gold" />
                    <span className="text-sm">{contentData.personal.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-3 text-gold" />
                    <a 
                      href={contentData.personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-gold transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Download CV Button */}
              <Button 
                onClick={downloadCV}
                className="mt-6 bg-gold hover:bg-gold/90 text-navy font-semibold w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV (PDF)
              </Button>
            </div>

            {/* Right Column - Timeline */}
            <div>
              <h3 className="font-playfair text-2xl font-bold text-navy mb-8">
                Career Timeline
              </h3>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gold"></div>
                
                {/* Timeline Items */}
                <div className="space-y-8">
                  {contentData.timeline.map((item, index) => (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-white ${
                        item.type === 'current' ? 'bg-emerald' : 'bg-gold'
                      }`}></div>
                      
                      {/* Content */}
                      <div className="ml-12 bg-white rounded-lg shadow-md p-6 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-navy">{item.company}</h4>
                          {item.type === 'current' && (
                            <span className="bg-emerald text-white text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium mb-1">{item.position}</p>
                        <p className="text-sm text-gray-500">{item.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-12">
                <h4 className="font-semibold text-navy mb-4">Recent Certifications</h4>
                <div className="space-y-3">
                  {contentData.certifications.slice(0, 4).map((cert, index) => (
                    <div key={index} className="bg-light-gray rounded-lg p-4">
                      <h5 className="font-medium text-navy">{cert.title}</h5>
                      <p className="text-sm text-gray-600">{cert.institute} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

