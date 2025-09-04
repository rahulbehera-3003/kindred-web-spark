import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompanyModal = ({ open, onOpenChange }: CompanyModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleManualAdd = () => {
    onOpenChange(false);
    navigate("/company");
  };

  const handleHRMSIntegration = async () => {
    try {
      console.log("Fetching HRMS users from Supabase...");
      
      const { data: hrmsUsers, error } = await supabase
        .from('hrms_users')
        .select('*');

      if (error) {
        console.error("Error fetching HRMS users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch HRMS users: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("HRMS Users fetched successfully:", hrmsUsers);
      console.log(`Total users found: ${hrmsUsers?.length || 0}`);
      
      // Log each user for detailed inspection
      if (hrmsUsers && hrmsUsers.length > 0) {
        hrmsUsers.forEach((user, index) => {
          console.log(`User ${index + 1}:`, user);
        });
      }

      toast({
        title: "HRMS Integration",
        description: `Successfully fetched ${hrmsUsers?.length || 0} users from HRMS system. Check console for details.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching HRMS users.",
        variant: "destructive",
      });
    }
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