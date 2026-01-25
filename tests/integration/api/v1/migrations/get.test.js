import database from "infra/database.js";

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(clearDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const respnseBody = await response.json();

  expect(Array.isArray(respnseBody)).toBe(true);
  expect(respnseBody.length).toBeGreaterThan(0);
});
