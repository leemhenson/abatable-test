import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PortfolioSummary as PortfolioSummaryType, StatusFilter } from "@/types/portfolio";
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    fetchSummary(abortController.signal);

    // Cleanup: abort on unmount
    return () => {
      abortController.abort();
    };
  }, [statusFilter]);

  const fetchSummary = async (signal: AbortSignal) => {
    try {
      setIsLoading(true);

      // Build URL with query parameter if filter is not "all"
      const url = new URL(`${API_BASE_URL}/portfolio/summary`);
      if (statusFilter !== "all") {
        url.searchParams.append("status", statusFilter);
      }

      const response = await fetch(url.toString(), { signal });
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();

      // Only update state if request wasn't aborted
      if (!signal.aborted) {
        setSummary(data);
        setIsLoading(false);
      }
    } catch (error) {
      // Don't show error or update loading state if request was aborted
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      toast({
        title: "Error",
        description:
          "Failed to load portfolio summary. Make sure the backend is running.",
        variant: "destructive",
      });
      console.error("Error fetching summary:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToggleGroup
        type="single"
        value={statusFilter}
        onValueChange={(value) => {
          if (value) setStatusFilter(value as StatusFilter);
        }}
      >
        <ToggleGroupItem value="all" aria-label="All positions">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="available" aria-label="Available positions">
          Available
        </ToggleGroupItem>
        <ToggleGroupItem value="retired" aria-label="Retired positions">
          Retired
        </ToggleGroupItem>
      </ToggleGroup>

      {isLoading ? (
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
      ) : summary ? (
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
      ) : null}
    </div>
  );
}
