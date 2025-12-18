import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import AppPreview from '../components/AppPreview';

// SVG Icons for LLMs
const LLMIcons = {
  claude: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M4.709 15.955l4.397-2.469.074-.215-.074-.119h-.237l-.736-.045-2.512-.067-2.18-.091-2.111-.113-.533-.113-.355-.27.05-.328.449-.3.638.056 1.415.097 2.122.147 1.539.09 2.281.238h.363l.05-.147-.124-.091-.096-.09-2.197-1.49-2.377-1.572-1.244-.906-.673-.459-.341-.43-.146-.939.61-.673.82.056.21.056.832.64 1.777 1.376 2.32 1.708.34.283.136-.095.017-.069-.153-.254-1.262-2.281-1.346-2.322-.6-.962-.159-.577a2.805 2.805 0 01-.095-.679l.696-.945.924-.237.928.125.391.34.577 1.318.933 2.076 1.449 2.825.424.837.227.776.084.238h.147v-.136l.119-1.59.22-1.953.216-2.514.073-.707.35-.848.697-.459.543.261.447.64-.063.412-.266 1.726-.519 2.707-.341 1.81h.199l.226-.225.918-1.217 1.539-1.924.679-.765.792-.843.509-.402h.962l.708 1.053-.317 1.087-.991 1.256-.82 1.064-1.177 1.585-.735 1.268.067.101.175-.017 2.661-.565 1.436-.261 1.715-.295.776.362.084.369-.306.752-1.833.453-2.15.43-3.203.758-.039.028.045.056 1.443.893 1.845 1.206 1.118.867.526.67.175.68-.379.792-.906.17-.214-.186-.821-.536-1.705-1.087-1.806-1.206-.13-.045-.023.068.377.793 1.232 2.299 1.068 2.123.458.985.163.543.011.555-.401.85-.906.328-.78-.215-.608-.566-.798-1.56-1.068-1.885-.815-1.596-.146-.102-.017.08-.073 1.624-.11 1.976-.136 1.863-.367.73-.634.474-.57-.226-.306-.412.067-.486.316-.73.642-1.263.855-1.556.498-.975.119-.136-.073-.068-.538.067-1.334.192-1.624.186-.9.102-.696-.056-.508-.317-.277-.463.357-.696.628-.605.815-.373.889-.237 1.245-.084 2.287-.045.305.017.045-.136-.271-.237-1.334-.887-.85-.611-.498-.423-.17-.486.05-.657.628-.497.657.033.754.373.703.509.855.67 1.117.792.294.305.158-.033.05-.17-.248-1.038-.458-1.658-.396-1.738-.09-.696.118-.474.339-.34.491-.079.536.226.373.418.17.577.32 1.295.713 2.213.538 1.545h.118l.096-.17.407-1.307.57-1.556.554-1.511.367-.588.475-.328.564.079.395.395.028.463-.107.418-.497 1.227-.713 1.613-.271.696-.062.395.107.05.243-.112 1.006-.486.963-.418 1.068-.395.696.017.373.271.214.373-.084.565-.463.474-.746.35-.815.305-.833.282-1.089.192h-.418l-.068.146.186.17.766.679.815.737.747.73.175.588-.09.611-.396.497-.599.068-.44-.226-.778-.696-.815-.764-.186-.102-.118.09v.225l.09.951.052 1.124-.045.963-.248.588-.435.35-.508-.045-.389-.293-.068-.536.158-.566.175-.781.084-.975-.039-.462-.101-.068-.186.112-.747.85-.929.929-.855.793-.622.39-.69.08-.553-.367-.192-.588.214-.622.412-.406.566-.384.894-.566.781-.525.107-.169-.068-.102-.361.023-1.312.124-1.255.067-.951-.033-.588-.192-.475-.35-.113-.497.192-.53.534-.339z"/>
    </svg>
  ),
  gpt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  ),
  gemini: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M12 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.648 0 12 0zm0 2.4c5.28 0 9.6 4.32 9.6 9.6s-4.32 9.6-9.6 9.6S2.4 17.28 2.4 12 6.72 2.4 12 2.4zm0 1.92a7.68 7.68 0 100 15.36 7.68 7.68 0 000-15.36zm0 2.88a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88zm-3.84 2.88a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88zm7.68 0a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88zm-3.84 2.88a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"/>
    </svg>
  ),
  perplexity: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.25l8.25 4.688v9.124L12 20.75l-8.25-4.688V6.938L12 2.25zm0 3a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zm0 2.25a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/>
    </svg>
  ),
  deepseek: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  grok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  kimi: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-14a1 1 0 00-1 1v4.59l-2.29-2.3a1 1 0 00-1.42 1.42l4 4a1 1 0 001.42 0l4-4a1 1 0 00-1.42-1.42L13 11.59V7a1 1 0 00-1-1z"/>
    </svg>
  )
};

// LLM configurations - Actualizado Dic 18, 2025
const LLM_CONFIG = {
  claude: { name: 'Claude Opus 4.5', modelId: 'anthropic/claude-opus-4-5', color: '#D4A574', bgColor: '#FDF6E3', context: '200K', inputPrice: 0.005, outputPrice: 0.025, inGroup: true },
  gpt: { name: 'GPT-5.2', modelId: 'openai/gpt-5.2', color: '#10A37F', bgColor: '#E6F7F1', context: '400K', inputPrice: 0.00175, outputPrice: 0.014, inGroup: true },
  gemini: { name: 'Gemini 3 Flash', modelId: 'google/gemini-3-flash-preview', color: '#4285F4', bgColor: '#E8F0FE', context: '1M', inputPrice: 0.0005, outputPrice: 0.003, inGroup: true },
  perplexity: { name: 'Sonar Pro', modelId: 'perplexity/sonar-pro', color: '#20B2AA', bgColor: '#E6F7F6', context: '200K', inputPrice: 0.002, outputPrice: 0.002, inGroup: false },
  deepseek: { name: 'DeepSeek v3.2', modelId: 'deepseek/deepseek-v3.2-exp-thinking', color: '#4F46E5', bgColor: '#EEF2FF', context: '164K', inputPrice: 0.00028, outputPrice: 0.00042, inGroup: false },
  grok: { name: 'Grok 4.1', modelId: 'xai/grok-4.1-fast-reasoning', color: '#000000', bgColor: '#F5F5F5', context: '2M', inputPrice: 0.0002, outputPrice: 0.0005, inGroup: true },
  kimi: { name: 'Kimi K2', modelId: 'moonshotai/kimi-k2-thinking', color: '#7C3AED', bgColor: '#F3E8FF', context: '262K', inputPrice: 0.0006, outputPrice: 0.0025, inGroup: false }
};

