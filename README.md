# visitChoco Admin

Panel de administración interno para [visitchoco.cloud](https://visitchoco.cloud) — la plataforma de turismo del Chocó, Colombia.

Gestiona establecimientos, aprobaciones de edición, contenido cultural, fauna, municipios, usuarios y métricas desde una interfaz moderna construida con React 19 + Vite.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form + Zod v4 |
| Animaciones | Framer Motion |
| UI primitivos | Radix UI |
| Iconos | Lucide React |
| Mapas | React Leaflet |
| Editor de texto | Tiptap |
| Estilos | Tailwind CSS v3 + tokens OKLCH |
| Deploy | Vercel |

---

## Módulos

| Ruta | Módulo |
|---|---|
| `/dashboard` | Resumen general con KPIs |
| `/negocios` | CRUD de establecimientos turísticos |
| `/inbox` | Cola de aprobaciones — ediciones de dueños de negocio |
| `/municipios` | Gestión de municipios con mapa |
| `/fauna` | Catálogo de fauna del Chocó |
| `/cultura` | Contenido cultural y patrimonio |
| `/metricas` | Analytics de uso de la plataforma |
| `/usuarios` | Administración de usuarios y roles |

---

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- Backend [`visitchoco-backend`](https://github.com/Bello2005/visitchoco-backend) corriendo localmente o apuntando a la URL de producción

---

## Inicio rápido

```bash
# 1. Clonar
git clone git@github.com:Bello2005/visitchoco-admin.git
cd visitchoco-admin

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL del backend

# 4. Correr en desarrollo
pnpm dev
```

El panel estará disponible en `http://localhost:5173`.

---

## Variables de entorno

Crear `.env.local` (no se sube al repo):

```env
VITE_API_URL=http://localhost:8000        # URL del backend
VITE_PUBLIC_URL=https://visitchoco.cloud  # URL del sitio público
VITE_UMAMI_URL=                           # URL del script de Umami (opcional)
VITE_UMAMI_WEBSITE_ID=                    # ID del sitio en Umami (opcional)
```

---

## Comandos

```bash
pnpm dev          # Servidor de desarrollo en localhost:5173
pnpm build        # Compilar TypeScript + bundle de producción
pnpm preview      # Previsualizar el build de producción
pnpm lint         # ESLint
pnpm exec tsc -p tsconfig.app.json --noEmit   # Typecheck sin compilar
```

---

## Autenticación

El panel usa **magic links** — no hay contraseñas.

1. Ingresar el email en `/auth/login`
2. El backend envía un enlace al correo (en desarrollo, el link aparece en los logs del backend)
3. Al hacer clic, el token se valida y se guarda un JWT en `localStorage`
4. Todas las peticiones incluyen `Authorization: Bearer <token>`

---

## Estructura del proyecto

```
src/
  api/              # Clientes HTTP por recurso (auth, establecimientos, media…)
  components/
    approval/       # DiffViewer — tabla antes/después para aprobaciones
    data/           # DataTable (TanStack Table con skeleton y empty state)
    entity/         # EntityDrawer — drawer lateral con Framer Motion
    form/           # ImageUploader (R2), MapPicker (Leaflet), RichTextEditor (Tiptap)
    layout/         # AdminShell, Sidebar, TopBar, RootLayout
    ui/             # Button, Input, Badge, Dialog, ConfirmDialog, Skeleton, EmptyState
  pages/            # Una carpeta por módulo
  providers/        # AuthProvider, QueryProvider, ToastProvider
  router/           # Definición de rutas con React Router v7
  styles/
    tokens.css      # Variables CSS OKLCH (colores del sistema de diseño)
  lib/              # Utilidades: cn, format, permissions
```

---

## Sistema de colores

Los colores están definidos como variables CSS OKLCH en `src/styles/tokens.css` y expuestos en Tailwind:

| Token | Uso |
|---|---|
| `bg-niebla` | Fondo principal |
| `text-carbon-900` | Texto primario |
| `bg-accent-bg` | Fondos de acento |
| `text-chirimia-500` | Color de marca |

No usar hex directamente — usar siempre los tokens.

---

## Deploy

El proyecto está configurado para Vercel. El archivo `vercel.json` redirige todas las rutas a `index.html` para que React Router funcione correctamente.

```bash
# Build de producción
pnpm build
```

Para conectar con GitHub en Vercel, el framework se detecta automáticamente como Vite.

---

## Repositorios relacionados

| Repo | Descripción |
|---|---|
| [`visitchoco-backend`](https://github.com/Bello2005/visitchoco-backend) | API — Express 5 + PostgreSQL + PostGIS |
| [`visitchoco-frontend`](https://github.com/Bello2005/visitchoco-frontend) | Sitio público — Vite + React |
