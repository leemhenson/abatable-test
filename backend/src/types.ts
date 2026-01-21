export type PositionStatus = "available" | "retired";

export type Position = {
  id: string;
  projectName: string;
  tonnes: number;
  pricePerTonne: number;
  status: PositionStatus;
  vintage: number;
};

export type PortfolioSummary = {
  totalTonnes: number;
  totalValue: number;
  averagePricePerTonne: number; // weighted average by tonnes
};
