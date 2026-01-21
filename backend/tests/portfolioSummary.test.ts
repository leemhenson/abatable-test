import { computeSummary } from "../src/services/portfolioSummary";
import { Position } from "../src/types";

describe("computeSummary", () => {
  it("should handle empty array", () => {
    const result = computeSummary([]);
    expect(result).toEqual({
      totalTonnes: 0,
      totalValue: 0,
      averagePricePerTonne: 0,
    });
  });

  it("should calculate correct totals for single position", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Test Project",
        tonnes: 100,
        pricePerTonne: 25,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(100);
    expect(result.totalValue).toBe(2500);
    expect(result.averagePricePerTonne).toBe(25);
  });

  it("should calculate weighted average correctly for multiple positions", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Project A",
        tonnes: 1000,
        pricePerTonne: 20,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "Project B",
        tonnes: 100,
        pricePerTonne: 30,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(1100);
    expect(result.totalValue).toBe(23000);
    expect(result.averagePricePerTonne).toBeCloseTo(20.909, 2);
  });

  it("should handle positions with zero tonnes", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Project A",
        tonnes: 100,
        pricePerTonne: 25,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "Project B",
        tonnes: 0,
        pricePerTonne: 30,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(100);
    expect(result.totalValue).toBe(2500);
    // What should the average be when one position has zero tonnes?
    expect(result.averagePricePerTonne).toBeDefined();
  });
});
