# Configuración MCP de GitHub para Claude Code

**Fecha de configuración:** 2025-12-21
**Usuario GitHub:** aaprosperi
**Repositorio:** pixan.ai

## ✅ Configuración Completada

### 1. Archivos de Configuración

#### `~/.config/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<token configurado>"
      }
    }
  }
}
```

#### `~/.bashrc`
```bash
# GitHub Personal Access Token for Claude Code MCP
export GITHUB_PERSONAL_ACCESS_TOKEN="<token configurado>"
```

### 2. Requisitos del Sistema

- ✅ Node.js: v22.21.1
- ✅ npx: 10.9.4
- ❌ Docker: No instalado (usamos método npx)

### 3. Verificación del Token

**Token validado exitosamente con GitHub API:**
```bash
curl -H "Authorization: token <token>" https://api.github.com/user
```

**Resultados:**
- ✅ Usuario autenticado: `aaprosperi`
- ✅ Acceso al repositorio: `pixan.ai`
- ✅ Rama main: NO protegida (`protected: false`)

### 4. Restricciones Actuales

#### Git Push (Proxy Local)
```
❌ Solo permite push a ramas: claude/*-sessionId
✅ Rama actual permitida: claude/check-github-mcp-access-mobvO
```

#### MCP GitHub (Post-Reinicio)
```
⚠️ Pendiente de verificar después de reiniciar Claude Code
⚠️ El token tiene limitación: "Resource not accessible by personal access token"
```

## 📋 Próximos Pasos

### Para Activar el MCP

1. **Reiniciar Claude Code** (cerrar y volver a abrir la aplicación)
2. Verificar que las herramientas MCP estén disponibles:
   - `mcp__github__create_issue`
   - `mcp__github__create_pull_request`
   - `mcp__github__push_files`
   - `mcp__github__search_repositories`
   - etc.

### Para Verificar Permisos del Token

Ir a: https://github.com/settings/tokens

Verificar que el token tenga estos scopes:
- ✅ `repo` - Full control of repositories
- ✅ `workflow` - Update GitHub workflows
- ✅ `read:org` - Read org and team membership
- ✅ `read:user` - Read user profile
- ✅ `user:email` - Access user email

### Prueba de Concepto Post-Reinicio

Después de reiniciar Claude Code, probar:
1. Listar repositorios con MCP
2. Crear una issue de prueba
3. Intentar crear un commit vía MCP API (verificar si puede acceder a main)

## ⚠️ Notas de Seguridad

- 🔒 Token almacenado en `~/.bashrc` (NO incluido en control de versiones)
- 🔒 Configuración MCP en directorio de usuario (NO en repositorio)
- 🔒 Este documento NO contiene el token real

## 🎯 Pregunta Original: ¿Puede MCP modificar main?

**Respuesta técnica:**

| Método | ¿Puede modificar main? | Estado |
|--------|----------------------|--------|
| Git Push (proxy actual) | ❌ NO | Bloqueado: solo `claude/*` |
| MCP GitHub API | ⚠️ POR CONFIRMAR | Depende de scopes del token |

**Verificación pendiente:** El token mostró error `403` en endpoint de branch protection, lo que sugiere scopes limitados. Necesita verificación post-reinicio.

## 💡 Recomendación

Independientemente de si el MCP **puede** modificar main directamente, la **mejor práctica** es:

```
✅ Flujo recomendado:
1. Trabajar en rama claude/*
2. Crear Pull Request hacia main
3. Review y merge

❌ Evitar:
- Push directo a main (incluso si es técnicamente posible)
- Commits sin revisión en rama principal
```

## 📚 Referencias

- [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server)
- [Claude Code MCP Guide](https://code.claude.com/docs/en/mcp)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

---

**Configurado por:** Claude Code Agent
**Session ID:** mobvO
**Branch:** claude/check-github-mcp-access-mobvO
