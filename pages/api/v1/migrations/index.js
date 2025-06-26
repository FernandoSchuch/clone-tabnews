import { join } from "node:path";
import migrationsRunner from "node-pg-migrate";
import database from "/infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} Not Allowed` });
  } else {
    let dbClient;
    try {
      dbClient = await database.getNewClient();
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

        return response.status(200).json(pendingMigrations);
      } else if (request.method === "POST") {
        const runnedMigrations = await migrationsRunner({
          ...defaultMigrationsOptions,
          dryRun: false, // Set to false to actually run migrations
        });

        if (runnedMigrations.length > 0) {
          return response.status(201).json(runnedMigrations);
        }
        return response.status(200).json(runnedMigrations);
      }
    } catch (error) {
      console.error("Error running migrations:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    } finally {
      await dbClient.end();
    }
  }
}
