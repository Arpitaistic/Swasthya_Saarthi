
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VoiceAssistant from '@/components/VoiceAssistant';
import HealthAssessment from '@/components/HealthAssessment';
import HealthRecord from '@/components/HealthRecord';
import Footer from '@/components/Footer';

const Index = () => {
  // Set meta tags for SEO
  useEffect(() => {
    // Update the document title
    document.title = 'SwasthyaSaarthi - Your Rural Health Companion';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'SwasthyaSaarthi is an AI-powered multilingual health assistant for rural communities. ' +
        'Check symptoms, track health records, and get healthcare guidance with voice commands.'
      );
    }
    
    // Add or update Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaTag('og:title', 'SwasthyaSaarthi - Your Rural Health Companion');
    updateMetaTag('og:description', 
      'AI-powered health assistant for rural communities with voice commands, symptom checking, and personalized health tracking.'
    );
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    
    // Add canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <VoiceAssistant />
        <HealthAssessment />
        <HealthRecord />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
