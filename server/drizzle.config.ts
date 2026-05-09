import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';

export default defineConfig({
  schema: './src/storage/database/shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
});
