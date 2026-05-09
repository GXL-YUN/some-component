"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/storage/database/shared/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: dbUrl,
    },
});
//# sourceMappingURL=drizzle.config.js.map