const IMAGE_CONFIG = {
  none: { label: '✕ None', price: 0 },
  schema: { label: '📐 Schema', price: 0.02, color: '#374151', bgColor: '#F3F4F6' },
  infographic: { label: '📊 Infographic', price: 0.03, color: '#f59e0b', bgColor: '#fffbeb' },
  ultrarealistic: { label: '🖼️ Realistic', price: 0.04, color: '#8b5cf6', bgColor: '#f3e8ff' }
};

const GROUP_LLMS = Object.keys(LLM_CONFIG).filter(k => LLM_CONFIG[k].inGroup);
const AUTH_KEY = 'pixan_genai_auth';

const renderMarkdown = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeContent = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) { inCodeBlock = true; codeContent = ''; }
      else { elements.push(<pre key={i} className="code-block"><code>{codeContent}</code></pre>); inCodeBlock = false; }
      return;
    }
    if (inCodeBlock) { codeContent += (codeContent ? '\n' : '') + line; return; }
    
    if (line.startsWith('### ')) elements.push(<h4 key={i} className="md-h3">{line.slice(4)}</h4>);
    else if (line.startsWith('## ')) elements.push(<h3 key={i} className="md-h2">{line.slice(3)}</h3>);
    else if (line.startsWith('# ')) elements.push(<h2 key={i} className="md-h1">{line.slice(2)}</h2>);
    else if (line.startsWith('- ') || line.startsWith('* ')) elements.push(<li key={i} className="md-li">{line.slice(2)}</li>);
    else if (line.match(/^\d+\. /)) elements.push(<li key={i} className="md-li-num">{line.replace(/^\d+\. /, '')}</li>);
    else if (line.startsWith('> ')) elements.push(<blockquote key={i} className="md-quote">{line.slice(2)}</blockquote>);
    else if (line.trim() === '---') elements.push(<hr key={i} className="md-hr" />);
    else if (line.trim()) {
      let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code class="inline-code">$1</code>');
      elements.push(<p key={i} className="md-p" dangerouslySetInnerHTML={{ __html: processed }} />);
    } else elements.push(<br key={i} />);
  });
  return elements;
};

const PixanLogo = () => (
  <svg width="100" height="28" viewBox="0 0 163 47" fill="none" xmlns="http://www.w3.org/2000/svg">
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
);

