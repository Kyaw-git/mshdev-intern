import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {

      // url: process.env.DATABASE_URL || "postgresql://postgres:Thek@localhost:5432/clothing_store_local_db?schema=public",
       url: process.env.DATABASE_URL || "postgresql://postgres:Kns043290%40%40@db.zfojtiqjcvgpztvmptmd.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
  },
});