import request from "supertest";
import { app } from "../src/server";
import { positions } from "../src/data/portfolio";

describe("GET /api/portfolio/summary", () => {
  // Helper to calculate expected summary for filtered positions
  const calculateExpectedSummary = (filterStatus?: "available" | "retired") => {
    const filtered = filterStatus
      ? positions.filter((p) => p.status === filterStatus)
      : positions;

    const totalTonnes = filtered.reduce((sum, pos) => sum + pos.tonnes, 0);
    const totalValue = filtered.reduce(
      (sum, pos) => sum + pos.tonnes * pos.pricePerTonne,
      0
    );
    const averagePricePerTonne = totalValue / totalTonnes;

    return { totalTonnes, totalValue, averagePricePerTonne };
  };

  it("should return summary for all positions when no status parameter provided", async () => {
    const response = await request(app).get("/api/portfolio/summary");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalTonnes");
    expect(response.body).toHaveProperty("totalValue");
    expect(response.body).toHaveProperty("averagePricePerTonne");

    const expected = calculateExpectedSummary();
    expect(response.body.totalTonnes).toBe(expected.totalTonnes);
    expect(response.body.totalValue).toBe(expected.totalValue);
    expect(response.body.averagePricePerTonne).toBeCloseTo(
      expected.averagePricePerTonne,
      2
    );
  }, 10000); // Increased timeout for 2s delay

  it("should return summary for available positions only", async () => {
    const response = await request(app).get(
      "/api/portfolio/summary?status=available"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalTonnes");
    expect(response.body).toHaveProperty("totalValue");
    expect(response.body).toHaveProperty("averagePricePerTonne");

    const expected = calculateExpectedSummary("available");
    expect(response.body.totalTonnes).toBe(expected.totalTonnes);
    expect(response.body.totalValue).toBe(expected.totalValue);
    expect(response.body.averagePricePerTonne).toBeCloseTo(
      expected.averagePricePerTonne,
      2
    );
  }, 10000);

  it("should return summary for retired positions only", async () => {
    const response = await request(app).get(
      "/api/portfolio/summary?status=retired"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalTonnes");
    expect(response.body).toHaveProperty("totalValue");
    expect(response.body).toHaveProperty("averagePricePerTonne");

    const expected = calculateExpectedSummary("retired");
    expect(response.body.totalTonnes).toBe(expected.totalTonnes);
    expect(response.body.totalValue).toBe(expected.totalValue);
    expect(response.body.averagePricePerTonne).toBeCloseTo(
      expected.averagePricePerTonne,
      2
    );
  }, 10000);

  it("should return 400 Bad Request for invalid status parameter", async () => {
    const response = await request(app).get(
      "/api/portfolio/summary?status=invalid"
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("message");
    expect(response.body.error).toBe("Invalid status parameter");
    expect(response.body.message).toContain("available");
    expect(response.body.message).toContain("retired");
  }, 10000);

  it("should return 400 Bad Request for unknown status value", async () => {
    const response = await request(app).get(
      "/api/portfolio/summary?status=pending"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid status parameter");
  }, 10000);
});
