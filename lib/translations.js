// Translation system for Pixan.ai
export const translations = {
  en: {
    // Landing Page
    landing: {
      title: "Collaborative genAI.",
      poweredBy: "Powered by",
      about: "About",
      projects: "Projects",
      contact: "Contact",
      footer: "© 2025 Powered by Pixan",
      adminButton: "Local API keys admin",
      
      // Service Buttons
      services: {
        promptBoost: {
          title: "Prompt Boost",
          description: "Optimize your prompt with Claude for any LLM and maximize results."
        },
        multiLLM: {
          title: "Prompt to Multi-LLM",
          description: "Launch your prompt to 4 LLMs simultaneously. Claude supervises and integrates a consolidated response."
        },
        ia60: {
          title: "AI 60+",
          description: "Prompting designed for people over 60, inspired by Web 2.0 simplicity."
        },
        pixanLabs: {
          title: "Go to Pixan Labs",
          description: "Create a new project and experiment with our advanced tools."
        }
      }
    },
    
    // API Admin Page
    apiAdmin: {
      title: "API Administration",
      subtitle: "Enter password to continue",
      password: "Password",
      access: "Access",
      logout: "Logout",
      controlCenter: "API Control Center",
      manageAPIs: "Manage all Pixan.ai APIs",
      
      clientVsServer: {
        title: "Client vs Server APIs",
        clientDesc: "Client APIs: APIs you configure here are stored locally in your browser and have priority. These will be lost if you change browser or delete site data.",
        serverDesc: "Server APIs: As a backup, we also have APIs configured on Vercel servers that will be used automatically when you don't have client APIs configured."
      },
      
      save: "Save",
      test: "Test",
      delete: "Delete",
      testing: "Testing...",
      saving: "Saving...",
      
      systemStatus: "System Status",
      configuredAPIs: "Configured APIs",
      activeAPIs: "Active APIs",
      totalBalance: "Total Balance",
      withBalance: "APIs with balance",
      
      errors: {
        wrongPassword: "Incorrect password",
        authError: "Authentication error",
        invalidKey: "Invalid API key",
        connectionError: "Connection error",
        saveError: "Error saving API key"
      },
      
      success: {
        authorized: "Authorized access",
        keySaved: "API Key saved",
        keyDeleted: "API deleted",
        testSuccess: "Connection successful"
      }
    },
    
    // LLM Collaborative Page
    llmC: {
      title: "LLM Collaborative",
      subtitle: "Next-generation collaborative artificial intelligence",
      password: "Password",
      access: "Access",
      wrongPassword: "Incorrect password",
      
      yourQuery: "Your Query",
      charactersCount: "characters",
      placeholder: "Question, request, analysis, research, creativity... any query you need to solve",
      
      connectionStatus: "Connection Status",
      active: "Active",
      noBalance: "No balance",
      
      startButton: "Start LLM Collaboration",
      cancel: "Cancel",
      processing: {
        initializing: "Initializing...",
        analyzing: "Claude analyzing and assigning roles...",
        assigning: "Assigning specialized tasks...",
        waiting: "Waiting for responses...",
        consolidating: "Claude consolidating responses...",
        calculating: "Calculating metrics..."
      },
      
      followUp: {
        title: "Follow-up Question",
        placeholder: "Continue the conversation with context...",
        send: "Send",
        newConversation: "New",
        hint: "Press Ctrl+Enter to send • The conversation maintains full context"
      },
      
      conversationHistory: "Conversation History",
      you: "You",
      assistant: "Assistant",
      
      consolidatedResponse: "CONSOLIDATED FINAL RESPONSE",
      copy: "Copy",
      copied: "Copied!",
      googleDocs: "Google Docs",
      generating: "Generating...",
      downloaded: "Downloaded!",
      
      metrics: {
        activeLLMs: "Active LLMs",
        totalTime: "Total Time",
        consolidation: "Consolidation",
        withMemory: "With Memory"
      },
      
      howItWorks: {
        title: "How LLM Collaborative Works",
        subtitle: "Next-Generation Collaborative Artificial Intelligence",
        description: "World's first platform that orchestrates 4 leading AIs working simultaneously, with intelligent consolidation and advanced conversational memory",
        
        architecture: {
          title: "Simultaneous Collaboration Architecture",
          description: "Revolutionary system that coordinates multiple AIs in real-time"
        }
      },
      
      terminal: {
        starting: "Starting LLM Collaborative with 4 models",
        models: "Models",
        analyzingQuery: "Claude analyzing query and assigning roles...",
        analyzingType: "Analyzing query type and each LLM's capabilities...",
        analysisComplete: "Analysis completed: Query type",
        roleAssignment: "ROLE ASSIGNMENT",
        sendingTasks: "Sending specialized tasks to each LLM...",
        role: "ROLE",
        task: "TASK",
        responseReceived: "Response received",
        characters: "characters",
        error: "Error in",
        criticalError: "Critical error",
        noResponses: "No LLM responded successfully",
        successfulResponses: "Received successful responses",
        consolidating: "Claude starting final consolidation...",
        consolidationComplete: "Consolidation completed with enriched format",
        calculatingMetrics: "Calculating collaboration metrics...",
        collaborationSuccess: "LLM Collaboration completed successfully by Pixan.ai!",
        processCanceled: "Process canceled by user",
        memoryCleared: "Conversation memory cleared"
      }
    },
    
    // Prompt Boost Page
    promptBoost: {
      title: "Prompt Boost",
      subtitle: "Optimize your prompts with Claude AI",
      optimizeFor: "Optimize for",
      yourPrompt: "Your Prompt",
      placeholder: "Enter the prompt you want to optimize...",
      charactersCount: "characters",
      optimizeButton: "Optimize with Claude",
      optimizing: "Claude optimizing...",
      
      // Configuration section
      inputConfiguration: "Input Configuration",
      originalPrompt: "Your Original Prompt",
      targetLLM: "Target LLM",
      industryDomain: "Industry/Domain",
      creativityLevel: "Creativity Level",
      claudeAPIKey: "Claude API Key",
      geminiAPIKey: "Gemini API Key",
      
      // Creativity labels
      precise: "Precise",
      balanced: "Balanced",
      creative: "Creative",
      
      // LLM Options
      llmOptions: {
        universal: "Universal",
        claude: "Claude",
        gpt4: "GPT-4",
        gemini: "Gemini",
        perplexity: "Perplexity"
      },
      
      // Industry Options
      industryOptions: {
        general: "General",
        technology: "Technology",
        marketing: "Marketing",
        creative: "Creative",
        legal: "Legal",
        medical: "Medical",
        education: "Education"
      },
      
      // Buttons
      optimizePrompt: "Optimize Prompt",
      processing: "Processing Step",
      cancel: "Cancel",
      
      // Progress steps
      progress: "Progress",
      steps: {
        validate: "Validate inputs",
        sendGemini: "Send to Gemini",
        geminiOptimization: "Gemini optimization",
        sendClaude: "Send to Claude",
        claudeFeedback: "Claude feedback",
        returnGemini: "Return to Gemini",
        geminiRefinement: "Gemini refinement",
        claudeFinalReview: "Claude final review",
        claudeOptimization: "Claude optimization",
        calculateMetrics: "Calculate metrics"
      },
      
      // Terminal
      terminal: "AI Terminal - Pixan.ai",
      
      // Results section
      optimizedPrompt: "Optimized Prompt",
      copy: "Copy",
      copied: "Copied!",
      characterCount: "Character count",
      
      // Metrics
      clarity: "Clarity",
      effectiveness: "Effectiveness",
      improvement: "Improvement",
      processingTime: "Processing Time",
      
      // How it works section
      howItWorks: "How does Prompt Boost work?",
      aiCollaborativePower: "The power of collaborative AI",
      collaborativeDescription: "Prompt Boost is a collaborative AI-to-AI orchestrator where two of the most advanced models on the planet work together to perfect your prompt in real time",
      
      magicalWorkflow: "The Magical Workflow (Step by Step)",
      
      workflowSteps: {
        step1: {
          title: "Your Input + Context",
          description: "Capture your prompt and give it context with specific metadata: target LLM, industry, creativity temperature. This gives our algorithms the necessary framework for optimization."
        },
        step2: {
          title: "Gemini takes the first step",
          description: "Your prompt is first sent to Gemini 2.5 Flash. Gemini analyzes the structure, identifies specificity gaps, and proposes the first optimization iteration using its massive training dataset."
        },
        step3: {
          title: "Claude enters action",
          description: "Claude AI (Anthropic) receives Gemini's suggestion and passes it through its validation & feedback system. Claude identifies if Gemini's suggestion is solid or needs refinement."
        },
        step4: {
          title: "AI-to-AI Iteration",
          description: "Based on Claude's feedback, Gemini generates a more refined second iteration. It's literally like watching two AIs doing pair programming for your prompt."
        },
        step5: {
          title: "Claude's final touch",
          description: "Claude takes Gemini's second version and passes it through its anti-hallucination engine and cross-LLM compatibility optimizer. The result: a prompt that is not only clearer, but works optimally on different AI models."
        }
      },
      
      realTimeProcessing: "Real-time processing",
      realTimeDescription: "This entire workflow happens in real-time streaming. You can literally see how the two AIs converse with each other in our terminal - it's like being a silent witness while two neural networks collaborate.",
      
      mlMetrics: "Machine Learning Metrics that Matter",
      mlDescription: "At the end of the process, our algorithms calculate advanced metrics:",
      
      metricsExplanation: {
        clarityScore: {
          title: "Clarity Score",
          description: "Analysis of specificity and semantic structure"
        },
        effectivenessRating: {
          title: "Effectiveness Rating",
          description: "Based on prompt engineering best practices"
        },
        crossModelCompatibility: {
          title: "Cross-Model Compatibility",
          description: "How well it works on different LLMs"
        },
        antiHallucinationIndex: {
          title: "Anti-Hallucination Index",
          description: "Reduction in probability of inconsistent responses"
        }
      },
      
      revolutionaryApproach: "Why is our approach revolutionary?",
      
      approachPoints: {
        individualLimitation: {
          title: "Individual AI Limitation",
          description: "A single model has its inherent biases and limitations."
        },
        aiCollaboration: {
          title: "AI-to-AI Collaboration",
          description: "Two different models (Gemini's massive scale + Claude's safety approach) complement each other to eliminate mutual weaknesses."
        },
        zeroShotUpdate: {
          title: "Zero-Shot to Few-Shot Update",
          description: "Your basic prompt becomes a designed masterpiece that gives more consistent and precise results."
        }
      },
      
      securityPrivacy: "Security & privacy by design",
      securityDescription: "Your API keys are handled session-only (no persistence). Prompts are processed in-memory without logging. It's like having a private workspace where you can experiment without worrying about data leakage.",
      
      conclusion: "The conclusion",
      conclusionDescription: "Prompt Boost is basically having two AI engineers optimizing your prompt on two neural networks while you watch the process live. It's collaboration technology combined with prompt engineering and real-time transparency.",
      conclusionTarget: "Perfect for developers, marketers, content creators, and any advanced user who wants to extract maximum value from their AI interactions.",
      
      // Validation errors
      errors: {
        promptTooShort: "Prompt must be at least 10 characters",
        claudeKeyRequired: "Claude API key is required",
        geminiKeyRequired: "Gemini API key is required"
      },
      
      // Terminal messages
      terminalMessages: {
        startingOptimization: "Starting optimization...",
        sendingToGemini: "Sending to Gemini...",
        switchingToClaude: "Switching to Claude...",
        refiningWithGemini: "Refining with Gemini...",
        finalOptimizationClaude: "Final optimization with Claude...",
        calculatingMetrics: "Calculating metrics...",
        processCompleted: "Process completed by Pixan.ai!",
        processCanceled: "Process canceled by user",
        apiKeyError: "API key error - verify your credentials",
        rateLimitError: "Rate limit exceeded - wait a moment",
        generalError: "Error"
      }
    },
    
    // Políticas y Procedimientos Page
    proc: {
      title: "Policies and Procedures Divya",
      subtitle: "Document and manage organizational policies and procedures",
      
      // Login
      login: {
        title: "Access",
        subtitle: "Enter your credentials to continue",
        username: "Username",
        password: "Password",
        loginButton: "Enter",
        usernamePlaceholder: "Your username",
        passwordPlaceholder: "Your password"
      },
      
      // Selection
      selection: {
        title: "What do you want to document?",
        subtitle: "Select the type of document you want to create",
        policy: "Policy",
        policyDesc: "Document organizational rules and principles",
        process: "Process",
        processDesc: "Document workflows and procedures"
      },
      
      // Common fields
      common: {
        objective: "Objective",
        objectivePlaceholder: "Describe the main objective...",
        scope: "Scope",
        scopePlaceholder: "Define the scope of application...",
        responsibles: "Responsibles",
        responsiblesPlaceholder: "List the responsible persons (comma separated)...",
        additionalDocs: "Additional Documentation",
        additionalDocsPlaceholder: "Links or references to additional documents...",
        save: "Save",
        cancel: "Cancel",
        export: "Export to Google Sheets",
        back: "Back",
        logout: "Logout"
      },
      
      // Policy specific
      policy: {
        title: "New Policy",
        principles: "Guiding Principles",
        principlesPlaceholder: "Describe the guiding principles..."
      },
      
      // Process specific
      process: {
        title: "New Process",
        steps: "Process Steps",
        stepsPlaceholder: "Describe the steps of the process (one per line)...",
        indicators: "Performance Indicators",
        indicatorsPlaceholder: "Define the KPIs to measure..."
      },
      
      // Messages
      messages: {
        saved: "Document saved successfully!",
        exported: "Exported to Google Sheets successfully!",
        error: "An error occurred. Please try again.",
        fillRequired: "Please fill in all required fields"
      }
    }
  },
  
  es: {
    // Página Principal
    landing: {
      title: "GenAI colaborativa para el crecimiento.",
      poweredBy: "Impulsado por",
      about: "Acerca",
      projects: "Proyectos",
      contact: "Contacto",
      footer: "© 2025 Powered by Pixan",
      adminButton: "Admin de APIs locales",
      
      // Botones de Servicios
      services: {
        promptBoost: {
          title: "Prompt Boost",
          description: "Optimiza tu prompt con Claude para cualquier LLM y maximiza resultados."
        },
        multiLLM: {
          title: "Prompt to Multi-LLM",
          description: "Lanza tu prompt a 4 LLMs simultáneamente. Claude supervisa e integra una respuesta consolidada."
        },
        ia60: {
          title: "IA 60+",
          description: "Prompting pensado para mayores de 60 años, inspirado en la simplicidad de la Web 2.0."
        },
        pixanLabs: {
          title: "Ir a Pixan Labs",
          description: "Crea un nuevo proyecto y experimenta con nuestras herramientas avanzadas."
        }
      }
    },
    
    // Página de Admin de APIs
    apiAdmin: {
      title: "Administración de APIs",
      subtitle: "Ingresa la contraseña para continuar",
      password: "Contraseña",
      access: "Acceder",
      logout: "Cerrar sesión",
      controlCenter: "Centro de Control de APIs",
      manageAPIs: "Administra todas las APIs de Pixan.ai",
      
      clientVsServer: {
        title: "APIs del Cliente vs Servidor",
        clientDesc: "APIs del Cliente: Las APIs que configures aquí se almacenan localmente en tu navegador y tienen prioridad. Estas se perderán si cambias de navegador o eliminas los datos del sitio.",
        serverDesc: "APIs del Servidor: Como respaldo, también tenemos APIs configuradas en los servidores de Vercel que se utilizarán automáticamente cuando no tengas APIs del cliente configuradas."
      },
      
      save: "Guardar",
      test: "Test",
      delete: "Eliminar",
      testing: "Probando...",
      saving: "Guardando...",
      
      systemStatus: "Estado del Sistema",
      configuredAPIs: "APIs Configuradas",
      activeAPIs: "APIs Activas",
      totalBalance: "Saldo Total",
      withBalance: "APIs con saldo",
      
      errors: {
        wrongPassword: "Contraseña incorrecta",
        authError: "Error de autenticación",
        invalidKey: "API key inválida",
        connectionError: "Error de conexión",
        saveError: "Error al guardar API key"
      },
      
      success: {
        authorized: "Acceso autorizado",
        keySaved: "API Key guardada",
        keyDeleted: "API eliminada",
        testSuccess: "Conexión exitosa"
      }
    },
    
    // Página LLM Colaborativa
    llmC: {
      title: "LLM Colaborativa",
      subtitle: "Inteligencia artificial colaborativa de nueva generación",
      password: "Contraseña",
      access: "Acceder",
      wrongPassword: "Password incorrecto",
      
      yourQuery: "Tu Consulta",
      charactersCount: "caracteres",
      placeholder: "Pregunta, solicitud, análisis, investigación, creatividad... cualquier consulta que necesites resolver",
      
      connectionStatus: "Estado de Conexiones",
      active: "Activo",
      noBalance: "Sin saldo",
      
      startButton: "Iniciar Colaboración LLM",
      cancel: "Cancelar",
      processing: {
        initializing: "Inicializando...",
        analyzing: "Claude analizando y asignando roles...",
        assigning: "Asignando tareas especializadas...",
        waiting: "Esperando respuestas...",
        consolidating: "Claude consolidando respuestas...",
        calculating: "Calculando métricas..."
      },
      
      followUp: {
        title: "Pregunta de Seguimiento",
        placeholder: "Continúa la conversación con contexto...",
        send: "Enviar",
        newConversation: "Nueva",
        hint: "Presiona Ctrl+Enter para enviar • La conversación mantiene el contexto completo"
      },
      
      conversationHistory: "Historial de Conversación",
      you: "Tú",
      assistant: "Asistente",
      
      consolidatedResponse: "RESPUESTA CONSOLIDADA FINAL",
      copy: "Copiar",
      copied: "¡Copiado!",
      googleDocs: "Google Docs",
      generating: "Generando...",
      downloaded: "¡Descargado!",
      
      metrics: {
        activeLLMs: "LLMs Activos",
        totalTime: "Tiempo Total",
        consolidation: "Consolidación",
        withMemory: "Con Memoria"
      },
      
      howItWorks: {
        title: "Cómo Funciona la LLM Colaborativa",
        subtitle: "Inteligencia Artificial Colaborativa de Nueva Generación",
        description: "Primera plataforma mundial que orquesta 4 IAs líderes trabajando simultáneamente, con consolidación inteligente y memoria conversacional avanzada",
        
        architecture: {
          title: "Arquitectura de Colaboración Simultánea",
          description: "Sistema revolucionario que coordina múltiples IAs en tiempo real"
        }
      },
      
      terminal: {
        starting: "Iniciando LLM Colaborativa con 4 modelos",
        models: "Modelos",
        analyzingQuery: "Claude analizando consulta y asignando roles...",
        analyzingType: "Analizando tipo de consulta y capacidades de cada LLM...",
        analysisComplete: "Análisis completado: Consulta tipo",
        roleAssignment: "ASIGNACIÓN DE ROLES",
        sendingTasks: "Enviando tareas especializadas a cada LLM...",
        role: "ROL",
        task: "TAREA",
        responseReceived: "Respuesta recibida",
        characters: "caracteres",
        error: "Error en",
        criticalError: "Error crítico",
        noResponses: "Ningún LLM respondió exitosamente",
        successfulResponses: "Recibidas respuestas exitosas",
        consolidating: "Claude iniciando consolidación final...",
        consolidationComplete: "Consolidación completada con formato enriquecido",
        calculatingMetrics: "Calculando métricas de colaboración...",
        collaborationSuccess: "¡Colaboración LLM completada con éxito por Pixan.ai!",
        processCanceled: "Proceso cancelado por el usuario",
        memoryCleared: "Memoria de conversación limpiada"
      }
    },
    
    // Página Prompt Boost
    promptBoost: {
      title: "Prompt Boost",
      subtitle: "Optimiza tus prompts con Claude AI",
      optimizeFor: "Optimizar para",
      yourPrompt: "Tu Prompt",
      placeholder: "Ingresa el prompt que deseas optimizar...",
      charactersCount: "caracteres",
      optimizeButton: "Optimizar con Claude",
      optimizing: "Claude optimizando...",
      
      // Sección de configuración
      inputConfiguration: "Configuración de Entrada",
      originalPrompt: "Tu Prompt Original",
      targetLLM: "LLM Objetivo",
      industryDomain: "Industria/Dominio",
      creativityLevel: "Nivel de Creatividad",
      claudeAPIKey: "Clave API de Claude",
      geminiAPIKey: "Clave API de Gemini",
      
      // Etiquetas de creatividad
      precise: "Preciso",
      balanced: "Balanceado",
      creative: "Creativo",
      
      // Opciones de LLM
      llmOptions: {
        universal: "Universal",
        claude: "Claude",
        gpt4: "GPT-4",
        gemini: "Gemini",
        perplexity: "Perplexity"
      },
      
      // Opciones de industria
      industryOptions: {
        general: "General",
        technology: "Tecnología",
        marketing: "Marketing",
        creative: "Creativo",
        legal: "Legal",
        medical: "Médico",
        education: "Educación"
      },
      
      // Botones
      optimizePrompt: "Optimizar Prompt",
      processing: "Procesando Paso",
      cancel: "Cancelar",
      
      // Pasos del progreso
      progress: "Progreso",
      steps: {
        validate: "Validar entradas",
        sendGemini: "Enviar a Gemini",
        geminiOptimization: "Optimización de Gemini",
        sendClaude: "Enviar a Claude",
        claudeFeedback: "Retroalimentación de Claude",
        returnGemini: "Regresar a Gemini",
        geminiRefinement: "Refinamiento de Gemini",
        claudeFinalReview: "Revisión final de Claude",
        claudeOptimization: "Optimización de Claude",
        calculateMetrics: "Calcular métricas"
      },
      
      // Terminal
      terminal: "Terminal IA - Pixan.ai",
      
      // Sección de resultados
      optimizedPrompt: "Prompt Optimizado",
      copy: "Copiar",
      copied: "¡Copiado!",
      characterCount: "Conteo de caracteres",
      
      // Métricas
      clarity: "Claridad",
      effectiveness: "Efectividad",
      improvement: "Mejora",
      processingTime: "Tiempo de Proceso",
      
      // Sección cómo funciona
      howItWorks: "¿Cómo funciona Prompt Boost?",
      aiCollaborativePower: "El poder de la IA colaborativa",
      collaborativeDescription: "Prompt Boost es un orquestador colaborativo AI-a-AI donde dos de los modelos más avanzados del planeta trabajan juntos para perfeccionar tu prompt en tiempo real",
      
      magicalWorkflow: "El Flujo de Trabajo Mágico (Paso a Paso)",
      
      workflowSteps: {
        step1: {
          title: "Tu Entrada + Contexto",
          description: "Capturas tu prompt y le das contexto con metadata específica: LLM objetivo, industria, temperatura de creatividad. Esto le da a nuestros algoritmos el framework necesario para la optimización."
        },
        step2: {
          title: "Gemini da el primer paso",
          description: "Tu prompt se envía primero a Gemini 2.5 Flash. Gemini analiza la estructura, identifica brechas de especificidad, y propone la primera iteración de optimización usando su massive training dataset."
        },
        step3: {
          title: "Claude entra en acción",
          description: "Claude AI (Anthropic) recibe la sugerencia de Gemini y la pasa por su sistema validation & feedback. Claude identifica si la sugerencia de Gemini es sólida o necesita refinamiento."
        },
        step4: {
          title: "Iteración AI-a-AI",
          description: "Basado en la retroalimentación de Claude, Gemini genera una segunda iteración más refinada. Es literalmente como ver dos IAs haciendo pair programming para tu prompt."
        },
        step5: {
          title: "El toque final de Claude",
          description: "Claude toma la segunda versión de Gemini y la pasa por su anti-hallucination engine y cross-LLM compatibility optimizer. El resultado: un prompt que no solo es más claro, sino que funciona óptimamente en diferentes modelos de IA."
        }
      },
      
      realTimeProcessing: "Real-time processing",
      realTimeDescription: "Todo este flujo de trabajo sucede en real-time streaming. Puedes ver literalmente cómo las dos IAs conversan entre ellas en nuestra terminal - es como ser testigo silencioso mientras dos neural networks colaboran.",
      
      mlMetrics: "Métricas de Machine Learning que Importan",
      mlDescription: "Al final del proceso, nuestros algoritmos calculan métricas avanzadas:",
      
      metricsExplanation: {
        clarityScore: {
          title: "Clarity Score",
          description: "Análisis de especificidad y estructura semántica"
        },
        effectivenessRating: {
          title: "Effectiveness Rating",
          description: "Basado en prompt engineering best practices"
        },
        crossModelCompatibility: {
          title: "Cross-Model Compatibility",
          description: "Qué tan bien funciona en diferentes LLMs"
        },
        antiHallucinationIndex: {
          title: "Anti-Hallucination Index",
          description: "Reducción de probabilidad de respuestas inconsistentes"
        }
      },
      
      revolutionaryApproach: "¿Por qué nuestro enfoque es revolucionario?",
      
      approachPoints: {
        individualLimitation: {
          title: "Limitación de IA Individual",
          description: "Un solo modelo tiene sus sesgos y limitaciones inherentes."
        },
        aiCollaboration: {
          title: "Colaboración AI-a-AI",
          description: "Dos modelos diferentes (la escala masiva de Gemini + el enfoque de seguridad de Claude) se complementan para eliminar debilidades mutuas."
        },
        zeroShotUpdate: {
          title: "Actualización Zero-Shot to Few-Shot",
          description: "Tu prompt básico se convierte en una obra maestra diseñada que da resultados más consistentes y precisos."
        }
      },
      
      securityPrivacy: "Security & privacy by design",
      securityDescription: "Tus claves API se manejan session-only (sin persistencia). Los prompts se procesan in-memory sin registro. Es como tener un espacio de trabajo privado donde puedes experimentar sin preocuparte por filtración de datos.",
      
      conclusion: "La conclusión",
      conclusionDescription: "Prompt Boost es básicamente tener dos ingenieros de IA optimizando tu prompt en dos redes neuronales mientras tú ves el proceso en vivo. Es tecnología de colaboración combinada con prompt engineering y transparencia en tiempo real.",
      conclusionTarget: "Perfecto para desarrolladores, marketers, creadores de contenido, y cualquier usuario avanzado que quiera extraer el máximo valor de sus interacciones con IA.",
      
      // Errores de validación
      errors: {
        promptTooShort: "El prompt debe tener al menos 10 caracteres",
        claudeKeyRequired: "Se requiere la clave API de Claude",
        geminiKeyRequired: "Se requiere la clave API de Gemini"
      },
      
      // Mensajes del terminal
      terminalMessages: {
        startingOptimization: "Iniciando optimización...",
        sendingToGemini: "Enviando a Gemini...",
        switchingToClaude: "Enviando a Claude...",
        refiningWithGemini: "Refinando con Gemini...",
        finalOptimizationClaude: "Optimización final con Claude...",
        calculatingMetrics: "Calculando métricas...",
        processCompleted: "¡Proceso completado por Pixan.ai!",
        processCanceled: "Proceso cancelado por el usuario",
        apiKeyError: "Error de clave API - verifica tus credenciales",
        rateLimitError: "Límite de tasa excedido - espera un momento",
        generalError: "Error"
      }
    },
    
    // Página Políticas y Procedimientos
    proc: {
      title: "Políticas y Procedimientos Divya",
      subtitle: "Documenta y gestiona políticas y procedimientos organizacionales",
      
      // Login
      login: {
        title: "Acceso",
        subtitle: "Ingresa tus credenciales para continuar",
        username: "Usuario",
        password: "Contraseña",
        loginButton: "Ingresar",
        usernamePlaceholder: "Tu nombre de usuario",
        passwordPlaceholder: "Tu contraseña"
      },
      
      // Selección
      selection: {
        title: "¿Qué deseas documentar?",
        subtitle: "Selecciona el tipo de documento que deseas crear",
        policy: "Política",
        policyDesc: "Documenta normas y principios organizacionales",
        process: "Proceso",
        processDesc: "Documenta flujos de trabajo y procedimientos"
      },
      
      // Campos comunes
      common: {
        objective: "Objetivo",
        objectivePlaceholder: "Describe el objetivo principal...",
        scope: "Alcance",
        scopePlaceholder: "Define el alcance de aplicación...",
        responsibles: "Responsables",
        responsiblesPlaceholder: "Lista los responsables (separados por coma)...",
        additionalDocs: "Documentación Adicional",
        additionalDocsPlaceholder: "Enlaces o referencias a documentos adicionales...",
        save: "Guardar",
        cancel: "Cancelar",
        export: "Exportar a Google Sheets",
        back: "Volver",
        logout: "Cerrar sesión"
      },
      
      // Específico de política
      policy: {
        title: "Nueva Política",
        principles: "Principios Rectores",
        principlesPlaceholder: "Describe los principios rectores..."
      },
      
      // Específico de proceso
      process: {
        title: "Nuevo Proceso",
        steps: "Pasos del Proceso",
        stepsPlaceholder: "Describe los pasos del proceso (uno por línea)...",
        indicators: "Indicadores de Desempeño",
        indicatorsPlaceholder: "Define los KPIs a medir..."
      },
      
      // Mensajes
      messages: {
        saved: "¡Documento guardado exitosamente!",
        exported: "¡Exportado a Google Sheets exitosamente!",
        error: "Ocurrió un error. Por favor intenta nuevamente.",
        fillRequired: "Por favor completa todos los campos requeridos"
      }
    }
  }
};

export function getTranslation(lang, path) {
  const keys = path.split('.');
  let value = translations[lang] || translations.en;
  
  for (const key of keys) {
    value = value?.[key];
    if (!value) return path; // Return path if translation not found
  }
  
  return value;
}