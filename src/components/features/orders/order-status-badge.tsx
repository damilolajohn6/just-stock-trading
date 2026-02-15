import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_CONFIG, type OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
  
  // Map our config colors to Badge variants/classes
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' = 'secondary';
  
  switch (config.color) {
    case 'green':
      variant = 'success';
      break;
    case 'yellow':
      variant = 'warning';
      break;
    case 'blue':
    case 'indigo':
    case 'purple':
      variant = 'default';
      break;
    case 'red':
      variant = 'destructive';
      break;
    case 'gray':
      variant = 'outline';
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {config.label}
    </Badge>
  );
}
