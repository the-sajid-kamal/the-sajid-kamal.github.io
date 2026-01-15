import { useState } from 'react'
import { ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import contentData from '../data/content.json'

const Services = () => {
  const [selectedService, setSelectedService] = useState(null)

  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
  }

  const serviceIcons = {
    'brand-strategy': '🎯',
    'gtm-planning': '🚀',
    'digital-campaigns': '📈',
    'workshops': '🎓'
  }

  return (
    <section id="services" className="py-16 bg-nyanza">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
              Strategy Quests
            </h2>
            <p className="text-xl text-eerie-black max-w-3xl mx-auto">
              Choose your strategic adventure. Each quest is designed to deliver measurable outcomes 
              and unlock new growth opportunities for your brand.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {contentData.services.map((service) => (
              <div 
                key={service.id}
                className="quest-tile p-8 text-nyanza rounded-xl relative overflow-hidden group cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-4">
                    {serviceIcons[service.id]}
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold mb-4 text-eerie-black">
                    {service.title}
                  </h3>
                  
                  <p className="text-eerie-black mb-6">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-eerie-black">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{service.timeline}</span>
                    </div>
                    
                    <Button 
                      className="bg-desert-sand hover:bg-desert-sand/90 text-eerie-black font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        scrollToContact()
                      }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Detail Modal */}
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {serviceIcons[selectedService.id]}
                      </span>
                      <h2 className="font-playfair text-2xl font-bold text-primary">
                        {selectedService.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Quest Description</h3>
                      <p className="text-eerie-black">{selectedService.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-3">Quest Deliverables</h3>
                      <div className="space-y-2">
                        {selectedService.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-cadet-gray mr-3" />
                            <span className="text-eerie-black">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Timeline</h3>
                        <p className="text-eerie-black">{selectedService.timeline}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Quest Type</h3>
                        <p className="text-eerie-black">Strategic Consulting</p>
                      </div>
                    </div>

                    <div className="bg-nyanza rounded-lg p-6">
                      <h3 className="font-semibold text-primary mb-3">Ready to Start This Quest?</h3>
                      <p className="text-eerie-black mb-4">
                        Let\'s discuss your specific needs and create a customized approach 
                        that delivers measurable results for your brand.
                      </p>
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => {
                            setSelectedService(null)
                            scrollToContact()
                          }}
                          className="bg-desert-sand hover:bg-desert-sand/90 text-eerie-black font-semibold"
                        >
                          Request Quote
                        </Button>
                        <Button 
                          onClick={() => setSelectedService(null)}
                          variant="outline"
                          className="border-cadet-gray text-eerie-black hover:bg-cadet-gray/20 transition-all duration-300"
                        >
                          Explore Other Quests
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strategy Challenge Section */}
          <div className="bg-eerie-black rounded-xl p-8 text-nyanza text-center">
            <h3 className="font-playfair text-2xl font-bold text-eerie-black mb-4">
              Strategy Challenge
            </h3>
            <p className="text-eerie-black mb-6 max-w-2xl mx-auto">
              Take our 3-question mini-quiz to discover which service best fits your current needs. 
              Earn a "Strategy Insight" badge and get personalized recommendations.
            </p>
            <Button 
              onClick={() => {
                // This would open a quiz modal in a full implementation
                alert('Strategy Challenge coming soon! Contact us directly for personalized recommendations.')
              }}
              className="bg-desert-sand hover:bg-desert-sand/90 text-eerie-black font-semibold"
            >
              Take the Challenge
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services

