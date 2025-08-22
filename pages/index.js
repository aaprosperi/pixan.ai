import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function HomePage() {
  const [displayText, setDisplayText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  
  const words = ['AI', 'pixan', 'future', 'innovation'];
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
    }
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (typeof window !== 'undefined') {
        mouseX.set((clientX - window.innerWidth / 2) / 50);
        mouseY.set((clientY - window.innerHeight / 2) / 50);
      }
      setMousePosition({ x: clientX, y: clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  useEffect(() => {
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeout;
    
    const typeWriter = () => {
      const currentWord = words[currentWordIndex];
      
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        
        if (currentCharIndex === currentWord.length) {
          isDeleting = true;
          timeout = setTimeout(typeWriter, 2000);
        } else {
          timeout = setTimeout(typeWriter, 100);
        }
      } else {
        setDisplayText(currentWord.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          timeout = setTimeout(typeWriter, 500);
        } else {
          timeout = setTimeout(typeWriter, 50);
        }
      }
    };
    
    typeWriter();
    return () => clearTimeout(timeout);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode);
    }
  };

  const services = [
    {
      id: 'promptBoost',
      icon: '⚡',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.1
    },
    {
      id: 'multiLLM',
      icon: '🧠',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      id: 'ia60',
      icon: '🚀',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.3
    },
    {
      id: 'pixanLabs',
      icon: '🔬',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
    }
  ];

  const FloatingParticles = () => (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ 
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>Pixan.ai - Collaborative genAI</title>
        <meta name="description" content="Next-generation AI platform for innovation and collaboration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        <FloatingParticles />
        
        <motion.header 
          className="header glass"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <nav className="nav">
            <motion.div 
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="logo-text">pixan.ai</div>
            </motion.div>
            
            <ul className="nav-links">
              {['about', 'projects', 'contact'].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <a href={`#${item}`} className="nav-link">{t(`landing.${item}`)}</a>
                </motion.li>
              ))}
              <motion.li whileHover={{ scale: 1.1 }}>
                <a href="https://github.com/aaprosperi" className="nav-link github-link">
                  <span className="github-icon">⚡</span> GitHub
                </a>
              </motion.li>
            </ul>
            
            <div className="header-actions">
              <motion.button
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.button>
              <LanguageSelector />
            </div>
          </nav>
        </motion.header>

        <main className="main">
          <motion.section 
            ref={heroRef}
            className="hero"
            style={{ opacity, scale }}
          >
            <motion.div 
              className="hero-background"
              style={{
                x: springX,
                y: springY,
              }}
            />
            
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="gradient-text">{t('landing.title')}</span>
            </motion.h1>
            
            <motion.p 
              className="hero-powered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="powered-text">{t('landing.poweredBy')} </span>
              <span className="typewriter">
                {displayText}
                <span className="cursor">|</span>
              </span>
            </motion.p>
            
            <motion.div 
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="cta-button primary"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="button-text">Get Started</span>
                <span className="button-glow"></span>
              </motion.button>
              
              <motion.button
                className="cta-button secondary"
                whileHover={{ 
                  scale: 1.05,
                  background: "rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="button-text">Learn More</span>
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="scroll-indicator"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="scroll-text">Scroll to explore</span>
              <motion.span 
                className="scroll-arrow"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >↓</motion.span>
            </motion.div>
          </motion.section>

          <section className="services">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="gradient-text">Revolutionary AI Services</span>
            </motion.h2>
            
            <div className="services-grid">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="service-card glass"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: service.delay, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
                  }}
                >
                  <motion.div 
                    className="service-icon-wrapper"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="service-icon">{service.icon}</span>
                    <div className={`icon-background bg-gradient-to-br ${service.gradient}`}></div>
                  </motion.div>
                  
                  <h3 className="service-title">
                    {t(`landing.services.${service.id}.title`)}
                  </h3>
                  
                  <p className="service-description">
                    {t(`landing.services.${service.id}.description`)}
                  </p>
                  
                  <motion.button
                    className="service-button"
                    whileHover={{ 
                      scale: 1.05,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="button-text">{t(`landing.services.${service.id}.button`)}</span>
                    <motion.span 
                      className="button-arrow"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >→</motion.span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.footer 
            className="footer glass"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="footer-text">{t('landing.footer')}</p>
            <div className="footer-links">
              <motion.a 
                href="/api-admin" 
                className="admin-link"
                whileHover={{ 
                  scale: 1.05,
                  background: "rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {t('landing.adminButton')}
              </motion.a>
            </div>
          </motion.footer>
        </main>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .app-container {
          min-height: 100vh;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow-x: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .app-container.light {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #1a1a1a;
        }
        
        .app-container.dark {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
        }
        
        .particles-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          filter: blur(1px);
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 16px;
        }
        
        .dark .glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        
        .header {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1200px;
          padding: 1rem 2rem;
          z-index: 1000;
        }
        
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        
        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .dark .logo-text {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        
        .nav-link {
          color: inherit;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .github-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .github-icon {
          display: inline-block;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .dark-mode-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
          color: inherit;
        }
        
        .dark-mode-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .main {
          padding-top: 120px;
          position: relative;
          z-index: 2;
        }
        
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem;
          position: relative;
        }
        
        .hero-background {
          position: absolute;
          inset: -50%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .hero-powered {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          margin-bottom: 3rem;
          opacity: 0.9;
        }
        
        .typewriter {
          font-weight: 600;
          color: #764ba2;
        }
        
        .dark .typewriter {
          color: #f093fb;
        }
        
        .cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .hero-cta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .cta-button {
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cta-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .cta-button.secondary {
          background: transparent;
          color: inherit;
          border: 2px solid currentColor;
        }
        
        .button-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
          border-radius: 50px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
          filter: blur(10px);
        }
        
        .cta-button:hover .button-glow {
          opacity: 0.7;
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.7;
        }
        
        .scroll-text {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .scroll-arrow {
          font-size: 1.5rem;
        }
        
        .services {
          padding: 5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          text-align: center;
          margin-bottom: 4rem;
          font-weight: 700;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .service-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .icon-background {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0.2;
        }
        
        .service-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          z-index: 1;
          position: relative;
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .service-description {
          opacity: 0.8;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .service-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-arrow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .footer {
          margin: 5rem 2rem 2rem;
          padding: 2rem;
          text-align: center;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .footer-text {
          margin-bottom: 1rem;
          opacity: 0.8;
        }
        
        .admin-link {
          color: inherit;
          text-decoration: none;
          padding: 0.8rem 1.5rem;
          border: 2px solid currentColor;
          border-radius: 25px;
          display: inline-block;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 768px) {
          .header {
            width: 95%;
            padding: 1rem;
            top: 10px;
          }
          
          .nav {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          
          .hero {
            padding: 1rem;
          }
          
          .hero-title {
            font-size: clamp(2rem, 12vw, 3.5rem);
          }
          
          .services {
            padding: 3rem 1rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .service-card {
            padding: 2rem;
          }
        }
        
        @media (hover: hover) and (pointer: fine) {
          .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          }
        }
      `}</style>
    </>
  );
}