import request from "supertest";
import app from "../app.js";

test("GET /api/folder without auth should return 401", async () => {
  const res = await request(app).get("/api/folders");
  expect(res.statusCode).toBe(401);
});

test("GET /api/auth/status returns user info when logged in", async () => {
  const agent = request.agent(app);

  const username = "testing3";
  const password = "testing3";

  const loginRes = await request(app)
    .post("/api/login")
    .send({ username, password });
  expect(loginRes.statusCode).toBe(200);

  //making sure the jwt match
  const setCookie = loginRes.headers["set-cookie"]?.[0];
  const match = setCookie?.match(/token=([^;]+)/);
  const token = match?.[1];

  const statusRes = await request(app)
    .get("/api/auth/status")
    .set("Authorization", `Bearer ${token}`);
  expect(statusRes.statusCode).toBe(200);
  expect(statusRes.body.ok).toBe(true);
  expect(statusRes.body.user).toHaveProperty(
    "username",
    username
  );
});
