import React from 'react';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Pixan.ai</title>
        <meta name="description" content="Hello World Pixan - Pixan.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="text-center px-8">
          <h1 className="hello-world">
            Hello World Pixan
          </h1>
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
        
        .hello-world {
          font-family: 'Inter', sans-serif;
          font-size: 4.5rem;
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #000000;
          margin: 0;
          position: relative;
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .hello-world::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 1px;
          background-color: #e5e5e5;
          animation: lineExpand 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s both;
        }
        
        .hello-world:hover {
          transform: translateY(-2px);
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
        
        @keyframes lineExpand {
          from {
            width: 0;
          }
          to {
            width: 60px;
          }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .hello-world {
            font-size: 3rem;
          }
        }
        
        @media (max-width: 480px) {
          .hello-world {
            font-size: 2.5rem;
            letter-spacing: -0.02em;
          }
          
          .hello-world::after {
            width: 40px;
          }
        }
        
        /* Subtle background texture */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>
    </>
  );
}
