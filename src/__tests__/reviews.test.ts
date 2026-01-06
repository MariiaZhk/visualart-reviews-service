import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import { Review } from "../models/reviewModel";
import axios from "axios";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await Review.deleteMany({});
});

describe("Reviews API", () => {
  it("POST /api/reviews should create a review", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { id: "test-artwork-1" } });

    const reviewData = {
      artworkId: "test-artwork-1",
      author: "Maria",
      content: "Nice artwork",
      rating: 4,
    };

    const res = await request(app)
      .post("/api/reviews")
      .send(reviewData)
      .expect(201);

    expect(res.body).toMatchObject(reviewData);
  });

  it("POST /api/reviews should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({ artworkId: "a1" })
      .expect(400);

    expect(res.body.message).toBe(
      "artworkId, author, content and rating are required"
    );
  });

  it("POST /api/reviews should fail if rating is out of range", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { id: "test-artwork-1" } });

    const res = await request(app)
      .post("/api/reviews")
      .send({
        artworkId: "test-artwork-1",
        author: "John",
        content: "Test",
        rating: 10,
      })
      .expect(400);

    expect(res.body.message).toBe("rating must be a number between 1 and 5");
  });

  it("GET /api/reviews should return all reviews for an artwork", async () => {
    await Review.create([
      { artworkId: "art-1", author: "A", content: "C1", rating: 5 },
      { artworkId: "art-1", author: "B", content: "C2", rating: 4 },
      { artworkId: "art-1", author: "C", content: "C3", rating: 3 },
    ]);

    const res = await request(app)
      .get("/api/reviews")
      .query({ artworkId: "art-1" })
      .expect(200);

    expect(res.body.length).toBe(3);
    expect(res.body[0].author).toBe("C");
    expect(res.body[1].author).toBe("B");
    expect(res.body[2].author).toBe("A");
  });

  it("GET /api/reviews should support pagination", async () => {
    await Review.create([
      { artworkId: "art-1", author: "A", content: "C1", rating: 5 },
      { artworkId: "art-1", author: "B", content: "C2", rating: 4 },
      { artworkId: "art-1", author: "C", content: "C3", rating: 3 },
    ]);

    const res = await request(app)
      .get("/api/reviews")
      .query({ artworkId: "art-1", size: 2, from: 0 })
      .expect(200);

    expect(res.body.length).toBe(2);
  });

  it("POST /api/reviews/_counts should return counts for given artworkIds", async () => {
    await Review.create([
      { artworkId: "art-1", author: "X", content: "C", rating: 5 },
      { artworkId: "art-2", author: "Y", content: "D", rating: 4 },
    ]);

    const res = await request(app)
      .post("/api/reviews/_counts")
      .send({ artworkIds: ["art-1", "art-2", "art-3"] })
      .expect(200);

    expect(res.body).toEqual({
      "art-1": 1,
      "art-2": 1,
      "art-3": 0,
    });
  });

  it("POST /api/reviews/_counts should fail if artworkIds is missing or empty", async () => {
    const res = await request(app)
      .post("/api/reviews/_counts")
      .send({})
      .expect(400);

    expect(res.body.message).toBe("artworkIds must be a non-empty array");
  });
});
