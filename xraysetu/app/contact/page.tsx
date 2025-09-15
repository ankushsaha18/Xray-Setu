'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormError('Please fill out all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);

    setTimeout(() => {
      // This is where you would normally send the data to a server
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after submission
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="font-sans antialiased bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background blobs for a dynamic effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4">
            Connect with Us
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you have questions, feedback, or a collaboration idea, our team is ready to listen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Contact Information Card */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 animate-slide-in-left">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">Our Details</h2>
            <ul className="space-y-8">
              <li className="flex items-start">
                <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <a href="mailto:info@xray-setu.example" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    info@xray-setu.example
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-gray-600 dark:text-gray-400">+91 (555) 123-4567</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Healthcare Innovation Center<br />
                    123 Medical Drive<br />
                    Bhubaneswar, Odisha, India
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Office Hours</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 animate-slide-in-right">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">Send us a Message</h2>
            {isSubmitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800/40 rounded-full flex items-center justify-center animate-bounce-in">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Message Sent Successfully!</h3>
                <p className="text-green-700 dark:text-green-400 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 font-medium rounded-full shadow-md hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors transform hover:scale-105"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  ></textarea>
                </div>

                {formError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{formError}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Partnership Section */}
        <div className="mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-950/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-3 text-blue-800 dark:text-blue-300">Interested in Partnership?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              If you're a healthcare provider, research institution, or technology company interested in partnering with us, we'd love to hear from you. Our team is open to collaboration opportunities to improve healthcare outcomes through AI-powered solutions.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Please contact us at <a href="mailto:partnerships@xray-setu.example" className="font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">partnerships@xray-setu.example</a> with details about your organization and interests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
