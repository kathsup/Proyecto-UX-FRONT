# Habit Tracker — Frontend

Interfaz web del proyecto Habit Tracker, construida con Next.js y Material UI.

## Tecnologías

- **Next.js** (App Router)
- **Material UI (MUI)** — componentes e íconos
- **MUI X Charts** — gráficas del Dashboard y Estadísticas
- **TypeScript**

## Arquitectura

Aplicación cliente que consume la API REST del backend (`habit-api`). La sesión se guarda en `sessionStorage` como un token JWT, enviado en cada petición protegida mediante el header `Authorization`. Las rutas dentro de la app están protegidas con un componente `ProtectedRoute`, que redirige a `/login` si no hay sesión activa.

## Requisitos previos

- Node.js 
- El backend (`habit-api`) corriendo, ya que el frontend depende de su API

## Instalación

1. Clona el repositorio y entra a la carpeta:
```bash
   cd habit-tracker-frontend
```

2. Instala las dependencias:
```bash
   pnpm install
```

## Ejecución

```bash
pnpm run dev
```

La app queda disponible en `http://localhost:3001`.

> Asegúrate de que el backend esté corriendo en `http://localhost:3000` antes de iniciar el frontend.

## Páginas principales

| Ruta | Descripción |
|---|---|
| `/login`, `/register` | Autenticación |
| `/dashboard` | Resumen del día, hábitos con stepper, gráficas semanal y mensual |
| `/habits` | Listado, búsqueda, filtros y gestión de hábitos |
| `/stats` | Estadísticas generales e historial de días completados |
| `/perfil` | Datos del usuario y resumen de actividad |

## Prueba rápida de punta a punta

1. Regístrate en `/register`.
2. Inicia sesión.
3. Crea un hábito desde el botón "Nuevo hábito".
4. Márcalo con el stepper en el Dashboard.
5. Verifica que las cifras y gráficas del Dashboard se actualicen.
6. Revisa Estadísticas y Perfil.
7. Cierra sesión desde el menú del avatar.
