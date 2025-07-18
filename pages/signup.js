import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Crear Cuenta - Pixan.ai</title>
        <meta name="description" content="Crea tu cuenta en Pixan.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-container">
            <Link href="/">
              <svg width="120" height="35" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-logo">
                <path d="M0 12H3.49722V37.18H0V12Z" fill="#28106A"/>
                <path d="M14.9681 12H18.6612V30.3045H14.9681V12Z" fill="#D34C54"/>
                <path d="M7.27422 12H10.9673V30.3045H7.27422V12Z" fill="#28106A"/>
                <path d="M45.4261 46.8182V10.8182H50.4034V15.0625H50.8295C51.125 14.517 51.5511 13.8864 52.108 13.1705C52.6648 12.4545 53.4375 11.8295 54.4261 11.2955C55.4148 10.75 56.7216 10.4773 58.3466 10.4773C60.4602 10.4773 62.3466 11.0114 64.0057 12.0795C65.6648 13.1477 66.9659 14.6875 67.9091 16.6989C68.8636 18.7102 69.3409 21.1307 69.3409 23.9602C69.3409 26.7898 68.8693 29.2159 67.9261 31.2386C66.983 33.25 65.6875 34.8011 64.0398 35.892C62.392 36.9716 60.5114 37.5114 58.3977 37.5114C56.8068 37.5114 55.5057 37.2443 54.4943 36.7102C53.4943 36.1761 52.7102 35.5511 52.142 34.8352C51.5739 34.1193 51.1364 33.483 50.8295 32.9261H50.5227V46.8182H45.4261ZM50.4205 23.9091C50.4205 25.75 50.6875 27.3636 51.2216 28.75C51.7557 30.1364 52.5284 31.2216 53.5398 32.0057C54.5511 32.7784 55.7898 33.1648 57.2557 33.1648C58.7784 33.1648 60.0511 32.7614 61.0739 31.9545C62.0966 31.1364 62.8693 30.0284 63.392 28.6307C63.9261 27.233 64.1932 25.6591 64.1932 23.9091C64.1932 22.1818 63.9318 20.6307 63.4091 19.2557C62.8977 17.8807 62.125 16.7955 61.0909 16C60.0682 15.2045 58.7898 14.8068 57.2557 14.8068C55.7784 14.8068 54.5284 15.1875 53.5057 15.9489C52.4943 16.7102 51.7273 17.7727 51.2045 19.1364C50.6818 20.5 50.4205 22.0909 50.4205 23.9091Z" fill="#28106A"/>
                <path d="M75.0511 37V10.8182H80.1477V37H75.0511ZM77.625 6.77841C76.7386 6.77841 75.9773 6.48295 75.3409 5.89204C74.7159 5.28977 74.4034 4.57386 74.4034 3.74432C74.4034 2.90341 74.7159 2.1875 75.3409 1.59659C75.9773 0.994317 76.7386 0.693181 77.625 0.693181C78.5114 0.693181 79.267 0.994317 79.892 1.59659C80.5284 2.1875 80.8466 2.90341 80.8466 3.74432C80.8466 4.57386 80.5284 5.28977 79.892 5.89204C79.267 6.48295 78.5114 6.77841 77.625 6.77841Z" fill="#28106A"/>
                <path d="M91.027 10.8182L96.8054 21.0114L102.635 10.8182H108.209L100.044 23.9091L108.277 37H102.703L96.8054 27.2159L90.9247 37H85.3338L93.4815 23.9091L85.4361 10.8182H91.027Z" fill="#28106A"/>
                <path d="M121.014 37.5795C119.355 37.5795 117.855 37.2727 116.514 36.6591C115.173 36.0341 114.111 35.1307 113.327 33.9489C112.554 32.767 112.168 31.3182 112.168 29.6023C112.168 28.125 112.452 26.9091 113.02 25.9545C113.588 25 114.355 24.2443 115.321 23.6875C116.287 23.1307 117.366 22.7102 118.56 22.4261C119.753 22.142 120.969 21.9261 122.207 21.7784C123.776 21.5966 125.048 21.4489 126.026 21.3352C127.003 21.2102 127.713 21.0114 128.156 20.7386C128.599 20.4659 128.821 20.0227 128.821 19.4091V19.2898C128.821 17.8011 128.401 16.6477 127.56 15.8295C126.73 15.0114 125.491 14.6023 123.844 14.6023C122.128 14.6023 120.776 14.983 119.787 15.7443C118.81 16.4943 118.134 17.3295 117.759 18.25L112.969 17.1591C113.537 15.5682 114.366 14.2841 115.457 13.3068C116.56 12.3182 117.827 11.6023 119.259 11.1591C120.69 10.7045 122.196 10.4773 123.776 10.4773C124.821 10.4773 125.929 10.6023 127.099 10.8523C128.281 11.0909 129.384 11.5341 130.406 12.1818C131.44 12.8295 132.287 13.7557 132.946 14.9602C133.605 16.1534 133.935 17.7045 133.935 19.6136V37H128.957V33.4205H128.753C128.423 34.0795 127.929 34.7273 127.27 35.3636C126.611 36 125.764 36.5284 124.73 36.9489C123.696 37.3693 122.457 37.5795 121.014 37.5795ZM122.122 33.4886C123.531 33.4886 124.736 33.2102 125.736 32.6534C126.747 32.0966 127.514 31.3693 128.037 30.4716C128.571 29.5625 128.838 28.5909 128.838 27.5568V24.1818C128.656 24.3636 128.304 24.5341 127.781 24.6932C127.27 24.8409 126.685 24.9716 126.026 25.0852C125.366 25.1875 124.724 25.2841 124.099 25.375C123.474 25.4545 122.952 25.5227 122.531 25.5795C121.543 25.7045 120.639 25.9148 119.821 26.2102C119.014 26.5057 118.366 26.9318 117.878 27.4886C117.401 28.0341 117.162 28.7614 117.162 29.6705C117.162 30.9318 117.628 31.8864 118.56 32.5341C119.491 33.1705 120.679 33.4886 122.122 33.4886Z" fill="#28106A"/>
                <path d="M145.82 21.4545V37H140.723V10.8182H145.615V15.0795H145.939C146.541 13.6932 147.484 12.5795 148.768 11.7386C150.064 10.8977 151.695 10.4773 153.661 10.4773C155.445 10.4773 157.007 10.8523 158.348 11.6023C159.689 12.3409 160.729 13.4432 161.467 14.9091C162.206 16.375 162.575 18.1875 162.575 20.3466V37H157.479V20.9602C157.479 19.0625 156.984 17.5795 155.996 16.5114C155.007 15.4318 153.649 14.892 151.922 14.892C150.74 14.892 149.689 15.1477 148.768 15.6591C147.859 16.1705 147.138 16.9205 146.604 17.9091C146.081 18.8864 145.82 20.0682 145.82 21.4545Z" fill="#28106A"/>
                <path d="M140.7 10.82H145.98V36.99H140.7V10.82Z" fill="#D34C54"/>
              </svg>
            </Link>
            <Link href="/" className="back-link">
              ← Volver al inicio
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-container">
            <div className="signup-section">
              <h1 className="signup-title">Crear Cuenta</h1>
              <p className="signup-subtitle">Únete a la revolución de desarrollo con IA</p>
              
              {/* Dachshund Image */}
              <div className="dachshund-container">
                <img 
                  src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Perro Salchicha"
                  className="dachshund-image"
                />
                <div className="image-caption">
                  <p>¡Hola! Soy tu asistente virtual de Pixan.ai</p>
                  <p className="caption-subtext">Aquí para ayudarte a crear aplicaciones increíbles</p>
                </div>
              </div>

              {/* Coming Soon Message */}
              <div className="coming-soon">
                <h2>¡Próximamente!</h2>
                <p>Estamos trabajando en una experiencia de registro única que revolucionará la forma en que desarrollas aplicaciones web.</p>
                
                <div className="features-preview">
                  <h3>Lo que te espera:</h3>
                  <ul>
                    <li>Dashboard personalizado con herramientas de IA</li>
                    <li>Generación automática de código</li>
                    <li>Deployment instantáneo</li>
                    <li>Colaboración en tiempo real</li>
                    <li>Templates inteligentes</li>
                  </ul>
                </div>

                <div className="notify-section">
                  <p>Déjanos tu email y te notificaremos cuando esté listo:</p>
                  <div className="email-form">
                    <input 
                      type="email" 
                      placeholder="tu@email.com" 
                      className="email-input"
                    />
                    <button className="notify-button">
                      Notificarme
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #ffffff;
          color: #1a1a1a;
        }

        .nav {
          padding: 20px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: translateY(-2px);
        }

        .back-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: #666;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: #28106A;
        }

        .main-content {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          padding: 60px 0;
        }

        .content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .signup-section {
          text-align: center;
        }

        .signup-title {
          font-family: 'Inter', sans-serif;
          font-size: 3.5rem;
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #000000;
          margin-bottom: 16px;
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
        }

        .signup-subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          margin-bottom: 60px;
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
        }

        .dachshund-container {
          margin-bottom: 60px;
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
        }

        .dachshund-image {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .dachshund-image:hover {
          transform: scale(1.05);
        }

        .image-caption {
          text-align: center;
        }

        .image-caption p {
          font-size: 1.1rem;
          color: #28106A;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .caption-subtext {
          font-size: 0.95rem !important;
          color: #6b7280 !important;
          font-weight: 400 !important;
        }

        .coming-soon {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 60px 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
        }

        .coming-soon h2 {
          font-family: 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 400;
          color: #28106A;
          margin-bottom: 24px;
        }

        .coming-soon > p {
          font-size: 1.1rem;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .features-preview {
          margin-bottom: 40px;
          text-align: left;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-preview h3 {
          font-family: 'Inter', sans-serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 20px;
          text-align: center;
        }

        .features-preview ul {
          list-style: none;
          padding: 0;
        }

        .features-preview li {
          font-size: 1rem;
          color: #4a5568;
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
        }

        .features-preview li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #28106A;
          font-weight: bold;
        }

        .notify-section {
          text-align: center;
        }

        .notify-section > p {
          font-size: 1rem;
          color: #4a5568;
          margin-bottom: 24px;
        }

        .email-form {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
        }

        .email-input {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
          min-width: 250px;
        }

        .email-input:focus {
          border-color: #28106A;
        }

        .notify-button {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          padding: 12px 24px;
          background-color: #28106A;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .notify-button:hover {
          background-color: #1e0a4f;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(40, 16, 106, 0.2);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 20px;
          }

          .content-container {
            padding: 0 20px;
          }

          .signup-title {
            font-size: 2.5rem;
          }

          .signup-subtitle {
            font-size: 1.1rem;
          }

          .dachshund-image {
            width: 250px;
            height: 250px;
          }

          .coming-soon {
            padding: 40px 24px;
          }

          .coming-soon h2 {
            font-size: 2rem;
          }

          .email-form {
            flex-direction: column;
            align-items: stretch;
          }

          .email-input {
            min-width: auto;
            width: 100%;
          }

          .notify-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .signup-title {
            font-size: 2rem;
          }

          .dachshund-image {
            width: 200px;
            height: 200px;
          }

          .coming-soon h2 {
            font-size: 1.8rem;
          }

          .features-preview {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}