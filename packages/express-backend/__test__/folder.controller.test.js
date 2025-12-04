import request from "supertest";
import app from "../app.js";

test("create folder, delete folder, and get all folders", async () => {
  const agent = request.agent(app);
  const username = "testing3";
  const password = "testing3";

  const loginRes = await agent
    .post("/api/login")
    .send({ username, password });
  expect(loginRes.statusCode).toBe(200);

  //making sure the jwt match
  const setCookie = loginRes.headers["set-cookie"]?.[0];
  const match = setCookie?.match(/token=([^;]+)/);
  const token = match?.[1];

  //checks for empty folder array
  const emptyRes = await agent
    .get("/api/folders")
    .set("Authorization", `Bearer ${token}`);
  expect(emptyRes.statusCode).toBe(200);
  expect(Array.isArray(emptyRes.body)).toBe(true);
  expect(emptyRes.body.length).toBe(0);

  //tries to create folder, but fails
  const createFailRes = await agent
    .post("/api/folders")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "" });
  expect(createFailRes.statusCode).toBe(400);

  //create folder
  const createRes = await agent
    .post("/api/folders")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test", color: "#a8d5a8" });
  expect(createRes.statusCode).toBe(201);
  const folderId = createRes.body._id;

  //check if folder is successfully created
  const oneRes = await agent
    .get("/api/folders")
    .set("Authorization", `Bearer ${token}`);
  expect(oneRes.statusCode).toBe(200);
  expect(oneRes.body.length).toBe(1);
  expect(oneRes.body[0]).toMatchObject({
    name: "Test",
    color: "#a8d5a8"
  });

  //delete by non-existing id
  const deleteFalseRes = await agent
    .delete("/api/folders/aaaaaaaaaaaaaaaaaaaaaaaa")
    .set("Authorization", `Bearer ${token}`);
  expect(deleteFalseRes.statusCode).toBe(404);

  //delete by id
  const deleteRes = await agent
    .delete(`/api/folders/${folderId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(deleteRes.statusCode).toBe(204);

  //check if folder is successfully deleted
  const deletedTrueRes = await agent
    .get("/api/folders")
    .set("Authorization", `Bearer ${token}`);
  expect(deletedTrueRes.body.length).toBe(0);
});

test("update folder", async () => {
  const agent = request.agent(app);
  const username = "testing3";
  const password = "testing3";

  const loginRes = await agent
    .post("/api/login")
    .send({ username, password });
  expect(loginRes.statusCode).toBe(200);

  //making sure the jwt match
  const setCookie = loginRes.headers["set-cookie"]?.[0];
  const match = setCookie?.match(/token=([^;]+)/);
  const token = match?.[1];

  //create folder
  const createRes = await agent
    .post("/api/folders")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test1", color: "#a8d5a8" });
  expect(createRes.statusCode).toBe(201);
  const folderId = createRes.body._id;

  //update folder
  const updateRes = await agent
    .put(`/api/folders/${folderId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test2" });
  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.name).toBe("Test2");

  //tries to update non-existing folder
  const updateFailRes = await agent
    .put("/api/folders/aaaaaaaaaaaaaaaaaaaaaaaa")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test3" });
  expect(updateFailRes.statusCode).toBe(404);
  expect(updateFailRes.body.message).toMatch(
    /folder not found/i
  );
});
