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
        title: "What do you want to do?",
        subtitle: "Select an option to continue",
        policy: "New Policy",
        policyDesc: "Document organizational rules and principles",
        process: "New Process",
        processDesc: "Document workflows and procedures",
        consult: "Consult Documents",
        consultDesc: "View and search existing policies and procedures"
      },
      
      // Consultation
      consult: {
        title: "Policies and Procedures",
        subtitle: "Search and view all documents",
        search: "Search...",
        filterAll: "All",
        filterPolicy: "Policies",
        filterProcess: "Processes",
        noDocuments: "No documents found",
        total: "documents",
        viewDetails: "View details",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this document?",
        policy: "Policy",
        process: "Process",
        by: "by",
        createdAt: "Created"
      },
      
      // Document details
      details: {
        title: "Document Details",
        type: "Type",
        author: "Author",
        date: "Date",
        objective: "Objective",
        scope: "Scope",
        responsibles: "Responsibles",
        principles: "Guiding Principles",
        steps: "Process Steps",
        indicators: "Performance Indicators",
        additionalDocs: "Additional Documentation",
        close: "Close",
        policy: "Policy",
        process: "Process"
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
        export: "Export to CSV",
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
        deleted: "Document deleted successfully!",
        exported: "Exported successfully!",
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
        title: "¿Qué deseas hacer?",
        subtitle: "Selecciona una opción para continuar",
        policy: "Nueva Política",
        policyDesc: "Documenta normas y principios organizacionales",
        process: "Nuevo Proceso",
        processDesc: "Documenta flujos de trabajo y procedimientos",
        consult: "Consultar Documentos",
        consultDesc: "Ver y buscar políticas y procedimientos existentes"
      },
      
      // Consulta
      consult: {
        title: "Políticas y Procedimientos",
        subtitle: "Busca y visualiza todos los documentos",
        search: "Buscar...",
        filterAll: "Todos",
        filterPolicy: "Políticas",
        filterProcess: "Procesos",
        noDocuments: "No se encontraron documentos",
        total: "documentos",
        viewDetails: "Ver detalles",
        delete: "Eliminar",
        confirmDelete: "¿Estás seguro de eliminar este documento?",
        policy: "Política",
        process: "Proceso",
        by: "por",
        createdAt: "Creado"
      },
      
      // Detalles del documento
      details: {
        title: "Detalles del Documento",
        type: "Tipo",
        author: "Autor",
        date: "Fecha",
        objective: "Objetivo",
        scope: "Alcance",
        responsibles: "Responsables",
        principles: "Principios Rectores",
        steps: "Pasos del Proceso",
        indicators: "Indicadores de Desempeño",
        additionalDocs: "Documentación Adicional",
        close: "Cerrar",
        policy: "Política",
        process: "Proceso"
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
        export: "Exportar a CSV",
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
        deleted: "¡Documento eliminado exitosamente!",
        exported: "¡Exportado exitosamente!",
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