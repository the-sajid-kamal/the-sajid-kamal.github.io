import { useState } from 'react'
import { Send, MapPin, Mail, Phone, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGame } from '../context/GameContext'
import contentData from '../data/content.json'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    budget: '',
    contactDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addXP } = useGame()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const FORM_ENDPOINT = "https://formspree.io/f/sajidkamal214@gmail.com"; // Replace with your Formspree endpoint // Replace with your Formspree endpoint

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        addXP(25, 'contact-form-submit');
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            projectType: '',
            description: '',
            budget: '',
            contactDate: ''
          });
        }, 3000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-12 shadow-lg">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="font-playfair text-3xl font-bold text-primary mb-4">
                Quest Request Received!
              </h2>
              <p className="text-gray-700 mb-6">
                Thank you for starting your strategy quest with us. We'll review your request 
                and get back to you within 24 hours with a customized approach.
              </p>
              <div className="bg-secondary text-nyanza px-4 py-2 rounded-lg inline-block">
                +25 XP earned for quest initiation!
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
              Let's Start a Strategy Quest
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ready to turn your brand challenges into growth opportunities? 
              Share your project details and let's create a winning strategy together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="font-playfair text-2xl font-bold text-navy mb-6">
                Quest Details
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select project type</option>
                    <option value="campaign">Digital Campaign</option>
                    <option value="consulting">Strategic Consulting</option>
                    <option value="speaking">Workshop/Speaking</option>
                    <option value="gtm">GTM Planning</option>
                    <option value="brand">Brand Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Brief Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Tell us about your project goals, challenges, and what you'd like to achieve..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Estimated Budget
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-10k">Under $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                      <option value="discuss">Let's discuss</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Preferred Contact Date
                    </label>
                    <input
                      type="date"
                      name="contactDate"
                      value={formData.contactDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-4 text-lg"
                >
                  {isSubmitting ? (
                    'Launching Quest...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Launch Strategy Quest
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info & Testimonials */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-navy rounded-xl p-8 text-white">
                <h3 className="font-playfair text-2xl font-bold mb-6">
                  Get In Touch
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-300 text-sm">{contentData.personal.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gold" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-300 text-sm">{contentData.personal.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gold" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-300 text-sm">{contentData.personal.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-3 text-gold" />
                    <div>
                      <p className="font-semibold">LinkedIn</p>
                      <a 
                        href={contentData.personal.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 text-sm hover:text-gold transition-colors"
                      >
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-6">
                  References
                </h3>
                
                <div className="space-y-6">
                  {contentData.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-gold pl-4">
                      <h4 className="font-semibold text-navy">{testimonial.name}</h4>
                      <p className="text-gray-700 text-sm">{testimonial.designation}</p>
                      <p className="text-gray-600 text-sm">{testimonial.organization}</p>
                      <p className="text-gray-500 text-xs mt-1">{testimonial.email}</p>
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

export default Contact

