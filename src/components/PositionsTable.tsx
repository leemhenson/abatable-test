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
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead className="text-right">Tonnes</TableHead>
            <TableHead className="text-right">Price/Tonne</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Vintage</TableHead>
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
                <Badge variant={position.status === 'available' ? 'default' : 'secondary'}>
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
