import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompanyModal = ({ open, onOpenChange }: CompanyModalProps) => {
  const navigate = useNavigate();

  const handleManualAdd = () => {
    onOpenChange(false);
    navigate("/company");
  };

  const handleHRMSIntegration = () => {
    onOpenChange(false);
    // TODO: Navigate to HRMS integration page
    console.log("HRMS Integration selected");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Company Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button
            onClick={handleHRMSIntegration}
            variant="outline"
            className="w-full h-16 flex items-center gap-4 hover:bg-primary/10 border-2 hover:border-primary/30"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Integrate with HRMS System</div>
              <div className="text-sm text-muted-foreground">Connect your existing HR system</div>
            </div>
          </Button>

          <Button
            onClick={handleManualAdd}
            variant="outline"
            className="w-full h-16 flex items-center gap-4 hover:bg-primary/10 border-2 hover:border-primary/30"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Manually Add Employee</div>
              <div className="text-sm text-muted-foreground">Add employees one by one</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};