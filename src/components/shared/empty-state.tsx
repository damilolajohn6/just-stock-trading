import Link from "next/link";
import { PackageSearch, SearchX, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  type?: "search" | "cart" | "orders" | "default";
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  className?: string;
}

const ICONS = {
  search: SearchX,
  cart: ShoppingBag,
  orders: PackageSearch,
  default: PackageSearch,
};

export function EmptyState({
  type = "default",
  title = "Nothing here yet",
  description = "We couldn't find what you're looking for.",
  actionHref,
  actionLabel,
  onAction,
  icon: CustomIcon,
  className,
}: EmptyStateProps) {
  const Icon = CustomIcon || ICONS[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center animate-fade-in",
        className,
      )}
    >
      <div className="rounded-full bg-muted p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <Button onClick={onAction} size="lg">
          {actionLabel || "Go Back"}
        </Button>
      ) : actionHref ? (
        <Button asChild size="lg">
          <Link href={actionHref}>{actionLabel || "Go Back"}</Link>
        </Button>
      ) : null}
    </div>
  );
}
