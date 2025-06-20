import database from "infra/database.js";

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

beforeAll(async () => {
  await clearDatabase();
});

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toEqual(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
