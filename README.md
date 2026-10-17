# NOVA

Landing en Next.js con un catálogo de productos. El frontend se publica en Firebase Hosting y consulta una API Express alojada en Render.

## Ejecutar localmente

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` a `.env.local`.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.

El archivo de ejemplo contiene la única variable necesaria para conectar el catálogo:

```dotenv
NEXT_PUBLIC_API_URL=https://backendupbtestme.onrender.com
```

Puedes cambiar la URL en tu `.env.local` si usas otro backend. Reinicia el servidor de desarrollo después de cambiarla. `.env.local` permanece fuera de Git.

## Publicación

`npm run build` genera la exportación estática en `out/`. Los workflows de GitHub Actions compilan y despliegan el sitio en Firebase Hosting. En ese build, `NEXT_PUBLIC_API_URL` se toma de la variable de repositorio de GitHub si existe; de lo contrario, se usa la URL pública de Render.

`NEXT_PUBLIC_API_URL` se incluye en el JavaScript del navegador durante el build, por lo que debe contener una URL pública, nunca una contraseña ni la cadena de conexión a PostgreSQL.
