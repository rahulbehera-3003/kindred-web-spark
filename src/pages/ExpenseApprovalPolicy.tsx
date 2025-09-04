import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Users, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Plus,
  Trash2,
  HelpCircle
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

interface ApprovalRule {
  id: string;
  minAmount: string;
  maxAmount: string;
  approver: string;
  level: number;
}

interface TeamPolicy {
  teamName: string;
  rules: ApprovalRule[];
  suggestions: string[];
}

const ExpenseApprovalPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<HRMSUser[]>([]);
  const [teamPolicies, setTeamPolicies] = useState<TeamPolicy[]>([]);

  useEffect(() => {
    const { selectedTeams: teams = [], selectedUsers: userIds = [], hrmsUsers = [] } = location.state || {};
    
    const typedTeams = teams as string[];
    const typedUserIds = userIds as number[];
    const typedHrmsUsers = hrmsUsers as HRMSUser[];
    
    setSelectedTeams(typedTeams);
    
    // Filter selected users from all HRMS users
    const filteredUsers = typedHrmsUsers.filter((user: HRMSUser) => typedUserIds.includes(user.id));
    setSelectedUsers(filteredUsers);

    // Initialize team policies with suggestions
    const policies: TeamPolicy[] = typedTeams.map((team: string) => {
      const teamUsers = typedHrmsUsers.filter((user: HRMSUser) => user.team === team);
      const managers = [...new Set(teamUsers.map((user: HRMSUser) => user.manager_name).filter(Boolean))];
      
      // Generate team-specific suggestions
      const suggestions = generateTeamSuggestions(team, teamUsers, managers);
      
      return {
        teamName: team,
        rules: [
          {
            id: `${team}-rule-1`,
            minAmount: "0",
            maxAmount: "500",
            approver: managers[0] || "Team Lead",
            level: 1
          }
        ],
        suggestions
      };
    });

    setTeamPolicies(policies);
  }, [location.state]);

  const generateTeamSuggestions = (teamName: string, teamUsers: HRMSUser[], managers: string[]): string[] => {
    const suggestions = [
      `For ${teamName} team: Consider setting lower approval limits for junior members`,
      `Recommended: ${managers[0] || "Team Lead"} should approve expenses above $500`,
      `Suggestion: Auto-approve routine expenses under $100 for efficiency`,
    ];

    // Add team-specific suggestions based on team name
    if (teamName.toLowerCase().includes("engineering") || teamName.toLowerCase().includes("tech")) {
      suggestions.push("Tech teams often need higher limits for software subscriptions and cloud services");
      suggestions.push("Consider separate policies for development tools and hardware purchases");
    } else if (teamName.toLowerCase().includes("sales") || teamName.toLowerCase().includes("marketing")) {
      suggestions.push("Sales teams typically require flexible policies for client entertainment");
      suggestions.push("Consider higher limits for travel and marketing campaign expenses");
    } else if (teamName.toLowerCase().includes("finance") || teamName.toLowerCase().includes("accounting")) {
      suggestions.push("Finance teams may need stricter controls with multiple approval levels");
      suggestions.push("Consider requiring additional documentation for all expenses");
    } else if (teamName.toLowerCase().includes("hr") || teamName.toLowerCase().includes("people")) {
      suggestions.push("HR teams often need policies for recruitment and training expenses");
      suggestions.push("Consider separate approval workflows for employee benefits and events");
    }

    return suggestions;
  };

  const addRule = (teamIndex: number) => {
    const newPolicies = [...teamPolicies];
    const newRule: ApprovalRule = {
      id: `${newPolicies[teamIndex].teamName}-rule-${Date.now()}`,
      minAmount: "",
      maxAmount: "",
      approver: "",
      level: newPolicies[teamIndex].rules.length + 1
    };
    newPolicies[teamIndex].rules.push(newRule);
    setTeamPolicies(newPolicies);
  };

  const removeRule = (teamIndex: number, ruleIndex: number) => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex].rules.splice(ruleIndex, 1);
    setTeamPolicies(newPolicies);
  };

  const updateRule = (teamIndex: number, ruleIndex: number, field: keyof ApprovalRule, value: string) => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex].rules[ruleIndex][field] = value as never;
    setTeamPolicies(newPolicies);
  };

  const handleSavePolicies = () => {
    console.log("Saving expense approval policies:", teamPolicies);
    // TODO: Save policies to backend
    navigate("/company");
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
              <h1 className="text-2xl font-bold text-foreground">Edit expense approval policy</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-4xl">
                Set up spending policies and specify mandatory fields for expense submissions. Set up controls to flag transactions that fall outside policy 
                guidelines. Please note that these adjustments will be applied only to transactions happened after the modification and to any older transactions 
                that have not yet been approved.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Policy Configuration */}
        <div className="space-y-6">
          {/* Fields Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border">
              <div className="space-y-0">
                {/* Receipts */}
                <div className="flex items-center border-b p-6">
                  <div className="w-48">
                    <Label className="text-base font-medium">Receipts</Label>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="optional">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="not-required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Memo */}
                <div className="flex items-center border-b p-6">
                  <div className="w-48">
                    <Label className="text-base font-medium">Memo</Label>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="not-required">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="not-required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center border-b p-6">
                  <div className="w-48">
                    <Label className="text-base font-medium">Category</Label>
                  </div>
                  <div className="flex-1 flex gap-4">
                    <Select defaultValue="optional">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="not-required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="meals">Meals</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center border-b p-6">
                  <div className="w-48">
                    <Label className="text-base font-medium">Location</Label>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="optional">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="optional">Optional</SelectItem>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="not-required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Approval Limits */}
                <div className="flex items-center p-6">
                  <div className="w-48">
                    <Label className="text-base font-medium">Approval Limits</Label>
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="team-based">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="team-based">Team Based</SelectItem>
                        <SelectItem value="amount-based">Amount Based</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Expense submission timeline</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Establish submission deadlines for employees&apos; expense reports. Cards with overdue submissions will be automatically frozen until expenses are 
                    submitted.
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Label className="text-base font-medium w-64">Auto freeze card if expense is not submitted after</Label>
                    <Select defaultValue="never">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                        <SelectItem value="90">90</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="text-base">days</Label>
                  </div>

                  <div className="flex items-center gap-4">
                    <Label className="text-base font-medium w-64">Apply to expenses from</Label>
                    <Input 
                      type="date" 
                      defaultValue="2025-09-04"
                      className="w-48"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    The earliest expense pending submission in your company: 21 March 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Policies Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team-wise Approval Policies</h3>
                <div className="space-y-6">
                  {selectedTeams.map((team) => (
                    <div key={team} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="px-3 py-1">
                          {team}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Rule
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground mb-2">
                        <div>Amount Range</div>
                        <div>Approver</div>
                        <div>Approval Type</div>
                        <div>Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 items-center py-2 border-t">
                        <div className="flex gap-2">
                          <Input placeholder="Min" className="text-sm" />
                          <Input placeholder="Max" className="text-sm" />
                        </div>
                        <Select defaultValue="manager">
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="team-lead">Team Lead</SelectItem>
                            <SelectItem value="finance">Finance Team</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="single">
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="single">Single Approval</SelectItem>
                            <SelectItem value="dual">Dual Approval</SelectItem>
                            <SelectItem value="multi">Multi-level</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleSavePolicies} className="bg-primary hover:bg-primary/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Policy
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseApprovalPolicy;