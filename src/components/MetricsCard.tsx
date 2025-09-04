import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ title, value, subtitle, trend, className }: MetricCardProps) => {
  return (
    <Card className={cn(
      "p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300 cursor-pointer group",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {trend && (
          <TrendingUp className={cn(
            "w-5 h-5 mb-1",
            trend === "up" ? "text-success" : "text-destructive rotate-180"
          )} />
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </Card>
  );
};

interface MetricsCardProps {
  title: string;
  dateRange: string;
}

export const MetricsCard = ({ title, dateRange }: MetricsCardProps) => {
  const metrics = [
    {
      title: "Pending Submission",
      value: "161",
      subtitle: "of 5273 expenses"
    },
    {
      title: "Pending Approval", 
      value: "5139",
      subtitle: "of 5273 expenses"
    },
    {
      title: "Pending Export",
      value: "5282", 
      subtitle: "of 5284 expenses"
    }
  ];

  return (
    <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="text-sm text-muted-foreground">{dateRange}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
          />
        ))}
      </div>
    </Card>
  );
};