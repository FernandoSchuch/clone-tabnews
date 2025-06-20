import { join } from "node:path";
import migrationsRunner from "node-pg-migrate";
import database from "/infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    // Run migrations
    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
    });
    dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const runnedMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
      dryRun: false, // Set to false to actually run migrations
    });
    dbClient.end();

    if (runnedMigrations.length > 0) {
      return response.status(201).json(runnedMigrations);
    }
    return response.status(200).json(runnedMigrations);
  }
  return response.status(200);
}
