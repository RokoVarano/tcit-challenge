# TCIT Challenge: Posts

Aplicación pequeña para crear, listar, filtrar y eliminar posts.

- **Frontend:** React 19 + Redux Toolkit + TypeScript (Vite), axios
- **Backend:** Node.js + Express 5 (API JSON), `pg`
- **Base de datos:** PostgreSQL

```
backend/
  db/schema.sql      tabla posts
  src/db.js          conexión a PostgreSQL (pool de pg)
  src/index.js       servidor Express y las tres rutas
frontend/
  src/api/posts.ts         llamadas HTTP (axios)
  src/store/postSlice.ts   estado de los posts, thunks y reducers
  src/store/store.ts       store de Redux y hooks tipados
  src/App.tsx              filtro, formulario y lista
  src/components/PostCard.tsx
```

## Cómo ejecutarlo

Requisitos: Node.js 22 o superior (lo desarrollé con Node 24) y una base de datos PostgreSQL.

### 1. Base de datos

Crea una base de datos PostgreSQL vacía. No hace falta crear la tabla: el backend ejecuta `backend/db/schema.sql` al iniciar, y como usa `CREATE TABLE IF NOT EXISTS`, es seguro hacerlo cada vez.

Yo lo desarrollé contra PostgreSQL en Supabase; funciona igual con un PostgreSQL local.

### 2. Backend

```bash
cd backend
cp .env.example .env    # y completa DATABASE_URL con tu base de datos
npm install
npm run dev             # http://localhost:3000
```

Variables de `.env`:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:password@localhost:5432/tcit_posts` | Connection string de PostgreSQL |
| `DATABASE_SSL` | `false` | `true` para bases en la nube que exigen SSL (Supabase), `false` para un PostgreSQL local |

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

## API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/posts` | `200` con todos los posts |
| `POST` | `/posts` | `201` con el post creado. Body: `{ "name": "...", "description": "..." }` |
| `DELETE` | `/posts/:id` | `200` con el post eliminado |

Errores: `400` si el nombre viene vacío o el id no es un número, `404` si no existe un post con ese id.

Ejemplo de post:

```json
{ "id": 1, "name": "Primer post", "description": "Hola", "createdAt": "2026-10-29T01:00:45.853Z" }
```

## Decisiones

- **Una sola llamada a la lista por carga de la vista.** `fetchPosts` usa la opción `condition` de `createAsyncThunk`, que lee el store en el momento del dispatch y solo deja pasar la petición si el estado es `idle`. Esto también evita la doble llamada que provoca `StrictMode` en desarrollo, donde React ejecuta los efectos dos veces. Un chequeo dentro del componente no basta, porque ambas ejecuciones ven el mismo render y el mismo `status`.
- **Crear y eliminar no vuelven a pedir la lista.** El backend devuelve el post creado o eliminado (`RETURNING *` en SQL) y el reducer lo agrega o lo quita de `items`.
- **Filtro local.** El filtro no llama a la API: filtra los posts que ya están en el store. Se aplica al presionar "Buscar", como en la propuesta visual, y no distingue mayúsculas de minúsculas. La lista filtrada se calcula en cada render a partir del store en vez de guardarse como un segundo estado, para que no se desincronice al crear o eliminar.
- **camelCase en el JSON, snake_case en SQL.** La columna `created_at` se expone como `createdAt`; la conversión está en un solo lugar (`toPost` en `backend/src/index.js`).
- **Consultas parametrizadas** (`$1`, `$2`) en todas las rutas, para evitar inyección SQL.
- **SSL.** Con `DATABASE_SSL=true` la conexión va cifrada pero no verifica el certificado (`rejectUnauthorized: false`), porque Supabase usa su propia autoridad certificadora. En producción configuraría el certificado CA de Supabase para verificarlo.
- **La tabla se crea al iniciar el servidor.** Para un challenge de una sola tabla es lo más simple de ejecutar. En un proyecto real usaría migraciones (por ejemplo `node-pg-migrate`), para versionar cada cambio del esquema.
- **Supuestos:** el nombre es obligatorio; la descripción es opcional.

## Uso de IA

Usé Claude (Claude Code) como apoyo durante todo el desarrollo, de la forma en que lo usaría en un equipo:

- **Para aprender y repasar.** Venía de varios años con Vue y Pinia, y tenía oxidados Redux y el backend en Node. Le pedí que me explicara cada concepto (slices, thunks, `extraReducers`, middlewares de Express, consultas parametrizadas) antes de usarlo, y escribí el código yo mismo a partir de esas explicaciones y ejemplos.
- **Como revisor.** Después de cada paso revisaba mi código y me señalaba errores, que corregí yo: comparar ids de tipo string con number, un `filter` sin asignar, una ruta registrada como `post` en vez de `delete`.
- **Para detectar problemas que no eran obvios:** la doble llamada de `StrictMode` (que llevó a usar `condition` en el thunk), el `NULL` en la descripción que rompía el `NOT NULL` de la columna, y la conexión directa de Supabase que solo funciona por IPv6.
- **Para tareas de apoyo:** redactó este README, los estilos de `App.css` y la creación automática de la tabla al iniciar. Los revisé y puedo explicar cada línea.

Las decisiones (qué incluir, qué dejar fuera, cómo cumplir cada requisito) fueron mías.

## Con más tiempo agregaría

- Tests: de la API (crear, eliminar, 400 y 404) y del reducer y el filtro.
- Estilos que sigan la propuesta visual.
- Mensajes de error visibles en la interfaz cuando falla una petición, y un botón para reintentar la carga.
- Borrado lógico (`deleted_at`) en lugar de eliminar la fila.
- TypeScript también en el backend.
