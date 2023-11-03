Create a `.env` file in `./client` with these values

```ini
VITE_BACKEND_API=http://localhost:3000/
```
Create a `.env` file in `./server` with these values

```ini
DATABASE_URL="postgresql://volunteer-postgres:volunteer-postgres@localhost:5432/volunteer-postgres?schema=public"

PORT=3000
CLIENT_PORT=8080
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=3600
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=259200
```

Run project by

```bash
npm run start
```
