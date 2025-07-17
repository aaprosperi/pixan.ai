import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Sparkles, Brain, Code, Zap, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

// Magnetic Cursor Component
const MagneticCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trail, setTrail] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create particle trail
      setTrail(prev => [
        { x: e.clientX, y: e.clientY, id: Date.now() },
        ...prev.slice(0, 8)
      ]);
    };

    const handleMouseEnter = () => setCursorVariant('hover');
    const handleMouseLeave = () => setCursorVariant('default');

    window.addEventListener('mousemove', handleMouseMove);
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* Custom Cursor */}
      <div
        className="cursor"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          transform: cursorVariant === 'hover' ? 'scale(2)' : 'scale(1)',
        }}
      />
      
      {/* Particle Trail */}
      <div className="cursor-trail">
        {trail.map((particle, index) => (
          <div
            key={particle.id}
            className="trail-particle"
            style={{
              left: particle.x - 2,
              top: particle.y - 2,
              opacity: 1 - (index * 0.15),
              transform: `scale(${1 - (index * 0.1)})`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// Morphing Shapes Component
const MorphingShapes = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="morphing-container">
      <div className="morphing-shape shape-1" />
      <div className="morphing-shape shape-2" />
      <div className="morphing-shape shape-3" />
      <div className="morphing-shape shape-4" />
      <div className="liquid-blob blob-1" />
      <div className="liquid-blob blob-2" />
      <div className="liquid-blob blob-3" />
    </div>
  );
};

// Parallax 3D Component
const Parallax3D = ({ children, speed = 0.5 }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isClient) return <div>{children}</div>;

  return (
    <div
      className="parallax-layer"
      style={{
        transform: `translateY(${scrollY * speed}px) rotateX(${scrollY * 0.01}deg)`,
      }}
    >
      {children}
    </div>
  );
};

// Enhanced Text Animation Component with WOW Effects
const EnhancedTextAnimation = ({ text, delay = 0, showCursor = false, effect = 'typewriter' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setIsClient(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !isClient || isComplete) return;

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Add particle effect when typing
        if (effect === 'particles' && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const newParticle = {
            id: Date.now() + Math.random(),
            x: rect.right,
            y: rect.top + rect.height / 2,
          };
          setParticles(prev => [...prev, newParticle]);
          
          // Remove particle after animation
          setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
          }, 1000);
        }
      } else {
        setIsComplete(true);
      }
    }, delay + (currentIndex * (effect === 'fast' ? 15 : effect === 'slow' ? 60 : 30)));

    return () => clearTimeout(timer);
  }, [isVisible, currentIndex, text, delay, isClient, isComplete, effect]);

  if (!isClient) return <span>{text}</span>;

  const getEffectClass = () => {
    switch (effect) {
      case 'glitch': return 'text-glitch';
      case 'neon': return 'text-neon';
      case 'matrix': return 'text-matrix';
      case 'hologram': return 'text-hologram';
      case 'cyber': return 'text-cyber';
      default: return 'simple-text';
    }
  };

  return (
    <span ref={ref} className={`enhanced-text ${getEffectClass()}`}>
      {displayText.split('').map((char, index) => (
        <span 
          key={index} 
          className="char" 
          style={{
            animationDelay: `${index * 0.1}s`,
            '--char-index': index
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {showCursor && !isComplete && isVisible && (
        <span className="enhanced-cursor">|</span>
      )}
      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="text-particle"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}
    </span>
  );
};

// Interactive 3D Card Component
const Interactive3DCard = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setMousePosition({ x: rotateY, y: rotateX });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`interactive-3d-card ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(1.05)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Pixan.ai - Transformando Ideas en Realidad Digital</title>
        <meta name="description" content="Plataforma de desarrollo de aplicaciones web personalizadas con IA. Transformamos ideas en soluciones digitales funcionales." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app-container">
        {/* Magnetic Cursor */}
        <MagneticCursor />

        {/* Morphing Shapes */}
        <MorphingShapes />

        {/* Animated Background */}
        <div className="animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>

        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="nav-container">
            <div className="nav-logo">
              <svg width="120" height="35" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.4261 46.8182V10.8182H50.4034V15.0625H50.8295C51.125 14.517 51.5511 13.8864 52.108 13.1705C52.6648 12.4545 53.4375 11.8295 54.4261 11.2955C55.4148 10.75 56.7216 10.4773 58.3466 10.4773C60.4602 10.4773 62.3466 11.0114 64.0057 12.0795C65.6648 13.1477 66.9659 14.6875 67.9091 16.6989C68.8636 18.7102 69.3409 21.1307 69.3409 23.9602C69.3409 26.7898 68.8693 29.2159 67.9261 31.2386C66.983 33.25 65.6875 34.8011 64.0398 35.892C62.392 36.9716 60.5114 37.5114 58.3977 37.5114C56.8068 37.5114 55.5057 37.2443 54.4943 36.7102C53.4943 36.1761 52.7102 35.5511 52.142 34.8352C51.5739 34.1193 51.1364 33.483 50.8295 32.9261H50.5227V46.8182H45.4261ZM50.4205 23.9091C50.4205 25.75 50.6875 27.3636 51.2216 28.75C51.7557 30.1364 52.5284 31.2216 53.5398 32.0057C54.5511 32.7784 55.7898 33.1648 57.2557 33.1648C58.7784 33.1648 60.0511 32.7614 61.0739 31.9545C62.0966 31.1364 62.8693 30.0284 63.392 28.6307C63.9261 27.233 64.1932 25.6591 64.1932 23.9091C64.1932 22.1818 63.9318 20.6307 63.4091 19.2557C62.8977 17.8807 62.125 16.7955 61.0909 16C60.0682 15.2045 58.7898 14.8068 57.2557 14.8068C55.7784 14.8068 54.5284 15.1875 53.5057 15.9489C52.4943 16.7102 51.7273 17.7727 51.2045 19.1364C50.6818 20.5 50.4205 22.0909 50.4205 23.9091Z" fill="currentColor"/>
                <path d="M75.0511 37V10.8182H80.1477V37H75.0511ZM77.625 6.77841C76.7386 6.77841 75.9773 6.48295 75.3409 5.89204C74.7159 5.28977 74.4034 4.57386 74.4034 3.74432C74.4034 2.90341 74.7159 2.1875 75.3409 1.59659C75.9773 0.994317 76.7386 0.693181 77.625 0.693181C78.5114 0.693181 79.267 0.994317 79.892 1.59659C80.5284 2.1875 80.8466 2.90341 80.8466 3.74432C80.8466 4.57386 80.5284 5.28977 79.892 5.89204C79.267 6.48295 78.5114 6.77841 77.625 6.77841Z" fill="currentColor"/>
                <path d="M91.027 10.8182L96.8054 21.0114L102.635 10.8182H108.209L100.044 23.9091L108.277 37H102.703L96.8054 27.2159L90.9247 37H85.3338L93.4815 23.9091L85.4361 10.8182H91.027Z" fill="currentColor"/>
                <path d="M121.014 37.5795C119.355 37.5795 117.855 37.2727 116.514 36.6591C115.173 36.0341 114.111 35.1307 113.327 33.9489C112.554 32.767 112.168 31.3182 112.168 29.6023C112.168 28.125 112.452 26.9091 113.02 25.9545C113.588 25 114.355 24.2443 115.321 23.6875C116.287 23.1307 117.366 22.7102 118.56 22.4261C119.753 22.142 120.969 21.9261 122.207 21.7784C123.776 21.5966 125.048 21.4489 126.026 21.3352C127.003 21.2102 127.713 21.0114 128.156 20.7386C128.599 20.4659 128.821 20.0227 128.821 19.4091V19.2898C128.821 17.8011 128.401 16.6477 127.56 15.8295C126.73 15.0114 125.491 14.6023 123.844 14.6023C122.128 14.6023 120.776 14.983 119.787 15.7443C118.81 16.4943 118.134 17.3295 117.759 18.25L112.969 17.1591C113.537 15.5682 114.366 14.2841 115.457 13.3068C116.56 12.3182 117.827 11.6023 119.259 11.1591C120.69 10.7045 122.196 10.4773 123.776 10.4773C124.821 10.4773 125.929 10.6023 127.099 10.8523C128.281 11.0909 129.384 11.5341 130.406 12.1818C131.44 12.8295 132.287 13.7557 132.946 14.9602C133.605 16.1534 133.935 17.7045 133.935 19.6136V37H128.957V33.4205H128.753C128.423 34.0795 127.929 34.7273 127.27 35.3636C126.611 36 125.764 36.5284 124.73 36.9489C123.696 37.3693 122.457 37.5795 121.014 37.5795ZM122.122 33.4886C123.531 33.4886 124.736 33.2102 125.736 32.6534C126.747 32.0966 127.514 31.3693 128.037 30.4716C128.571 29.5625 128.838 28.5909 128.838 27.5568V24.1818C128.656 24.3636 128.304 24.5341 127.781 24.6932C127.27 24.8409 126.685 24.9716 126.026 25.0852C125.366 25.1875 124.724 25.2841 124.099 25.375C123.474 25.4545 122.952 25.5227 122.531 25.5795C121.543 25.7045 120.639 25.9148 119.821 26.2102C119.014 26.5057 118.366 26.9318 117.878 27.4886C117.401 28.0341 117.162 28.7614 117.162 29.6705C117.162 30.9318 117.628 31.8864 118.56 32.5341C119.491 33.1705 120.679 33.4886 122.122 33.4886Z" fill="currentColor"/>
                <path d="M145.82 21.4545V37H140.723V10.8182H145.615V15.0795H145.939C146.541 13.6932 147.484 12.5795 148.768 11.7386C150.064 10.8977 151.695 10.4773 153.661 10.4773C155.445 10.4773 157.007 10.8523 158.348 11.6023C159.689 12.3409 160.729 13.4432 161.467 14.9091C162.206 16.375 162.575 18.1875 162.575 20.3466V37H157.479V20.9602C157.479 19.0625 156.984 17.5795 155.996 16.5114C155.007 15.4318 153.649 14.892 151.922 14.892C150.74 14.892 149.689 15.1477 148.768 15.6591C147.859 16.1705 147.138 16.9205 146.604 17.9091C146.081 18.8864 145.82 20.0682 145.82 21.4545Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="nav-links">
              <a href="#services" className="nav-link">Servicios</a>
              <a href="#about" className="nav-link">Acerca</a>
              <a href="#contact" className="nav-link">Contacto</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          {/* Energy Waves */}
          <div className="energy-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
            <div className="wave wave-4"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge interactive">
              <Sparkles className="icon" />
              <span>Powered by AI</span>
            </div>
            
            <h1 className="hero-title">
              <EnhancedTextAnimation text="Transformamos" delay={0} showCursor={true} effect="cyber" />
              <span className="gradient-text">
                <EnhancedTextAnimation text=" ideas " delay={800} effect="hologram" />
              </span>
              <EnhancedTextAnimation text="en" delay={1400} effect="neon" />
              <span className="gradient-text">
                <EnhancedTextAnimation text=" realidad digital" delay={1600} effect="matrix" />
              </span>
            </h1>
            
            <p className="hero-subtitle">
              <EnhancedTextAnimation 
                text="Desarrollamos aplicaciones web personalizadas combinando la potencia de la inteligencia artificial con tecnologías modernas para crear experiencias excepcionales."
                delay={2500}
                effect="particles"
              />
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary interactive">
                Comenzar Proyecto
                <ArrowRight className="icon" />
              </button>
              <button className="btn-secondary interactive">
                Ver Demos
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Brain className="card-icon" />
              <div className="card-content">
                <h3>IA Avanzada</h3>
                <p>Algoritmos inteligentes</p>
              </div>
            </div>
            <div className="floating-card card-2">
              <Code className="card-icon" />
              <div className="card-content">
                <h3>Código Limpio</h3>
                <p>Desarrollo moderno</p>
              </div>
            </div>
            <div className="floating-card card-3">
              <Zap className="card-icon" />
              <div className="card-content">
                <h3>Alto Rendimiento</h3>
                <p>Velocidad optimizada</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Nuestros Servicios</h2>
              <p className="section-subtitle">
                Soluciones tecnológicas innovadoras para impulsar tu negocio
              </p>
            </div>
            
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <Brain />
                </div>
                <h3>Desarrollo con IA</h3>
                <p>Aplicaciones inteligentes que aprenden y se adaptan a las necesidades de tus usuarios</p>
                <div className="service-features">
                  <span>Machine Learning</span>
                  <span>NLP</span>
                  <span>Computer Vision</span>
                </div>
              </div>
              
              <div className="service-card">
                <div className="service-icon">
                  <Code />
                </div>
                <h3>Desarrollo Web</h3>
                <p>Aplicaciones web modernas y escalables usando las últimas tecnologías</p>
                <div className="service-features">
                  <span>React/Next.js</span>
                  <span>Node.js</span>
                  <span>GraphQL</span>
                </div>
              </div>
              
              <div className="service-card">
                <div className="service-icon">
                  <Zap />
                </div>
                <h3>Optimización</h3>
                <p>Mejoramos el rendimiento y la experiencia de usuario de tus aplicaciones</p>
                <div className="service-features">
                  <span>Performance</span>
                  <span>SEO</span>
                  <span>Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="container">
            <div className="about-content">
              <div className="about-text">
                <h2>Acerca de Pixan.ai</h2>
                <p>
                  Somos un equipo apasionado por la tecnología y la innovación. Combinamos 
                  años de experiencia en desarrollo web con las últimas innovaciones en 
                  inteligencia artificial para crear soluciones que transforman negocios.
                </p>
                <p>
                  Cada proyecto es único y merece un enfoque personalizado. Trabajamos 
                  estrechamente con nuestros clientes para entender sus necesidades y 
                  crear soluciones que superen sus expectativas.
                </p>
                <div className="stats">
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Proyectos Completados</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Satisfacción del Cliente</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Soporte Técnico</span>
                  </div>
                </div>
              </div>
              <div className="about-visual">
                <div className="tech-stack">
                  <div className="tech-item">React</div>
                  <div className="tech-item">Next.js</div>
                  <div className="tech-item">TypeScript</div>
                  <div className="tech-item">Node.js</div>
                  <div className="tech-item">Python</div>
                  <div className="tech-item">TensorFlow</div>
                  <div className="tech-item">OpenAI</div>
                  <div className="tech-item">AWS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <div className="contact-content">
              <div className="contact-info">
                <h2>¿Listo para comenzar?</h2>
                <p>
                  Convierte tu idea en realidad. Contáctanos y descubre cómo podemos 
                  ayudarte a construir el futuro digital de tu negocio.
                </p>
                <div className="contact-methods">
                  <div className="contact-method">
                    <a href="mailto:contact@pixan.ai" className="contact-link">
                      <Mail className="icon" />
                      <span>contact@pixan.ai</span>
                    </a>
                  </div>
                  <div className="contact-method">
                    <a href="#" className="contact-link">
                      <Github className="icon" />
                      <span>github.com/pixan-ai</span>
                    </a>
                  </div>
                  <div className="contact-method">
                    <a href="#" className="contact-link">
                      <Linkedin className="icon" />
                      <span>linkedin.com/company/pixan-ai</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-form">
                <form>
                  <div className="form-group">
                    <input type="text" placeholder="Tu nombre" className="interactive" />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Tu email" className="interactive" />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Cuéntanos sobre tu proyecto" rows={4} className="interactive"></textarea>
                  </div>
                  <button type="submit" className="btn-primary interactive">
                    Enviar Mensaje
                    <ArrowRight className="icon" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <svg width="100" height="30" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45.4261 46.8182V10.8182H50.4034V15.0625H50.8295C51.125 14.517 51.5511 13.8864 52.108 13.1705C52.6648 12.4545 53.4375 11.8295 54.4261 11.2955C55.4148 10.75 56.7216 10.4773 58.3466 10.4773C60.4602 10.4773 62.3466 11.0114 64.0057 12.0795C65.6648 13.1477 66.9659 14.6875 67.9091 16.6989C68.8636 18.7102 69.3409 21.1307 69.3409 23.9602C69.3409 26.7898 68.8693 29.2159 67.9261 31.2386C66.983 33.25 65.6875 34.8011 64.0398 35.892C62.392 36.9716 60.5114 37.5114 58.3977 37.5114C56.8068 37.5114 55.5057 37.2443 54.4943 36.7102C53.4943 36.1761 52.7102 35.5511 52.142 34.8352C51.5739 34.1193 51.1364 33.483 50.8295 32.9261H50.5227V46.8182H45.4261ZM50.4205 23.9091C50.4205 25.75 50.6875 27.3636 51.2216 28.75C51.7557 30.1364 52.5284 31.2216 53.5398 32.0057C54.5511 32.7784 55.7898 33.1648 57.2557 33.1648C58.7784 33.1648 60.0511 32.7614 61.0739 31.9545C62.0966 31.1364 62.8693 30.0284 63.392 28.6307C63.9261 27.233 64.1932 25.6591 64.1932 23.9091C64.1932 22.1818 63.9318 20.6307 63.4091 19.2557C62.8977 17.8807 62.125 16.7955 61.0909 16C60.0682 15.2045 58.7898 14.8068 57.2557 14.8068C55.7784 14.8068 54.5284 15.1875 53.5057 15.9489C52.4943 16.7102 51.7273 17.7727 51.2045 19.1364C50.6818 20.5 50.4205 22.0909 50.4205 23.9091Z" fill="currentColor"/>
                  <path d="M75.0511 37V10.8182H80.1477V37H75.0511ZM77.625 6.77841C76.7386 6.77841 75.9773 6.48295 75.3409 5.89204C74.7159 5.28977 74.4034 4.57386 74.4034 3.74432C74.4034 2.90341 74.7159 2.1875 75.3409 1.59659C75.9773 0.994317 76.7386 0.693181 77.625 0.693181C78.5114 0.693181 79.267 0.994317 79.892 1.59659C80.5284 2.1875 80.8466 2.90341 80.8466 3.74432C80.8466 4.57386 80.5284 5.28977 79.892 5.89204C79.267 6.48295 78.5114 6.77841 77.625 6.77841Z" fill="currentColor"/>
                  <path d="M91.027 10.8182L96.8054 21.0114L102.635 10.8182H108.209L100.044 23.9091L108.277 37H102.703L96.8054 27.2159L90.9247 37H85.3338L93.4815 23.9091L85.4361 10.8182H91.027Z" fill="currentColor"/>
                  <path d="M121.014 37.5795C119.355 37.5795 117.855 37.2727 116.514 36.6591C115.173 36.0341 114.111 35.1307 113.327 33.9489C112.554 32.767 112.168 31.3182 112.168 29.6023C112.168 28.125 112.452 26.9091 113.02 25.9545C113.588 25 114.355 24.2443 115.321 23.6875C116.287 23.1307 117.366 22.7102 118.56 22.4261C119.753 22.142 120.969 21.9261 122.207 21.7784C123.776 21.5966 125.048 21.4489 126.026 21.3352C127.003 21.2102 127.713 21.0114 128.156 20.7386C128.599 20.4659 128.821 20.0227 128.821 19.4091V19.2898C128.821 17.8011 128.401 16.6477 127.56 15.8295C126.73 15.0114 125.491 14.6023 123.844 14.6023C122.128 14.6023 120.776 14.983 119.787 15.7443C118.81 16.4943 118.134 17.3295 117.759 18.25L112.969 17.1591C113.537 15.5682 114.366 14.2841 115.457 13.3068C116.56 12.3182 117.827 11.6023 119.259 11.1591C120.69 10.7045 122.196 10.4773 123.776 10.4773C124.821 10.4773 125.929 10.6023 127.099 10.8523C128.281 11.0909 129.384 11.5341 130.406 12.1818C131.44 12.8295 132.287 13.7557 132.946 14.9602C133.605 16.1534 133.935 17.7045 133.935 19.6136V37H128.957V33.4205H128.753C128.423 34.0795 127.929 34.7273 127.27 35.3636C126.611 36 125.764 36.5284 124.73 36.9489C123.696 37.3693 122.457 37.5795 121.014 37.5795ZM122.122 33.4886C123.531 33.4886 124.736 33.2102 125.736 32.6534C126.747 32.0966 127.514 31.3693 128.037 30.4716C128.571 29.5625 128.838 28.5909 128.838 27.5568V24.1818C128.656 24.3636 128.304 24.5341 127.781 24.6932C127.27 24.8409 126.685 24.9716 126.026 25.0852C125.366 25.1875 124.724 25.2841 124.099 25.375C123.474 25.4545 122.952 25.5227 122.531 25.5795C121.543 25.7045 120.639 25.9148 119.821 26.2102C119.014 26.5057 118.366 26.9318 117.878 27.4886C117.401 28.0341 117.162 28.7614 117.162 29.6705C117.162 30.9318 117.628 31.8864 118.56 32.5341C119.491 33.1705 120.679 33.4886 122.122 33.4886Z" fill="currentColor"/>
                  <path d="M145.82 21.4545V37H140.723V10.8182H145.615V15.0795H145.939C146.541 13.6932 147.484 12.5795 148.768 11.7386C150.064 10.8977 151.695 10.4773 153.661 10.4773C155.445 10.4773 157.007 10.8523 158.348 11.6023C159.689 12.3409 160.729 13.4432 161.467 14.9091C162.206 16.375 162.575 18.1875 162.575 20.3466V37H157.479V20.9602C157.479 19.0625 156.984 17.5795 155.996 16.5114C155.007 15.4318 153.649 14.892 151.922 14.892C150.74 14.892 149.689 15.1477 148.768 15.6591C147.859 16.1705 147.138 16.9205 146.604 17.9091C146.081 18.8864 145.82 20.0682 145.82 21.4545Z" fill="currentColor"/>
                </svg>
                <p>Transformando ideas en realidad digital</p>
              </div>
              <div className="footer-links">
                <a href="#services">Servicios</a>
                <a href="#about">Acerca</a>
                <a href="#contact">Contacto</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 Pixan.ai. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --dark-bg: #0a0a0a;
          --card-bg: rgba(255, 255, 255, 0.1);
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
          --border-color: rgba(255, 255, 255, 0.1);
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--dark-bg);
          color: var(--text-primary);
          overflow-x: hidden;
          line-height: 1.6;
          cursor: none;
        }

        /* MAGNETIC CURSOR STYLES */
        .cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          animation: cursorPulse 2s infinite;
        }

        .cursor-trail {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9998;
        }

        .trail-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #667eea, #f093fb);
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          animation: particleGlow 1s ease-out;
        }

        /* MORPHING SHAPES STYLES */
        .morphing-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .morphing-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          animation: morphingAnimation 25s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #f093fb, #f5576c);
          top: 60%;
          right: 20%;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 280px;
          height: 280px;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          bottom: 20%;
          left: 60%;
          animation-delay: 10s;
        }

        .shape-4 {
          width: 180px;
          height: 180px;
          background: linear-gradient(45deg, #667eea, #00f2fe);
          top: 30%;
          right: 10%;
          animation-delay: 15s;
        }

        /* LIQUID BLOBS */
        .liquid-blob {
          position: absolute;
          background: linear-gradient(45deg, #667eea, #f093fb, #4facfe);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          opacity: 0.08;
          animation: liquidMorph 20s ease-in-out infinite;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          top: 20%;
          left: 70%;
          animation-delay: 0s;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          bottom: 30%;
          left: 20%;
          animation-delay: 5s;
        }

        .blob-3 {
          width: 250px;
          height: 250px;
          top: 70%;
          right: 30%;
          animation-delay: 10s;
        }

        /* PARALLAX 3D STYLES */
        .parallax-layer {
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* ENHANCED TEXT ANIMATION STYLES */
        .enhanced-text {
          display: inline-block;
          position: relative;
          z-index: 1;
        }

        .enhanced-cursor {
          color: #667eea;
          animation: blink 1.5s infinite;
          text-shadow: 0 0 10px #667eea;
        }

        .char {
          display: inline-block;
          animation: charReveal 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        /* CYBER EFFECT */
        .text-cyber .char {
          animation: cyberGlitch 0.5s ease-out forwards;
          text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff;
        }

        /* NEON EFFECT */
        .text-neon .char {
          animation: neonGlow 0.5s ease-out forwards;
          text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, 0 0 20px #ff00ff;
        }

        /* MATRIX EFFECT */
        .text-matrix .char {
          animation: matrixRain 0.5s ease-out forwards;
          color: #00ff00;
          text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
        }

        /* HOLOGRAM EFFECT */
        .text-hologram .char {
          animation: hologramFlicker 0.5s ease-out forwards;
          background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* GLITCH EFFECT */
        .text-glitch .char {
          animation: glitchReveal 0.5s ease-out forwards;
          text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
        }

        /* PARTICLE EFFECTS */
        .text-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #667eea, #f093fb);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: particleExplode 1s ease-out forwards;
        }

        /* INTERACTIVE 3D CARD STYLES */
        .interactive-3d-card {
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          will-change: transform;
        }

        .interactive-3d-card:hover {
          z-index: 10;
        }

        .app-container {
          position: relative;
          min-height: 100vh;
        }

        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          background: radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: var(--primary-gradient);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: var(--secondary-gradient);
          top: 60%;
          right: 20%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 150px;
          height: 150px;
          background: var(--accent-gradient);
          bottom: 20%;
          left: 60%;
          animation-delay: 4s;
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: particleFloat 8s linear infinite;
        }

        .particle:nth-child(odd) {
          animation-delay: -4s;
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.8);
          border-bottom: 1px solid var(--border-color);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .nav-logo {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.5rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0 2rem;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          z-index: 2;
          position: relative;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-badge .icon {
          width: 16px;
          height: 16px;
        }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
          position: relative;
          z-index: 2;
          text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }

        .hero-title:hover {
          transform: scale(1.02);
          text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
          transition: all 0.3s ease;
        }

        .gradient-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease-out 0.4s both;
          position: relative;
          z-index: 2;
          text-shadow: 0 0 10px rgba(160, 160, 160, 0.2);
        }

        .hero-subtitle:hover {
          color: var(--text-primary);
          text-shadow: 0 0 15px rgba(160, 160, 160, 0.4);
          transition: all 0.3s ease;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: var(--primary-gradient);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 50px;
          color: var(--text-primary);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: var(--card-bg);
          transform: translateY(-2px);
        }

        .hero-visual {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-card {
          position: absolute;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          animation: cardFloat 6s ease-in-out infinite;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        .card-icon {
          width: 24px;
          height: 24px;
          color: #667eea;
        }

        .card-content h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .card-content p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .services {
          padding: 5rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1.5rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          border-color: rgba(102, 126, 234, 0.5);
        }

        .service-icon {
          width: 60px;
          height: 60px;
          background: var(--primary-gradient);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
        }

        .service-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .service-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .service-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .service-features span {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .about {
          padding: 5rem 0;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-text h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .about-text p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .about-visual {
          position: relative;
        }

        .tech-stack {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .tech-item {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          padding: 1rem;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .tech-item:hover {
          transform: translateY(-2px);
          border-color: rgba(102, 126, 234, 0.5);
        }

        .contact {
          padding: 5rem 0;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .contact-info h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .contact-info p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-method:hover {
          color: var(--text-primary);
        }

        .contact-method .icon {
          width: 20px;
          height: 20px;
        }

        .contact-form {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1.5rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          color: var(--text-primary);
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-secondary);
        }

        .footer {
          border-top: 1px solid var(--border-color);
          padding: 3rem 0 1rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .footer-brand {
          color: var(--text-primary);
        }

        .footer-brand p {
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--text-primary);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .footer-bottom p {
          color: var(--text-secondary);
        }

        .icon {
          width: 20px;
          height: 20px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes particleFloat {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        /* EPIC ANIMATION KEYFRAMES */
        @keyframes cursorPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.5); }
        }

        @keyframes particleGlow {
          0% { 
            opacity: 1; 
            transform: scale(1); 
            box-shadow: 0 0 20px #667eea; 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.5); 
            box-shadow: 0 0 40px #667eea; 
          }
        }

        @keyframes morphingAnimation {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
            border-radius: 50%;
          }
          25% {
            transform: translateX(50px) translateY(-30px) rotate(90deg) scale(1.1);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          }
          50% {
            transform: translateX(-20px) translateY(40px) rotate(180deg) scale(0.9);
            border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
          }
          75% {
            transform: translateX(-40px) translateY(-20px) rotate(270deg) scale(1.2);
            border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
          }
        }

        @keyframes liquidMorph {
          0%, 100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          20% {
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            transform: translateX(20px) translateY(-10px) rotate(45deg) scale(1.05);
          }
          40% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            transform: translateX(-15px) translateY(25px) rotate(90deg) scale(0.95);
          }
          60% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            transform: translateX(10px) translateY(-20px) rotate(135deg) scale(1.1);
          }
          80% {
            border-radius: 45% 55% 40% 60% / 38% 52% 48% 62%;
            transform: translateX(-25px) translateY(15px) rotate(180deg) scale(0.9);
          }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cyberGlitch {
          0% {
            opacity: 0;
            transform: translateY(20px) skewX(-20deg);
            filter: hue-rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-5px) skewX(10deg);
            filter: hue-rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) skewX(0deg);
            filter: hue-rotate(360deg);
          }
        }

        @keyframes neonGlow {
          0% {
            opacity: 0;
            transform: scale(0.5);
            text-shadow: 0 0 5px #ff00ff;
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
            text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
          }
          100% {
            opacity: 1;
            transform: scale(1);
            text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, 0 0 20px #ff00ff;
          }
        }

        @keyframes matrixRain {
          0% {
            opacity: 0;
            transform: translateY(-50px);
            color: #ffffff;
          }
          50% {
            opacity: 0.8;
            transform: translateY(10px);
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
          }
        }

        @keyframes hologramFlicker {
          0% {
            opacity: 0;
            transform: scale(0.8);
            background-position: 0% 50%;
          }
          25% {
            opacity: 0.3;
            transform: scale(1.1);
            background-position: 25% 50%;
          }
          50% {
            opacity: 0.8;
            transform: scale(0.9);
            background-position: 50% 50%;
          }
          75% {
            opacity: 0.6;
            transform: scale(1.05);
            background-position: 75% 50%;
          }
          100% {
            opacity: 1;
            transform: scale(1);
            background-position: 100% 50%;
          }
        }

        @keyframes glitchReveal {
          0% {
            opacity: 0;
            transform: translateX(-10px);
            text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
          }
          20% {
            opacity: 0.8;
            transform: translateX(5px);
            text-shadow: 5px 0 #ff0000, -5px 0 #00ffff;
          }
          40% {
            opacity: 0.6;
            transform: translateX(-3px);
            text-shadow: -3px 0 #ff0000, 3px 0 #00ffff;
          }
          60% {
            opacity: 0.9;
            transform: translateX(2px);
            text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
          }
          80% {
            opacity: 0.7;
            transform: translateX(-1px);
            text-shadow: -1px 0 #ff0000, 1px 0 #00ffff;
          }
          100% {
            opacity: 1;
            transform: translateX(0);
            text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
          }
        }

        @keyframes particleExplode {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5) translate(var(--random-x, 20px), var(--random-y, -20px));
          }
          100% {
            opacity: 0;
            transform: scale(0.5) translate(var(--random-x, 40px), var(--random-y, -40px));
          }
        }

        @keyframes cinematicFade {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.8); 
            filter: blur(10px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0px) scale(1); 
            filter: blur(0px); 
          }
        }

        @keyframes magneticFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes glitchEffect {
          0%, 100% { 
            transform: translateX(0); 
            filter: hue-rotate(0deg); 
          }
          10% { 
            transform: translateX(-2px); 
            filter: hue-rotate(90deg); 
          }
          20% { 
            transform: translateX(2px); 
            filter: hue-rotate(180deg); 
          }
          30% { 
            transform: translateX(-1px); 
            filter: hue-rotate(270deg); 
          }
          40% { 
            transform: translateX(1px); 
            filter: hue-rotate(360deg); 
          }
          50% { 
            transform: translateX(-0.5px); 
            filter: hue-rotate(45deg); 
          }
        }

        @keyframes hologramShimmer {
          0%, 100% {
            background-position: 0% 50%;
            opacity: 1;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.8;
          }
        }

        /* ADDITIONAL EPIC EFFECTS */
        .interactive {
          position: relative;
          overflow: hidden;
        }

        .interactive::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .interactive:hover::before {
          left: 100%;
        }

        .service-card {
          position: relative;
          overflow: hidden;
        }

        .service-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover::after {
          opacity: 1;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: var(--text-primary);
        }

        .contact-method {
          padding: 1rem;
          border-radius: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .contact-method:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        /* ENHANCED BUTTONS */
        .btn-primary {
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-secondary {
          position: relative;
          overflow: hidden;
        }

        .btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s;
        }

        .btn-secondary:hover::before {
          left: 100%;
        }

        /* CINEMATIC SECTION TRANSITIONS */
        .services {
          animation: cinematicFade 1s ease-out;
        }

        .about {
          animation: cinematicFade 1s ease-out 0.2s both;
        }

        .contact {
          animation: cinematicFade 1s ease-out 0.4s both;
        }

        /* GLITCH EFFECT ON HOVER */
        .hero-title:hover {
          animation: glitchEffect 0.5s ease-in-out;
        }

        .section-title:hover {
          animation: glitchEffect 0.3s ease-in-out;
        }

        /* HOLOGRAPHIC SHIMMER EFFECT */
        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hologramShimmer 3s ease-in-out infinite;
        }

        /* ENERGY WAVES */
        .energy-waves {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .wave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid transparent;
          border-radius: 50%;
          opacity: 0;
          animation: energyWave 4s ease-out infinite;
        }

        .wave-1 {
          width: 200px;
          height: 200px;
          border-color: rgba(102, 126, 234, 0.3);
          animation-delay: 0s;
        }

        .wave-2 {
          width: 400px;
          height: 400px;
          border-color: rgba(240, 147, 251, 0.3);
          animation-delay: 1s;
        }

        .wave-3 {
          width: 600px;
          height: 600px;
          border-color: rgba(79, 172, 254, 0.3);
          animation-delay: 2s;
        }

        .wave-4 {
          width: 800px;
          height: 800px;
          border-color: rgba(0, 242, 254, 0.3);
          animation-delay: 3s;
        }

        @keyframes energyWave {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.1);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          70% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* MOBILE OPTIMIZATIONS */
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
          
          .cursor,
          .cursor-trail {
            display: none;
          }
          
          .morphing-shape,
          .liquid-blob {
            opacity: 0.05;
          }
          
          .nav-links {
            display: none;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .about-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-content {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .floating-card {
            display: none;
          }

          .energy-waves {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 1rem;
          }

          .hero {
            padding: 0 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .hero-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}