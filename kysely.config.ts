import { defineConfig } from "kysely-ctl";
import { db } from "./app/database/database";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "./app/database/migrations",
  },
  plugins: [],
  seeds: {
    seedFolder: "./app/database/seeds",
  },
});
