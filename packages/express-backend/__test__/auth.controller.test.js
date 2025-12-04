import request from "supertest";
import app from "../app.js";

test("signup", async () => {
  const username = `testing${Date.now()}`;
  const password = "testing3";

  const signupRes = await request(app)
    .post("/api/signup")
    .send({ username, password });
  expect(signupRes.statusCode).toBe(201);
});

test("login and logout", async () => {
  const agent = request.agent(app);
  const username = "testing3";
  const password = "testing3";

  const loginRes = await agent
    .post("/api/login")
    .send({ username, password });
  expect(loginRes.statusCode).toBe(200);

  const setCookie = loginRes.headers["set-cookie"]?.[0];
  const match = setCookie?.match(/token=([^;]+)/);
  const token = match?.[1];

  const beforeLogout = await agent
    .get("/api/auth/status")
    .set("Authorization", `Bearer ${token}`);
  expect(beforeLogout.statusCode).toBe(200);
  expect(beforeLogout.body.ok).toBe(true);

  const logoutRes = await agent
    .post("/api/logout")
    .set("Authorization", `Bearer ${token}`);
  expect(logoutRes.statusCode).toBe(200);

  const afterLogout = await agent.get("/api/auth/status");
  expect(afterLogout.statusCode).toBe(401);
});
