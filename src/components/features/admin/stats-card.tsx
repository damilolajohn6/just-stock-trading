import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, change, icon: Icon, description }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="flex items-center text-xs text-muted-foreground mt-1">
          <span
            className={cn(
              "flex items-center font-medium mr-1",
              isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
            {Math.abs(change)}%
          </span>
          from last 30 days
        </p>
      </CardContent>
    </Card>
  );
}
