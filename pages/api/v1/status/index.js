import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query({ text: "SHOW server_version" });
  const databaseMaxConnections = await database.query({
    text: "SHOW max_connections",
  });
  const databaseOpenConnections = await database.query({
    text: "SELECT count(1)::int as contador FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(
          databaseMaxConnections.rows[0].max_connections,
        ),
        open_connections: databaseOpenConnections.rows[0].contador,
      },
    },
  });
}

export default status;
