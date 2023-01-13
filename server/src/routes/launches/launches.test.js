const request = require("supertest");
const { app } = require("../../app");
const { connectMongo, disconnectMongo } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await connectMongo();
    jest.setTimeout(1000 * 1000);
  });
  afterAll(async () => await disconnectMongo());

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const launchData = {
      mission: "USS Enterprise",
      rocket: "BFR",
      target: "Kepler-62 f",
      launchDate: "January 5, 2023",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "BFR",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "BFR",
      target: "Kepler-62 f",
      launchDate: "helloo",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);
      expect(requestDate).toBe(responseDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: "Missing required launch propertie.",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({ error: "Invalid launch date." });
    });
  });
});
