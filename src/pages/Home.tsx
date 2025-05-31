
import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <section id="about" className="bg-gray-50">
        <AboutSection />
      </section>
      <section id="services" className="bg-white">
        <ServicesSection />
      </section>
      <section id="contact" className="bg-gray-50">
        <ContactSection />
      </section>
    </div>
  );
};

export default Home;
