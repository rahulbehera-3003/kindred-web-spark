import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  name: string;
  balance: string;
  status?: "Low Funds";
  icon?: React.ReactNode;
}

export const WalletCard = ({ name, balance, status, icon }: WalletCardProps) => {
  return (
    <Card className="p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          {icon || <Wallet className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted-foreground truncate">{name}</div>
          {status && (
            <div className="inline-flex items-center px-2 py-1 text-xs bg-destructive/10 text-destructive rounded-full mt-1">
              {status}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">{balance}</div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-center text-primary border-primary/20 hover:bg-primary/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Funds
      </Button>
    </Card>
  );
};