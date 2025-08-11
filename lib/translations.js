// Translation system for Pixan.ai
export const translations = {
  en: {
    // Landing Page
    landing: {
      title: "Business upscale.",
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
      
      results: {
        title: "Optimized Results",
        original: "Original",
        optimized: "Optimized for",
        copy: "Copy",
        copied: "Copied!"
      },
      
      selectLLM: {
        any: "Any LLM",
        claude: "Claude",
        gpt4: "GPT-4",
        gemini: "Gemini",
        llama: "Llama",
        mistral: "Mistral"
      },
      
      errors: {
        tooShort: "Prompt must be at least 10 characters"
      }
    }
  },
  
  es: {
    // Página Principal
    landing: {
      title: "Business upscale.",
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
      
      results: {
        title: "Resultados Optimizados",
        original: "Original",
        optimized: "Optimizado para",
        copy: "Copiar",
        copied: "¡Copiado!"
      },
      
      selectLLM: {
        any: "Cualquier LLM",
        claude: "Claude",
        gpt4: "GPT-4",
        gemini: "Gemini",
        llama: "Llama",
        mistral: "Mistral"
      },
      
      errors: {
        tooShort: "El prompt debe tener al menos 10 caracteres"
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