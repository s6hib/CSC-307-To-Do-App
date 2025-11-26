import request from "supertest";
import app from "../app.js";

test("GET /health returns 200 and json", async () => {
  const res = await request(app).get("/health");
  expect(res.statusCode).toBe(200);
});
