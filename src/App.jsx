import React from 'react';
import Navbar  from './components/Navbar';
import Hero    from './components/Hero';
import About   from './components/About';
import Mission from './components/Mission';
import Squad   from './components/Squad';
import Contact from './components/Contact';
import Footer  from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Mission />
        <Squad />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
