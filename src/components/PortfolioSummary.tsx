import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioSummary as PortfolioSummaryType } from "@/types/portfolio";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/constants";

const formatCurrency = (value: number, { maximumFractionDigits }: { maximumFractionDigits?: number } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export function PortfolioSummary() {
  const [summary, setSummary] = useState<PortfolioSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/portfolio/summary`);
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to load portfolio summary. Make sure the backend is running.",
        variant: "destructive",
      });
      console.error("Error fetching summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tonnes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(Math.round((summary.totalTonnes)))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(Math.round(summary.totalValue), { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Price/Tonne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.averagePricePerTonne)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
