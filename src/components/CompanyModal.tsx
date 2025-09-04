import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TeamData {
  id: number;
  name: string;
  created_at: string;
  lead_user_id?: number;
}

interface TeamWithUsers extends TeamData {
  users: UserWithCards[];
}

interface UserWithCards {
  id: number;
  name: string | null;
  email: string | null;
  team: string | null;
  department: string | null;
  designation: string | null;
  manager_name: string | null;
  user_status: boolean | null;
  is_added: boolean | null;
  cards: any[];
}

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompanyModal = ({ open, onOpenChange }: CompanyModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleManualAdd = () => {
    onOpenChange(false);
    navigate("/company");
  };

  const handleHRMSIntegration = async () => {
    setIsLoading(true);
    try {
      // Check Supabase connection status
      console.log("🔌 Checking Supabase connection...");
      console.log("Supabase URL:", "https://rtxkgingsusqacsquzqs.supabase.co");
      console.log("Supabase client initialized:", !!supabase);
      
      console.log("📡 Fetching teams and users from Supabase...");
      
      // First, fetch all teams
      const teamsResponse = await (supabase as any)
        .from('teams')
        .select('*');

      const { data: teams, error: teamsError } = teamsResponse;

      if (teamsError) {
        console.error("❌ Failed to fetch teams:", teamsError);
        toast({
          title: "Error",
          description: "Failed to fetch teams: " + teamsError.message,
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Teams fetched successfully:", teams);
      console.log(`📈 Total teams found: ${teams?.length || 0}`);

      // Fetch all users from hrms_users (no filtering by is_added)
      const { data: allUsers, error: allUsersError } = await (supabase as any)
        .from('hrms_users')
        .select('*');

      if (allUsersError) {
        console.error("❌ Failed to fetch users:", allUsersError);
        toast({
          title: "Error",
          description: "Failed to fetch users: " + allUsersError.message,
          variant: "destructive",
        });
        return;
      }

      console.log("✅ All users fetched successfully:", allUsers);
      console.log(`📈 Total users found: ${allUsers?.length || 0}`);

      if (!teams || teams.length === 0) {
        console.log("⚠️ No teams found in teams table");
        toast({
          title: "No Teams Found",
          description: "No teams found in the database. Please add teams first.",
          variant: "destructive",
        });
        return;
      }

      if (!allUsers || allUsers.length === 0) {
        console.log("⚠️ No users found in hrms_users table");
        toast({
          title: "No Users Found",
          description: "No users found in the database.",
          variant: "destructive",
        });
        return;
      }

      // For each team, match users where team field matches team name
      const teamsWithUsers: TeamWithUsers[] = [];
      
      for (const teamData of teams as TeamData[]) {
        console.log(`👥 Matching users for team: ${teamData.name}`);
        
        // Filter users where user.team matches team.name
        const teamUsers = (allUsers as any[]).filter(user => 
          user.team && user.team.toString().trim().toLowerCase() === teamData.name.toString().trim().toLowerCase()
        );

        console.log(`📊 Users found for team ${teamData.name}:`, teamUsers.length);
        
        if (teamUsers.length > 0) {
          console.log("👤 Team users:", teamUsers.map(u => ({ name: u.name, team: u.team, id: u.id })));
        }

        // For each user, fetch their cards
        const usersWithCards: UserWithCards[] = [];
        
        for (const userData of teamUsers) {
          console.log(`💳 Fetching cards for user: ${userData.name} (ID: ${userData.id})`);
          
          // Fetch cards using any cast to bypass TypeScript issues
          const cardsResponse = await (supabase as any)
            .from('cards')
            .select('*')
            .eq('user_id', userData.id);

          const { data: cards, error: cardsError } = cardsResponse;

          if (cardsError) {
            console.error(`❌ Failed to fetch cards for user ${userData.id}:`, cardsError);
          }

          console.log(`💳 Cards found for user ${userData.name}:`, cards?.length || 0);

          usersWithCards.push({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            team: userData.team,
            department: userData.department,
            designation: userData.designation,
            manager_name: userData.manager_name,
            user_status: userData.user_status,
            is_added: userData.is_added,
            cards: cards || []
          });
        }

        teamsWithUsers.push({
          ...teamData,
          users: usersWithCards
        });
      }

      console.log("✅ Complete team structure fetched successfully!");
      console.log("📊 Teams with users and cards:", teamsWithUsers);
      
      // Log summary
      const totalUsers = teamsWithUsers.reduce((sum, team) => sum + team.users.length, 0);
      const totalCards = teamsWithUsers.reduce((sum, team) => 
        sum + team.users.reduce((userSum, user) => userSum + (user.cards?.length || 0), 0), 0
      );
      
      console.log(`📈 Summary: ${teamsWithUsers.length} teams, ${totalUsers} users, ${totalCards} cards`);

      // Also log team-by-team summary
      teamsWithUsers.forEach(team => {
        console.log(`📋 Team "${team.name}": ${team.users.length} users`);
        team.users.forEach(user => {
          console.log(`  - ${user.name} (${user.cards?.length || 0} cards)`);
        });
      });

      // Update is_added field to true for all fetched users
      console.log("🔄 Updating is_added field to true for all users...");
      const allUserIds = teamsWithUsers.flatMap(team => team.users.map(user => user.id));
      
      if (allUserIds.length > 0) {
        try {
          const { error: updateError } = await (supabase as any)
            .from('hrms_users')
            .update({ is_added: true })
            .in('id', allUserIds);
            
          if (updateError) {
            console.error("❌ Failed to update is_added field:", updateError);
          } else {
            console.log("✅ Successfully updated is_added field for", allUserIds.length, "users");
          }
        } catch (updateErr) {
          console.error("💥 Error updating is_added field:", updateErr);
        }
      }

      // Navigate directly to company page instead of HRMS data page
      onOpenChange(false);
      toast({
        title: "Success",
        description: `Successfully imported ${totalUsers} employees from ${teamsWithUsers.length} teams`,
        variant: "default",
      });
      navigate("/company");

    } catch (error) {
      console.error("💥 Unexpected error during Supabase operation:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching HRMS data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className="w-full h-16 flex items-center gap-4 hover:bg-primary/10 border-2 hover:border-primary/30 disabled:opacity-60"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">
                {isLoading ? "Connecting to HRMS..." : "Integrate with HRMS System"}
              </div>
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Fetching employee data..." : "Connect your existing HR system"}
              </div>
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