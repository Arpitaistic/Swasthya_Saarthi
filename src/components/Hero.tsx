
import React from 'react';
import { ArrowRight, Mic } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column with text */}
          <div className="animate-fade-in-left">
            <h1 className="text-4xl md:text-5xl font-bold text-swasthya-dark mb-4">
              Your Rural Health
              <span className="text-swasthya-primary block mt-1">Companion</span>
            </h1>
            <p className="text-gray-600 md:text-lg mb-8">
              SwasthyaSaarthi is an AI-powered multilingual platform that acts as your personal health assistant. Check symptoms, track health records, and get healthcare guidance - all with your voice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#voice" className="btn-primary flex items-center justify-center">
                <Mic className="mr-2 h-5 w-5" />
                Start Voice Check
              </a>
              <a href="#services" className="btn-secondary flex items-center justify-center">
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>

            <div className="mt-10 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/24.jpg" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-swasthya-primary">10,000+</span> rural citizens helped
              </div>
            </div>
          </div>

          {/* Right column with illustration */}
          <div className="hidden md:block relative animate-fade-in-right">
            <div className="relative">
              <div className="absolute -top-16 -right-8 w-32 h-32 bg-swasthya-pink rounded-full opacity-70 animate-float"></div>
              <div className="absolute bottom-12 -left-12 w-24 h-24 bg-swasthya-green/20 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
              <div className="absolute -bottom-10 right-20 w-16 h-16 bg-swasthya-yellow rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
              
              <div className="relative z-10 rounded-2xl shadow-lg bg-white p-2 border border-gray-100">
                <img 
                  src="https://img.freepik.com/free-vector/doctor-online-appointment-cartoon-web-icon-digital-healthcare-service-treatment-consultation-application-professional-physician-internet-ambulance-medical-support_335657-3432.jpg?w=900&t=st=1713050553~exp=1713051153~hmac=0daed8b79ca6c69a6baa3b3cf6e1bb6d2a94071c67ca6ea82d93afa3c21e7a7e" 
                  alt="Healthcare Illustration" 
                  className="rounded-xl" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="mt-16 md:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="health-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-swasthya-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swasthya-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M3 16.5h18" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-swasthya-dark">Voice First</h3>
              <p className="text-gray-600">Speak naturally in your language for easy access.</p>
            </div>
            
            <div className="health-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-swasthya-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swasthya-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-swasthya-dark">Offline First</h3>
              <p className="text-gray-600">Works without constant internet connection.</p>
            </div>
            
            <div className="health-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-swasthya-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swasthya-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-swasthya-dark">AI Powered</h3>
              <p className="text-gray-600">Smart symptom prediction and health guidance.</p>
            </div>
            
            <div className="health-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-swasthya-primary/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-swasthya-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-swasthya-dark">Multilingual</h3>
              <p className="text-gray-600">Support for multiple regional languages.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
