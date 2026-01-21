import express from "express";
import cors from "cors";
import { positions } from "./data/portfolio";
import { computeSummary } from "./services/portfolioSummary";
import { PositionStatus } from "./types";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// GET /api/portfolio - Returns full list of positions
app.get("/api/portfolio", (req, res) => {
  res.json(positions);
});

// GET /api/portfolio/summary - Returns portfolio summary
// Supports optional filtering by status via query parameter: ?status=available|retired
//
// IMPORTANT: The 2-second delay below is intentional and MUST NOT be removed.
// This simulates a slow API response. Your task is to handle this gracefully
// in the frontend - do not remove or reduce this delay.
app.get("/api/portfolio/summary", async (req, res) => {
  // Intentional 2-second delay - DO NOT REMOVE OR MODIFY
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const statusParam = req.query.status as string | undefined;

  // Validate status parameter if provided
  if (statusParam !== undefined) {
    const validStatuses: PositionStatus[] = ["available", "retired"];
    if (!validStatuses.includes(statusParam as PositionStatus)) {
      return res.status(400).json({
        error: "Invalid status parameter",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }
  }

  // Filter positions by status if parameter provided
  const filteredPositions = statusParam
    ? positions.filter((p) => p.status === statusParam)
    : positions;

  const summary = computeSummary(filteredPositions);
  res.json(summary);
});

// Export app for testing
export { app };

// Only start server if not being imported (i.e. when run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}