export default function GenAI() {
  const [prompt, setPrompt] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('claude');
  const [responseMode, setResponseMode] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageMode, setImageMode] = useState('none');
  const [attachments, setAttachments] = useState([]);
  
  const [conversationHistory, setConversationHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [parallelStreams, setParallelStreams] = useState({});
  const [integrationResult, setIntegrationResult] = useState(null);
  const [imageResult, setImageResult] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [lastResponseContent, setLastResponseContent] = useState(null);
  const [lastResponseQuestion, setLastResponseQuestion] = useState(null);
  const [generatingPostImage, setGeneratingPostImage] = useState(false);
  
  const [sessionTokens, setSessionTokens] = useState({ input: 0, output: 0 });
  const [sessionCost, setSessionCost] = useState(0);
  const [gatewayBalance, setGatewayBalance] = useState(null);

  // App Preview states
  const [showAppPreview, setShowAppPreview] = useState(false);
  const [previewCode, setPreviewCode] = useState('');
  const [previewFramework, setPreviewFramework] = useState('html');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showLLMDropdown, setShowLLMDropdown] = useState(false);
  
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/credits');
      if (response.ok) { const data = await response.json(); setGatewayBalance(data.credits); }
    } catch (error) { console.error('Error fetching credits:', error); }
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(AUTH_KEY);
    if (savedAuth) { setIsAuthenticated(true); fetchBalance(); }
    else setShowAuthModal(true);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, parallelStreams, integrationResult]);
  useEffect(() => {
    const handleClick = (e) => { if (!e.target.closest('.llm-select')) setShowLLMDropdown(false); };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const estimateTokens = (text) => Math.ceil((text || '').length / 4);
  const calculateCost = (inputTokens, outputTokens, llmKey) => {
    const config = LLM_CONFIG[llmKey];
    if (!config) return 0;
    return (inputTokens / 1000) * config.inputPrice + (outputTokens / 1000) * config.outputPrice;
  };

  const handleAuth = async (e) => {
    e?.preventDefault();
    if (!authPassword.trim() || isAuthenticating) return;
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-password': authPassword },
        body: JSON.stringify({ model: 'anthropic/claude-sonnet-4.5', messages: [{ role: 'user', content: 'test' }] })
      });
      if (response.status === 401) { setAuthError('Invalid password'); setAuthPassword(''); return; }
      sessionStorage.setItem(AUTH_KEY, authPassword);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      fetchBalance();
    } catch (error) { setAuthError('Connection error'); }
    finally { setIsAuthenticating(false); }
  };

  const getAuthPassword = () => sessionStorage.getItem(AUTH_KEY) || '';

  const buildSystemPrompt = (llmKey, isGroupMode, imgMode, history) => {
    const parts = [`You are ${LLM_CONFIG[llmKey].name}, an expert AI assistant.`];
    if (isGroupMode) parts.push('CONTEXT: This is a SUPERVISED GROUP query where 4 LLMs (Claude, GPT, Gemini, Grok) respond INDEPENDENTLY to the same prompt. Each LLM provides its own unique analysis. Your response will be integrated with others by Claude. Focus on your unique perspective. Be concise but insightful.');
    if (imgMode === 'schema') parts.push('NOTE: A TECHNICAL SCHEMA diagram will be generated. Structure your response with clear technical components, relationships, and hierarchies that can be visualized as a 2D/3D technical diagram with lines and geometric shapes.');
    else if (imgMode === 'infographic') parts.push('NOTE: An INFOGRAPHIC will be generated. Structure your response with clear key points and sections that can be easily visualized.');
    else if (imgMode === 'ultrarealistic') parts.push('NOTE: A PROFESSIONAL PHOTOGRAPH will be generated from your response (NOT an illustration or infographic). Describe a REAL-WORLD SCENE, object, or moment that could be captured with a professional camera. Think photojournalism, National Geographic quality. Focus on visual elements that exist in reality: people, places, objects, actions, lighting, composition. Your description will be photographed as if real.');
    if (history.length > 0) parts.push('Continue the conversation naturally.');
    return parts.join('\n\n');
  };

  const streamLLM = async (llmKey, message, systemPrompt, onChunk, signal) => {
    const modelId = LLM_CONFIG[llmKey].modelId;
    const msgs = [];
    if (systemPrompt) msgs.push({ role: 'system', content: systemPrompt });
    conversationHistory.forEach(h => {
      msgs.push({ role: 'user', content: h.user });
      if (h.assistant) msgs.push({ role: 'assistant', content: h.assistant });
    });
    
    let userContent = message;
    if (attachments.length > 0) {
      userContent = [{ type: 'text', text: message }];
      attachments.forEach(att => {
        if (att.type.startsWith('image/')) {
          userContent.push({ type: 'image_url', image_url: { url: att.data } });
        }
      });
    }
    msgs.push({ role: 'user', content: userContent });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-password': getAuthPassword() },
      body: JSON.stringify({ model: modelId, messages: msgs }),
      signal
    });

    if (response.status === 401) {
      sessionStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      setShowAuthModal(true);
      throw new Error('Session expired');
    }
    if (!response.ok) { const error = await response.json(); throw new Error(error.error || 'API Error'); }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) { fullContent += parsed.content; onChunk(fullContent); }
          } catch (e) {}
        }
      }
    }
    return fullContent;
  };

  const generateImage = async (content, question, mode) => {
    const prompts = {
      schema: 'Create a technical SCHEMA diagram with clean lines, geometric shapes, and maximum 3 colors (black, gray, one accent). Show components, connections, and hierarchy. Style: technical blueprint, 2D or isometric 3D, functional over aesthetic. No decorative elements.',
      infographic: 'Create a professional infographic with icons, sections, and clear typography. Style: modern, minimalist, business-professional.',
      ultrarealistic: 'IMPORTANT: Create a REAL PHOTOGRAPH, not an illustration, drawing, or infographic. This must look like it was taken with a professional camera. Style: Ultra-realistic photography, 8K resolution, shot with professional DSLR camera (Canon EOS R5 or Sony A7R IV), cinematic lighting, photojournalistic quality, real-world textures, natural lighting and shadows, authentic skin tones and materials, sharp focus with natural depth of field, bokeh effect if appropriate. The scene must represent the content as if captured in real life. NO artistic interpretations, NO illustrations, NO graphics, NO text overlays - ONLY pure photography. Think: National Geographic, professional photojournalism, stock photography quality.'
    };
    
    const response = await fetch('/api/generate-infographic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-password': getAuthPassword() },
      body: JSON.stringify({ prompt: `${prompts[mode]}\n\nContent:\n${content}`, context: { question, mode } })
    });
    if (!response.ok) throw new Error('Image generation failed');
    return await response.json();
  };

  const trackTokens = (inputText, outputText, llmKey) => {
    const inputTokens = estimateTokens(inputText);
    const outputTokens = estimateTokens(outputText);
    const cost = calculateCost(inputTokens, outputTokens, llmKey);
    setSessionTokens(prev => ({ input: prev.input + inputTokens, output: prev.output + outputTokens }));
    setSessionCost(prev => prev + cost);
    return { inputTokens, outputTokens, cost };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Mostrar feedback visual temporal
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = '#4caf50';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 1500);
    }).catch(err => {
      console.error('Error copying:', err);
      alert('Error al copiar el texto');
    });
  };

  // Detectar si el contenido tiene código web
  const detectWebCode = (content) => {
    const patterns = {
      html: /```html|<!DOCTYPE|<html|<body|<div/i,
      react: /```jsx|```react|import React|from ['"]react['"]/i,
      vue: /```vue|createApp|Vue\.|new Vue/i,
      javascript: /```javascript|```js|function |const |let |var /i,
      css: /```css|@media|\.class|#id|\{[^}]*:[^}]*\}/
    };

    for (const [framework, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        return framework;
      }
    }
    return null;
  };

  // Extraer código de bloques markdown
  const extractCode = (content, framework) => {
    const codeBlockRegex = /```(?:html|jsx|react|vue|javascript|js|css)?\n?([\s\S]*?)```/gi;
    const matches = [...content.matchAll(codeBlockRegex)];

    if (matches.length > 0) {
      // Si hay múltiples bloques, concatenar (útil para CSS separado)
      return matches.map(m => m[1].trim()).join('\n\n');
    }

    // Si no hay bloques de código, intentar detectar código sin formato
    if (content.includes('<html') || content.includes('<!DOCTYPE')) {
      return content;
    }

    return null;
  };

  // Abrir preview de aplicación
  const openAppPreview = (content) => {
    const framework = detectWebCode(content);
    if (framework) {
      const code = extractCode(content, framework);
      if (code) {
        setPreviewCode(code);
        setPreviewFramework(framework);
        setShowAppPreview(true);
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setCurrentPhase(null);
  };

  const handleSingleMode = async (userMessage, signal) => {
    const systemPrompt = buildSystemPrompt(selectedLLM, false, imageMode, conversationHistory);
    setMessages(prev => [...prev, { type: 'llm', llm: selectedLLM, content: '', streaming: true }]);

    const result = await streamLLM(selectedLLM, userMessage, systemPrompt, (content) => {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'llm', llm: selectedLLM, content, streaming: true };
        return updated;
      });
    }, signal);

    const tokenInfo = trackTokens(userMessage, result, selectedLLM);
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { type: 'llm', llm: selectedLLM, content: result, streaming: false, tokens: tokenInfo };
      return updated;
    });
    setConversationHistory(prev => [...prev, { user: userMessage, assistant: result }]);
    return result;
  };

  const handleGroupMode = async (userMessage, signal) => {
    const llmKeys = GROUP_LLMS;
    setParallelStreams(llmKeys.reduce((acc, key) => ({ ...acc, [key]: { content: '', status: 'pending' } }), {}));
    setIntegrationResult(null);
    setCurrentPhase('collecting');

    const promises = llmKeys.map(async (llmKey) => {
      try {
        setParallelStreams(prev => ({ ...prev, [llmKey]: { ...prev[llmKey], status: 'streaming' } }));
        const systemPrompt = buildSystemPrompt(llmKey, true, imageMode, conversationHistory);
        const result = await streamLLM(llmKey, userMessage, systemPrompt, (content) => {
          setParallelStreams(prev => ({ ...prev, [llmKey]: { content, status: 'streaming' } }));
        }, signal);
        trackTokens(userMessage, result, llmKey);
        setParallelStreams(prev => ({ ...prev, [llmKey]: { content: result, status: 'complete' } }));
        return { llmKey, result };
      } catch (error) {
        if (error.name === 'AbortError') throw error;
        setParallelStreams(prev => ({ ...prev, [llmKey]: { content: `Error: ${error.message}`, status: 'error' } }));
        return { llmKey, result: `Error: ${error.message}` };
      }
    });

    const results = await Promise.all(promises);
    const responses = results.reduce((acc, { llmKey, result }) => ({ ...acc, [llmKey]: result }), {});
    setCurrentPhase('integrating');

    const integrationPrompt = `You are Claude, the supervisor. 4 LLMs have INDEPENDENTLY responded to the user's prompt. INTEGRATE and SYNTHESIZE all responses.

USER'S QUESTION: "${userMessage}"

LLM RESPONSES:
${Object.entries(responses).map(([key, response]) => `
## ${LLM_CONFIG[key].name}
${response}
`).join('\n---\n')}

YOUR TASK:
1. Identify consensus points
2. Highlight unique insights from each
3. Resolve contradictions
4. Synthesize into a FINAL integrated response

${imageMode !== 'none' ? `NOTE: Output will become a ${imageMode === 'schema' ? 'technical schema' : imageMode === 'infographic' ? 'infographic' : 'photorealistic image/illustration'}.` : ''}

Format:
## 🔄 Consensus
## 💡 Unique Insights
## 🎯 Final Integrated Response`;

    const integration = await streamLLM('claude', integrationPrompt, null, (content) => {
      setIntegrationResult({ content, streaming: true });
    }, signal);

    const tokenInfo = trackTokens(integrationPrompt, integration, 'claude');
    setIntegrationResult({ content: integration, streaming: false, tokens: tokenInfo });
    setConversationHistory(prev => [...prev, { user: userMessage, assistant: integration }]);
    return integration;
  };

  const handlePostResponseImage = async (mode) => {
    if (!lastResponseContent || generatingPostImage) return;
    
    setGeneratingPostImage(true);
    setImageResult(null);
    
    try {
      const imageData = await generateImage(lastResponseContent, lastResponseQuestion, mode);
      if (imageData.images?.length > 0) {
        const imageCost = IMAGE_CONFIG[mode].price;
        setSessionCost(prev => prev + imageCost);
        setImageResult({ ...imageData, mode: mode, cost: imageCost });
      }
      fetchBalance();
    } catch (error) {
      console.error('Image error:', error);
    } finally {
      setGeneratingPostImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isProcessing || !isAuthenticated) return;

    const userMessage = prompt;
    setPrompt('');
    setIsProcessing(true);
    setImageResult(null);
    setLastResponseContent(null);
    setLastResponseQuestion(null);
    abortControllerRef.current = new AbortController();

    setMessages(prev => [...prev, { type: 'user', content: userMessage, mode: responseMode, attachments: [...attachments] }]);

    try {
      let finalResult;
      if (responseMode === 'single') finalResult = await handleSingleMode(userMessage, abortControllerRef.current.signal);
      else finalResult = await handleGroupMode(userMessage, abortControllerRef.current.signal);

      setLastResponseContent(finalResult);
      setLastResponseQuestion(userMessage);

      if (imageMode !== 'none' && finalResult) {
        setCurrentPhase('image');
        try {
          const imageData = await generateImage(finalResult, userMessage, imageMode);
          if (imageData.images?.length > 0) {
            const imageCost = IMAGE_CONFIG[imageMode].price;
            setSessionCost(prev => prev + imageCost);
            setImageResult({ ...imageData, mode: imageMode, cost: imageCost });
          }
        } catch (error) { console.error('Image error:', error); }
      }

      setCurrentPhase('complete');
      fetchBalance();
      setAttachments([]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        setMessages(prev => [...prev, { type: 'error', content: error.message }]);
      }
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
      abortControllerRef.current = null;
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachments(prev => [...prev, { name: file.name, type: file.type, data: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (index) => setAttachments(prev => prev.filter((_, i) => i !== index));

  const clearChat = () => {
    setMessages([]);
    setParallelStreams({});
    setIntegrationResult(null);
    setImageResult(null);
    setConversationHistory([]);
    setSessionTokens({ input: 0, output: 0 });
    setSessionCost(0);
    setAttachments([]);
    setLastResponseContent(null);
    setLastResponseQuestion(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    clearChat();
  };

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixan-${imageResult?.mode || 'image'}-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasContent = messages.length > 0 || Object.keys(parallelStreams).length > 0;
  // Solo mostrar opciones de imagen post-respuesta si NO seleccionó modo de imagen desde el inicio
  const showPostImageOptions = lastResponseContent && !imageResult && !isProcessing && !generatingPostImage && imageMode === 'none';

  // Render controls inline - NOT as a separate component to prevent re-mounting
  const renderControls = () => (
    <div className="controls-section">
      <div className="controls-row">
        <div className="mode-toggle">
          <div className="control-hint">Choose response mode</div>
          <div>
            <button className={`mode-btn ${responseMode === 'single' ? 'active' : ''}`} onClick={() => setResponseMode('single')} disabled={isProcessing}>👤 Single</button>
            <button className={`mode-btn ${responseMode === 'group' ? 'active' : ''}`} onClick={() => setResponseMode('group')} disabled={isProcessing}>👥 Group ({GROUP_LLMS.length})</button>
          </div>
        </div>

        {responseMode === 'single' && (
          <div className="llm-select">
            <div className="control-hint">Select AI model</div>
            <button className="llm-select-btn" onClick={() => setShowLLMDropdown(!showLLMDropdown)}>
              <div className="llm-icon-wrapper" style={{ background: LLM_CONFIG[selectedLLM].bgColor, color: LLM_CONFIG[selectedLLM].color }}>{LLMIcons[selectedLLM]()}</div>
              <span className="info">
                <span className="name">{LLM_CONFIG[selectedLLM].name}</span>
                <span className="meta">{LLM_CONFIG[selectedLLM].context}</span>
              </span>
              <span>▾</span>
            </button>
            {showLLMDropdown && (
              <div className="llm-dropdown">
                {Object.entries(LLM_CONFIG).map(([key, config]) => (
                  <div key={key} className={`llm-option ${selectedLLM === key ? 'selected' : ''}`} onClick={() => { setSelectedLLM(key); setShowLLMDropdown(false); }}>
                    <div className="llm-icon-wrapper" style={{ background: config.bgColor, color: config.color, width: 24, height: 24 }}>{LLMIcons[key]()}</div>
                    <span className="info">
                      <span className="name">{config.name}</span>
                      <span className="meta">{config.context} • ${config.inputPrice}/${config.outputPrice}</span>
                    </span>
                    {selectedLLM === key && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="image-section">
        <div className="control-hint">Output as image</div>
        <div className="image-toggle">
          {Object.entries(IMAGE_CONFIG).map(([key, cfg]) => (
            <button key={key} className={`image-btn ${key} ${imageMode === key ? 'active' : ''}`} onClick={() => setImageMode(key)} style={imageMode === key && key !== 'none' ? { color: cfg.color } : {}}>
              {cfg.label}
            </button>
          ))}
        </div>
        {imageMode !== 'none' && <div className="image-cost">~${IMAGE_CONFIG[imageMode].price.toFixed(2)} per image</div>}
      </div>

      <div className="input-section">
        {attachments.length > 0 && (
          <div className="attachments">
            {attachments.map((att, i) => (
              <div key={i} className="attachment">
                {att.type.startsWith('image/') && <img src={att.data} alt={att.name} className="attachment-preview" />}
                {att.type.startsWith('audio/') && <span className="attachment-audio">🎵 {att.name}</span>}
                <button className="attachment-remove" onClick={() => removeAttachment(i)}>×</button>
              </div>
            ))}
          </div>
        )}
        <div className="input-wrapper">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,audio/*" multiple style={{ display: 'none' }} />
          <button type="button" className="attach-btn" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>📎</button>
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ask anything..."
            disabled={isProcessing || !isAuthenticated}
            autoComplete="off"
          />
          {messages.length > 0 && <button type="button" className="clear-btn" onClick={clearChat} disabled={isProcessing}>🗑️</button>}
          {isProcessing ? (
            <button type="button" className="stop-btn" onClick={handleStop}>⏹ Stop</button>
          ) : (
            <button type="button" className="send-btn" onClick={handleSubmit} disabled={!prompt.trim() || !isAuthenticated}>Send →</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Pixan genAI | Collaborative AI Intelligence</title>
        <meta name="description" content="Single or supervised group responses from multiple LLMs" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: #fff; color: #1a1a1a; }
        .container { max-width: 1100px; margin: 0 auto; padding: 16px; min-height: 100vh; display: flex; flex-direction: column; }
        
        .auth-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .auth-modal { background: #fff; border-radius: 16px; padding: 40px; max-width: 360px; width: 90%; }
        .auth-logo { margin-bottom: 24px; display: flex; justify-content: center; }
        .auth-title { font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 8px; }
        .auth-subtitle { color: #666; text-align: center; margin-bottom: 24px; font-size: 13px; }
        .auth-input { width: 100%; padding: 12px 16px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 12px; }
        .auth-input:focus { border-color: #28106A; }
        .auth-button { width: 100%; padding: 12px; background: #28106A; border: none; border-radius: 8px; color: #fff; font-weight: 500; font-size: 14px; cursor: pointer; }
        .auth-button:hover:not(:disabled) { background: #3d1a8f; }
        .auth-button:disabled { opacity: 0.5; }
        .auth-error { color: #dc2626; font-size: 13px; margin-bottom: 12px; padding: 10px; background: #fef2f2; border-radius: 6px; text-align: center; }
        
        .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header-title { font-size: 11px; color: #666; font-weight: 500; background: #f5f5f5; padding: 3px 8px; border-radius: 4px; }
        .stats-box { display: flex; align-items: center; gap: 12px; font-size: 11px; }
        .stat { display: flex; flex-direction: column; align-items: flex-end; }
        .stat-label { font-size: 8px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-weight: 600; color: #1a1a1a; }
        .stat-value.green { color: #059669; }
        .logout-btn { padding: 5px 8px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 10px; color: #666; cursor: pointer; }
        .logout-btn:hover { background: #f0f0f0; }
        
        .controls-section { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .controls-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 12px; }
        .control-hint { font-size: 10px; color: #9880d4; margin-bottom: 6px; font-weight: 500; letter-spacing: 0.3px; }
        .mode-toggle { display: flex; flex-direction: column; }
        .mode-toggle > div:last-child { display: flex; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 2px; }
        .mode-btn { padding: 6px 12px; border: none; background: transparent; font-size: 11px; font-weight: 500; color: #666; cursor: pointer; border-radius: 6px; }
        .mode-btn.active { background: #28106A; color: #fff; }
        
        .llm-select { position: relative; display: flex; flex-direction: column; }
        .llm-select-btn { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 11px; cursor: pointer; }
        .llm-icon-wrapper { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; padding: 3px; }
        .llm-select-btn .info { flex: 1; text-align: left; }
        .llm-select-btn .name { font-weight: 500; display: block; font-size: 12px; }
        .llm-select-btn .meta { font-size: 9px; color: #999; }
        .llm-dropdown { position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 4px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 220px; }
        .llm-option { display: flex; align-items: center; gap: 8px; padding: 8px 10px; cursor: pointer; border-bottom: 1px solid #f5f5f5; }
        .llm-option:last-child { border-bottom: none; }
        .llm-option:hover { background: #fafafa; }
        .llm-option.selected { background: #f0f0ff; }
        .llm-option .info { flex: 1; }
        .llm-option .name { font-weight: 500; font-size: 12px; }
        .llm-option .meta { font-size: 9px; color: #999; }
        
        .image-section { margin-bottom: 12px; }
        .image-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .image-toggle { display: flex; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 2px; flex-wrap: wrap; }
        .image-btn { padding: 6px 10px; border: none; background: transparent; font-size: 10px; font-weight: 500; color: #666; cursor: pointer; border-radius: 6px; white-space: nowrap; }
        .image-btn.active { background: #f0f0f0; }
        .image-cost { font-size: 9px; color: #999; margin-top: 4px; }
        
        .input-section { }
        .attachments { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
        .attachment { position: relative; }
        .attachment-preview { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e5e5; }
        .attachment-audio { background: #f5f5f5; padding: 12px 16px; border-radius: 6px; font-size: 11px; }
        .attachment-remove { position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; border-radius: 50%; background: #dc2626; color: #fff; border: none; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .input-wrapper { display: flex; gap: 8px; align-items: center; }
        .attach-btn { padding: 10px; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 14px; cursor: pointer; }
        .attach-btn:hover { background: #f5f5f5; }
        .prompt-input { flex: 1; padding: 10px 14px; background: linear-gradient(135deg, #f8f5ff 0%, #f0ebff 100%); border: 1.5px solid #d4c5f9; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; height: 42px; box-shadow: 0 2px 4px rgba(40, 16, 106, 0.08); }
        .prompt-input:focus { border-color: #28106A; background: linear-gradient(135deg, #faf8ff 0%, #f5f0ff 100%); box-shadow: 0 4px 8px rgba(40, 16, 106, 0.12); }
        .prompt-input::placeholder { color: #9880d4; }
        .send-btn { padding: 10px 16px; background: #28106A; border: none; border-radius: 8px; color: #fff; font-weight: 500; font-size: 12px; cursor: pointer; white-space: nowrap; }
        .send-btn:hover:not(:disabled) { background: #3d1a8f; }
        .send-btn:disabled { opacity: 0.5; }
        .stop-btn { padding: 10px 16px; background: #dc2626; border: none; border-radius: 8px; color: #fff; font-weight: 500; font-size: 12px; cursor: pointer; white-space: nowrap; }
        .stop-btn:hover { background: #b91c1c; }
        .clear-btn { padding: 10px; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; cursor: pointer; font-size: 12px; }
        .clear-btn:hover { background: #f0f0f0; }
        
        .chat-area { flex: 1; overflow-y: auto; }
        .message { margin-bottom: 12px; animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .message.user { display: flex; justify-content: flex-end; }
        .message.user .bubble { background: #28106A; color: #fff; padding: 10px 14px; border-radius: 14px 14px 4px 14px; max-width: 70%; font-size: 13px; }
        .message.user .mode-tag { font-size: 8px; opacity: 0.7; margin-bottom: 2px; }
        .message.error .bubble { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
        
        .llm-response { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 10px; padding: 14px; }
        .llm-response-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .llm-response-icon { width: 24px; height: 24px; border-radius: 5px; display: flex; align-items: center; justify-content: center; padding: 4px; }
        .llm-response-meta .name { font-weight: 600; font-size: 12px; }
        .llm-response-meta .tokens { font-size: 9px; color: #999; }
        .llm-response-content { font-size: 13px; line-height: 1.6; color: #333; }

        .copy-btn { background: transparent; border: 1px solid #ddd; border-radius: 5px; padding: 4px 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .copy-btn:hover { background: #f0f0f0; border-color: #bbb; transform: scale(1.05); }
        .copy-btn:active { transform: scale(0.95); }

        .preview-app-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; color: white; font-size: 12px; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .preview-app-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .preview-app-btn:active { transform: translateY(0); }
        
        .llm-response-content .md-h1 { font-size: 18px; font-weight: 700; margin: 14px 0 6px 0; color: #1a1a1a; }
        .llm-response-content .md-h2 { font-size: 15px; font-weight: 600; margin: 12px 0 4px 0; color: #1a1a1a; }
        .llm-response-content .md-h3 { font-size: 13px; font-weight: 600; margin: 10px 0 4px 0; color: #333; }
        .llm-response-content .md-p { margin: 6px 0; }
        .llm-response-content .md-li { margin-left: 18px; margin-bottom: 3px; list-style-type: disc; }
        .llm-response-content .md-li-num { margin-left: 18px; margin-bottom: 3px; list-style-type: decimal; }
        .llm-response-content .md-quote { border-left: 2px solid #28106A; padding-left: 10px; color: #555; font-style: italic; margin: 6px 0; }
        .llm-response-content .md-hr { border: none; border-top: 1px solid #eee; margin: 12px 0; }
        .llm-response-content .inline-code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 12px; }
        .llm-response-content .code-block { background: #1a1a1a; color: #e5e5e5; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 11px; margin: 6px 0; overflow-x: auto; }
        .llm-response-content strong { font-weight: 600; }
        .llm-response-content em { font-style: italic; }
        
        .parallel-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px; }
        .stream-card { background: #1a1a1a; border-radius: 6px; padding: 6px; font-family: monospace; font-size: 8px; color: #666; height: 60px; overflow: hidden; }
        .stream-card-header { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
        .stream-card-icon { width: 14px; height: 14px; border-radius: 3px; padding: 2px; }
        .stream-card-name { color: #999; font-weight: 500; font-family: 'Inter', sans-serif; font-size: 9px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .stream-card-status { font-size: 7px; padding: 1px 4px; border-radius: 3px; }
        .stream-card-status.pending { background: #333; color: #666; }
        .stream-card-status.streaming { background: #28106A; color: #fff; }
        .stream-card-status.complete { background: #059669; color: #fff; }
        .stream-card-status.error { background: #dc2626; color: #fff; }
        .stream-card-content { line-height: 1.2; word-break: break-all; overflow: hidden; }
        
        .integration-box { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
        .integration-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .integration-icon { width: 28px; height: 28px; background: #28106A; border-radius: 6px; display: flex; align-items: center; justify-content: center; padding: 5px; color: #fff; }
        .integration-title { font-weight: 600; font-size: 13px; }
        .integration-subtitle { font-size: 10px; color: #666; }
        .integration-content { font-size: 13px; line-height: 1.6; color: #333; }
        
        .post-image-options { background: #f8f9fa; border: 1px dashed #d1d5db; border-radius: 10px; padding: 14px; margin-bottom: 12px; text-align: center; }
        .post-image-label { font-size: 11px; color: #666; margin-bottom: 10px; }
        .post-image-buttons { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .post-image-btn { padding: 8px 14px; background: #fff; border: 2px solid #e5e5e5; border-radius: 8px; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .post-image-btn:hover { background: #f5f5f5; transform: translateY(-1px); }
        .post-image-price { font-size: 9px; opacity: 0.7; margin-left: 4px; }
        
        .image-box { border-radius: 10px; padding: 14px; margin-bottom: 12px; }
        .image-box.schema { background: #f3f4f6; border: 1px solid #d1d5db; }
        .image-box.infographic { background: #fffbeb; border: 1px solid #fde68a; }
        .image-box.ultrarealistic { background: #f3e8ff; border: 1px solid #d8b4fe; }
        .image-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .image-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .image-title { font-weight: 600; font-size: 13px; }
        .image-meta { font-size: 10px; color: #666; }
        .image-images { display: flex; flex-direction: column; gap: 8px; }
        .image-img-wrapper { position: relative; border-radius: 6px; overflow: hidden; }
        .image-img { width: 100%; height: auto; display: block; }
        .download-btn { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.7); border: none; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; }
        
        .processing { display: flex; align-items: center; gap: 6px; padding: 10px; background: #fafafa; border-radius: 6px; font-size: 12px; color: #666; margin-bottom: 10px; }
        .spinner { width: 14px; height: 14px; border: 2px solid #e5e5e5; border-top-color: #28106A; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; color: #666; }
        .empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.4; }
        .empty-title { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
        .empty-desc { font-size: 12px; max-width: 360px; line-height: 1.4; }
        
        .footer { padding-top: 12px; border-top: 1px solid #f0f0f0; margin-top: auto; display: flex; justify-content: center; font-size: 10px; color: #999; }
        .footer-link { color: #28106A; text-decoration: none; font-weight: 500; }
        
        @media (max-width: 768px) {
          .parallel-grid { grid-template-columns: repeat(4, 1fr); }
          .stream-card { height: 50px; }
          .controls-row { flex-direction: column; align-items: stretch; }
          .input-wrapper { flex-wrap: wrap; }
          .post-image-buttons { flex-direction: column; }
          .post-image-btn { width: 100%; }
          .header-left { flex-direction: column; align-items: flex-start; gap: 8px; }
          .stats-box { flex-wrap: wrap; gap: 8px; font-size: 10px; }
          .stat { align-items: flex-start; }
        }
      `}</style>

      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-logo"><PixanLogo /></div>
            <div className="auth-title">Collaborative genAI</div>
            <div className="auth-subtitle">Enter password to continue</div>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleAuth}>
              <input type="password" className="auth-input" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" disabled={isAuthenticating} autoFocus />
              <button type="submit" className="auth-button" disabled={!authPassword.trim() || isAuthenticating}>{isAuthenticating ? 'Verifying...' : 'Enter'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="container">
        <header className="header">
          <div className="header-left">
            <a href="/" style={{ display: 'flex' }}><PixanLogo /></a>
            <span className="header-title">genAI</span>
          </div>
          <div className="stats-box">
            <div className="stat">
              <span className="stat-label">Balance</span>
              <span className="stat-value green">${gatewayBalance !== null ? gatewayBalance.toFixed(2) : '—'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Session</span>
              <span className="stat-value">${sessionCost.toFixed(4)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tokens</span>
              <span className="stat-value">{sessionTokens.input.toLocaleString()}/{sessionTokens.output.toLocaleString()}</span>
            </div>
            {isAuthenticated && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
          </div>
        </header>

        {!hasContent && renderControls()}

        <div className="chat-area">
          {!hasContent ? (
            <div className="empty-state">
              <div className="empty-icon">{responseMode === 'single' ? '👤' : '👥'}</div>
              <div className="empty-title">{responseMode === 'single' ? 'Single Mode' : `Group Mode (${GROUP_LLMS.length} LLMs)`}</div>
              <div className="empty-desc">
                {responseMode === 'single' ? `${LLM_CONFIG[selectedLLM].name} will respond.` : `Claude, GPT, Gemini & Grok respond independently, then Claude integrates.`}
                {imageMode !== 'none' && ` + ${IMAGE_CONFIG[imageMode].label} output.`}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  {msg.type === 'user' && (
                    <div className="bubble">
                      <div className="mode-tag">{msg.mode === 'single' ? '👤' : '👥'}</div>
                      {msg.content}
                    </div>
                  )}
                  {msg.type === 'llm' && (
                    <div className="llm-response">
                      <div className="llm-response-header">
                        <div className="llm-response-icon" style={{ background: LLM_CONFIG[msg.llm].bgColor, color: LLM_CONFIG[msg.llm].color }}>{LLMIcons[msg.llm]()}</div>
                        <div className="llm-response-meta">
                          <div className="name">{LLM_CONFIG[msg.llm].name}</div>
                          {msg.tokens && <div className="tokens">{msg.tokens.inputTokens}/{msg.tokens.outputTokens} tokens • ${msg.tokens.cost.toFixed(6)}</div>}
                        </div>
                        {msg.streaming && <div className="spinner" style={{ marginLeft: 'auto' }}></div>}
                        {!msg.streaming && (
                          <>
                            {detectWebCode(msg.content) && (
                              <button
                                className="preview-app-btn"
                                onClick={() => openAppPreview(msg.content)}
                                title="Vista previa de la aplicación"
                              >
                                🚀 Preview
                              </button>
                            )}
                            <button
                              className="copy-btn"
                              onClick={() => copyToClipboard(msg.content)}
                              title="Copiar respuesta"
                              style={{ marginLeft: detectWebCode(msg.content) || msg.streaming ? '8px' : 'auto' }}
                            >
                              📋
                            </button>
                          </>
                        )}
                      </div>
                      <div className="llm-response-content">{renderMarkdown(msg.content)}</div>
                    </div>
                  )}
                  {msg.type === 'error' && <div className="bubble">{msg.content}</div>}
                </div>
              ))}

              {Object.keys(parallelStreams).length > 0 && (
                <div className="parallel-grid">
                  {Object.entries(parallelStreams).map(([llmKey, stream]) => (
                    <div key={llmKey} className="stream-card">
                      <div className="stream-card-header">
                        <div className="stream-card-icon" style={{ background: LLM_CONFIG[llmKey].bgColor, color: LLM_CONFIG[llmKey].color }}>{LLMIcons[llmKey]()}</div>
                        <span className="stream-card-name">{LLM_CONFIG[llmKey].name.split(' ')[0]}</span>
                        <span className={`stream-card-status ${stream.status}`}>
                          {stream.status === 'pending' && '⏳'}
                          {stream.status === 'streaming' && '⚡'}
                          {stream.status === 'complete' && '✓'}
                          {stream.status === 'error' && '✗'}
                        </span>
                      </div>
                      <div className="stream-card-content">{stream.content?.slice(0, 150) || (stream.status === 'pending' ? '...' : '')}</div>
                    </div>
                  ))}
                </div>
              )}

              {integrationResult && (
                <div className="integration-box">
                  <div className="integration-header">
                    <div className="integration-icon">{LLMIcons.claude()}</div>
                    <div>
                      <div className="integration-title">Claude Integration</div>
                      <div className="integration-subtitle">Synthesized from {GROUP_LLMS.length} LLMs {integrationResult.tokens && `• ${integrationResult.tokens.inputTokens}/${integrationResult.tokens.outputTokens} tokens • $${integrationResult.tokens.cost.toFixed(6)}`}</div>
                    </div>
                    {integrationResult.streaming && <div className="spinner" style={{ marginLeft: 'auto' }}></div>}
                    {!integrationResult.streaming && (
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(integrationResult.content)}
                        title="Copiar respuesta integrada"
                        style={{ marginLeft: integrationResult.streaming ? '0' : 'auto' }}
                      >
                        📋
                      </button>
                    )}
                  </div>
                  <div className="integration-content">{renderMarkdown(integrationResult.content)}</div>
                </div>
              )}

              {showPostImageOptions && (
                <div className="post-image-options">
                  <div className="post-image-label">Generate image from this response:</div>
                  <div className="post-image-buttons">
                    {Object.entries(IMAGE_CONFIG).filter(([key]) => key !== 'none').map(([key, cfg]) => (
                      <button 
                        key={key} 
                        className="post-image-btn"
                        onClick={() => handlePostResponseImage(key)}
                        style={{ borderColor: cfg.color, color: cfg.color }}
                      >
                        {cfg.label} <span className="post-image-price">${cfg.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {generatingPostImage && (
                <div className="processing">
                  <div className="spinner"></div>
                  <span>Generating image...</span>
                </div>
              )}

              {imageResult?.images?.length > 0 && (
                <div className={`image-box ${imageResult.mode}`}>
                  <div className="image-header">
                    <div className="image-icon" style={{ background: IMAGE_CONFIG[imageResult.mode].color, color: '#fff' }}>{IMAGE_CONFIG[imageResult.mode].label.split(' ')[0]}</div>
                    <div>
                      <div className="image-title" style={{ color: IMAGE_CONFIG[imageResult.mode].color }}>{IMAGE_CONFIG[imageResult.mode].label.replace(/^[^\s]+\s/, '')}</div>
                      <div className="image-meta">Cost: ${imageResult.cost?.toFixed(4) || '0.00'}</div>
                    </div>
                  </div>
                  <div className="image-images">
                    {imageResult.images.map((img, i) => (
                      <div key={i} className="image-img-wrapper">
                        <img src={img.url} alt={`Generated ${i + 1}`} className="image-img" />
                        <button className="download-btn" onClick={() => downloadImage(img.url, i)}>⬇ Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isProcessing && currentPhase === 'image' && (
                <div className="processing">
                  <div className="spinner"></div>
                  <span>Generating {IMAGE_CONFIG[imageMode].label}...</span>
                </div>
              )}

              {hasContent && renderControls()}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="footer">
          <span>Powered by <a href="https://pixan.ai" className="footer-link">pixan.ai</a></span>
        </footer>
      </div>

      {/* App Preview Modal */}
      {showAppPreview && (
        <AppPreview
          code={previewCode}
          framework={previewFramework}
          onClose={() => setShowAppPreview(false)}
        />
      )}
    </>
  );
}
