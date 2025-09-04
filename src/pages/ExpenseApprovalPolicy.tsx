import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trash2
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to HRMS Data
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense Approval Policies</h1>
              <p className="text-muted-foreground">
                Create approval workflows for {selectedTeams.length} selected teams
              </p>
            </div>
          </div>
          <Button onClick={handleSavePolicies} className="bg-primary hover:bg-primary/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save All Policies
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected Teams</p>
                  <p className="text-2xl font-bold">{selectedTeams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected Users</p>
                  <p className="text-2xl font-bold">{selectedUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{teamPolicies.reduce((acc, policy) => acc + policy.rules.length, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Policies */}
        <div className="space-y-8">
          {teamPolicies.map((policy, teamIndex) => (
            <Card key={policy.teamName} className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      {policy.teamName}
                    </Badge>
                    <CardTitle className="text-xl">Expense Approval Policy</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRule(teamIndex)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
                <CardDescription>
                  Configure approval workflows and spending limits for the {policy.teamName} team
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Suggestions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Suggestions for {policy.teamName}</h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {policy.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Approval Rules */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Approval Rules</h4>
                  {policy.rules.map((rule, ruleIndex) => (
                    <div key={rule.id} className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">Level {rule.level}</Badge>
                        {policy.rules.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRule(teamIndex, ruleIndex)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`min-${rule.id}`}>Min Amount ($)</Label>
                          <Input
                            id={`min-${rule.id}`}
                            type="number"
                            placeholder="0"
                            value={rule.minAmount}
                            onChange={(e) => updateRule(teamIndex, ruleIndex, "minAmount", e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`max-${rule.id}`}>Max Amount ($)</Label>
                          <Input
                            id={`max-${rule.id}`}
                            type="number"
                            placeholder="1000"
                            value={rule.maxAmount}
                            onChange={(e) => updateRule(teamIndex, ruleIndex, "maxAmount", e.target.value)}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor={`approver-${rule.id}`}>Approver</Label>
                          <Select
                            value={rule.approver}
                            onValueChange={(value) => updateRule(teamIndex, ruleIndex, "approver", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select approver" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="Team Lead">Team Lead</SelectItem>
                              <SelectItem value="Department Manager">Department Manager</SelectItem>
                              <SelectItem value="Finance Team">Finance Team</SelectItem>
                              <SelectItem value="CEO">CEO</SelectItem>
                              {/* Add managers from the team */}
                              {selectedUsers
                                .filter(user => user.team === policy.teamName && user.manager_name)
                                .map(user => (
                                  <SelectItem key={user.manager_name} value={user.manager_name}>
                                    {user.manager_name}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        Expenses between ${rule.minAmount || "0"} - ${rule.maxAmount || "∞"} require approval from {rule.approver || "selected approver"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseApprovalPolicy;