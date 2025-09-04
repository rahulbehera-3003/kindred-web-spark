import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatItem {
  label: string;
  value: number;
  color: string;
}

interface StatCardProps {
  title: string;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  stats: StatItem[];
  totalLabel?: string;
  notice?: {
    text: string;
    action: string;
  };
}

export const StatCard = ({ 
  title, 
  actionLabel, 
  actionIcon, 
  stats, 
  totalLabel,
  notice 
}: StatCardProps) => {
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);
  
  return (
    <Card className="p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
          {actionIcon || <Plus className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-sm text-muted-foreground flex-1">{stat.label}</span>
              <span className="text-sm font-medium">({stat.value})</span>
            </div>
          ))}
          {totalLabel && (
            <div className="text-xs text-muted-foreground mt-2">
              {totalLabel}
            </div>
          )}
        </div>
      </div>

      {notice && (
        <div className="bg-accent/50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-sm text-accent-foreground">{notice.text}</span>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            {notice.action} 📧
          </Button>
        </div>
      )}
    </Card>
  );
};