import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Users, 
  Settings,
  CalendarIcon,
  HelpCircle,
  Save
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface HRMSUser {
  id: number;
  name: string;
  email: string;
  team: string;
  designation: string;
  manager_name: string;
  user_status: boolean;
}

interface ExpenseField {
  name: string;
  status: 'mandatory' | 'optional' | 'not-required';
}

interface TeamPolicy {
  teamName: string;
  fields: ExpenseField[];
  overdueDate: Date | undefined;
}

const ExpenseApprovalPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<HRMSUser[]>([]);
  const [teamPolicies, setTeamPolicies] = useState<TeamPolicy[]>([]);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Predefined fields that can be configured
  const defaultFields: ExpenseField[] = [
    { name: 'Receipts', status: 'optional' },
    { name: 'Memo', status: 'not-required' },
    { name: 'Category', status: 'optional' },
    { name: 'Location', status: 'optional' },
    { name: 'Project Code', status: 'not-required' },
    { name: 'Cost Center', status: 'not-required' },
  ];

  useEffect(() => {
    const { selectedTeams: teams = [], selectedUsers: userIds = [], hrmsUsers = [] } = location.state || {};
    
    const typedTeams = teams as string[];
    const typedUserIds = userIds as number[];
    const typedHrmsUsers = hrmsUsers as HRMSUser[];
    
    setSelectedTeams(typedTeams);
    
    // Filter selected users from all HRMS users
    const filteredUsers = typedHrmsUsers.filter((user: HRMSUser) => typedUserIds.includes(user.id));
    setSelectedUsers(filteredUsers);

    // Initialize team policies with default fields
    const policies: TeamPolicy[] = typedTeams.map((team: string) => ({
      teamName: team,
      fields: [...defaultFields], // Copy default fields for each team
      overdueDate: undefined
    }));

    setTeamPolicies(policies);
  }, [location.state]);

  const getTeamIndex = (teamName: string) => {
    return teamPolicies.findIndex(policy => policy.teamName === teamName);
  };

  const updateFieldStatus = (teamIndex: number, fieldIndex: number, status: 'mandatory' | 'optional' | 'not-required') => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex].fields[fieldIndex].status = status;
    setTeamPolicies(newPolicies);
  };

  const updateOverdueDate = (teamIndex: number, date: Date | undefined) => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex].overdueDate = date;
    setTeamPolicies(newPolicies);
  };

  const handleSavePolicies = () => {
    console.log("Saving expense approval policies:", teamPolicies);
    // Navigate to card approval flow with the team policies data
    navigate("/card-approval-flow", { state: { teamPolicies } });
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hrms-data")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Expense Policy Configuration</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-4xl">
                Configure mandatory fields and expense overdue settings for each team. Click on a team to customize their expense policy.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Team Configuration Grid */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Configuration</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Click on a team to configure their expense submission requirements and overdue settings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTeams.map((team) => {
                  const teamIndex = getTeamIndex(team);
                  const teamPolicy = teamPolicies[teamIndex];
                  
                  return (
                    <Dialog key={team} open={openDialog === team} onOpenChange={(open) => setOpenDialog(open ? team : null)}>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{team}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {teamPolicy?.fields.filter(f => f.status === 'mandatory').length || 0} mandatory fields
                                </p>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Settings className="w-4 h-4" />
                              <span>Configure team policy</span>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Badge variant="secondary">{team}</Badge>
                            <span>Expense Policy Configuration</span>
                          </DialogTitle>
                        </DialogHeader>
                        
                        {teamPolicy && (
                          <div className="space-y-6 mt-6">
                            {/* Field Requirements Section */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg">Field Requirements</h4>
                              <p className="text-sm text-muted-foreground">
                                Configure which fields are mandatory, optional, or not required for expense submissions.
                              </p>
                              
                              <div className="space-y-3">
                                {teamPolicy.fields.map((field, fieldIndex) => (
                                  <div key={field.name} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                      <Label className="text-base font-medium">{field.name}</Label>
                                    </div>
                                    <div className="w-48">
                                      <Select 
                                        value={field.status} 
                                        onValueChange={(value: 'mandatory' | 'optional' | 'not-required') => 
                                          updateFieldStatus(teamIndex, fieldIndex, value)
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border shadow-lg z-50">
                                          <SelectItem value="mandatory">Mandatory</SelectItem>
                                          <SelectItem value="optional">Optional</SelectItem>
                                          <SelectItem value="not-required">Not Required</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Expense Overdue Date Section */}
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg">Expense Overdue Settings</h4>
                              <p className="text-sm text-muted-foreground">
                                Set the deadline for expense submissions. Cards will be frozen after this date if expenses are not submitted.
                              </p>
                              
                              <div className="space-y-2">
                                <Label>Expense Submission Deadline</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !teamPolicy.overdueDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {teamPolicy.overdueDate ? format(teamPolicy.overdueDate, "PPP") : <span>Pick a deadline</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={teamPolicy.overdueDate}
                                      onSelect={(date) => updateOverdueDate(teamIndex, date)}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleSavePolicies} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseApprovalPolicy;