import { Position } from '@/types/portfolio';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <caption className="sr-only">Portfolio positions showing project details and carbon credit information</caption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col">Project Name</TableHead>
            <TableHead scope="col" className="text-right">Tonnes</TableHead>
            <TableHead scope="col" className="text-right">Price/Tonne</TableHead>
            <TableHead scope="col" className="text-right">Total Value</TableHead>
            <TableHead scope="col" className="text-center">Status</TableHead>
            <TableHead scope="col" className="text-center">Vintage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="font-medium">{position.projectName}</TableCell>
              <TableCell className="text-right">{formatNumber(position.tonnes)}</TableCell>
              <TableCell className="text-right">{formatCurrency(position.pricePerTonne)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(position.tonnes * position.pricePerTonne)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={position.status === 'available' ? 'default' : 'secondary'}
                  aria-label={`Status: ${position.status}`}
                >
                  {position.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{position.vintage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
