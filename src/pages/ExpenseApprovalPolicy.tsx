import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Users, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Plus,
  Trash2,
  HelpCircle,
  Settings,
  Tag,
  Calendar,
  X
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
  expenseTags: string[];
  submissionDeadline: string;
  autoFreeze: boolean;
  freezeDays: string;
}

interface TeamDialogData {
  team: string;
  isOpen: boolean;
}

const ExpenseApprovalPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<HRMSUser[]>([]);
  const [teamPolicies, setTeamPolicies] = useState<TeamPolicy[]>([]);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>("");

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
        suggestions,
        expenseTags: ["Travel", "Meals", "Office Supplies"],
        submissionDeadline: "2025-09-04",
        autoFreeze: true,
        freezeDays: "30"
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

  const addTag = (teamIndex: number) => {
    if (newTag.trim()) {
      const newPolicies = [...teamPolicies];
      if (!newPolicies[teamIndex].expenseTags.includes(newTag.trim())) {
        newPolicies[teamIndex].expenseTags.push(newTag.trim());
        setTeamPolicies(newPolicies);
      }
      setNewTag("");
    }
  };

  const removeTag = (teamIndex: number, tagToRemove: string) => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex].expenseTags = newPolicies[teamIndex].expenseTags.filter(tag => tag !== tagToRemove);
    setTeamPolicies(newPolicies);
  };

  const updateTeamPolicy = (teamIndex: number, field: keyof TeamPolicy, value: string | boolean) => {
    const newPolicies = [...teamPolicies];
    newPolicies[teamIndex][field] = value as never;
    setTeamPolicies(newPolicies);
  };

  const getTeamIndex = (teamName: string) => {
    return teamPolicies.findIndex(policy => policy.teamName === teamName);
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

          {/* Team List Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team Configuration</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Click on a team to configure expense tags, submission deadlines, and approval policies.
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
                                    {teamPolicy?.expenseTags.length || 0} tags configured
                                  </p>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Settings className="w-4 h-4" />
                                <span>Configure team settings</span>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border shadow-lg">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Badge variant="secondary">{team}</Badge>
                              <span>Team Configuration</span>
                            </DialogTitle>
                          </DialogHeader>
                          
                          {teamPolicy && (
                            <div className="space-y-6 mt-6">
                              {/* Expense Tags Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Tag className="w-5 h-5 text-primary" />
                                  <h4 className="font-semibold">Expense Tags</h4>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {teamPolicy.expenseTags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      {tag}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => removeTag(teamIndex, tag)}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add new expense tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTag(teamIndex)}
                                    className="flex-1"
                                  />
                                  <Button onClick={() => addTag(teamIndex)} size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Tag
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Expense Submission Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-5 h-5 text-primary" />
                                  <h4 className="font-semibold">Expense Submission</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Submission Deadline</Label>
                                    <Input
                                      type="date"
                                      value={teamPolicy.submissionDeadline}
                                      onChange={(e) => updateTeamPolicy(teamIndex, 'submissionDeadline', e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Auto-freeze after (days)</Label>
                                    <Select 
                                      value={teamPolicy.freezeDays} 
                                      onValueChange={(value) => updateTeamPolicy(teamIndex, 'freezeDays', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-background border shadow-lg z-50">
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="60">60 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                        <SelectItem value="never">Never</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Approval Rules Section */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    <h4 className="font-semibold">Approval Rules</h4>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => addRule(teamIndex)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Rule
                                  </Button>
                                </div>
                                
                                <div className="space-y-4">
                                  {teamPolicy.rules.map((rule, ruleIndex) => (
                                    <div key={rule.id} className="border rounded-lg p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm">Min Amount ($)</Label>
                                          <Input
                                            type="number"
                                            value={rule.minAmount}
                                            onChange={(e) => updateRule(teamIndex, ruleIndex, 'minAmount', e.target.value)}
                                            placeholder="0"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm">Max Amount ($)</Label>
                                          <Input
                                            type="number"
                                            value={rule.maxAmount}
                                            onChange={(e) => updateRule(teamIndex, ruleIndex, 'maxAmount', e.target.value)}
                                            placeholder="1000"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm">Approver</Label>
                                          <Select 
                                            value={rule.approver} 
                                            onValueChange={(value) => updateRule(teamIndex, ruleIndex, 'approver', value)}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border shadow-lg z-50">
                                              <SelectItem value="manager">Manager</SelectItem>
                                              <SelectItem value="team-lead">Team Lead</SelectItem>
                                              <SelectItem value="finance">Finance Team</SelectItem>
                                              <SelectItem value="director">Director</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-end">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRule(teamIndex, ruleIndex)}
                                            className="text-destructive hover:bg-destructive/10"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Suggestions Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="w-5 h-5 text-primary" />
                                  <h4 className="font-semibold">AI Suggestions</h4>
                                </div>
                                
                                <div className="space-y-2">
                                  {teamPolicy.suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                      <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      <p className="text-sm">{suggestion}</p>
                                    </div>
                                  ))}
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