import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  HelpCircle,
  Save,
  X,
  Plus
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ApprovalLevel {
  id: string;
  level: number;
  type: 'auto-approve' | 'user' | 'role';
  value: string;
  description: string;
}

const CardApprovalFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [minLimit, setMinLimit] = useState("0");
  const [maxLimit, setMaxLimit] = useState("Infinity");
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    {
      id: "1",
      level: 1,
      type: 'auto-approve',
      value: 'Auto Approve cards created by Admins',
      description: 'Auto Approve cards created by Admins'
    }
  ]);

  useEffect(() => {
    // Get data from previous step if needed
    console.log("Card approval flow data:", location.state);
  }, [location.state]);

  const removeApprovalLevel = (levelId: string) => {
    setApprovalLevels(prev => prev.filter(level => level.id !== levelId));
  };

  const addApprovalLevel = () => {
    const nextLevel = approvalLevels.length + 1;
    const newLevel: ApprovalLevel = {
      id: nextLevel.toString(),
      level: nextLevel,
      type: 'user',
      value: '',
      description: `Level ${nextLevel} approval`
    };
    setApprovalLevels(prev => [...prev, newLevel]);
  };

  const updateApprovalLevel = (levelId: string, field: keyof ApprovalLevel, value: string) => {
    setApprovalLevels(prev => 
      prev.map(level => 
        level.id === levelId 
          ? { ...level, [field]: value }
          : level
      )
    );
  };

  const handleSaveApprovals = () => {
    console.log("Saving card approval configuration:", {
      minLimit,
      maxLimit,
      approvalLevels
    });
    // TODO: Save approval configuration to backend
    navigate("/company");
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/expense-approval-policy")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Card Approval Configuration</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Set up multi-level approval workflows for expense card transactions
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Card Limit Configuration */}
        <div className="bg-card rounded-lg border p-6">
          {/* Limit Range Display */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground mb-4">
              <span>All cards with limit</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-muted text-foreground font-medium px-3 py-1">
                  AED {minLimit}
                </Badge>
                <span>/month</span>
                <span>to</span>
                <Badge variant="outline" className="bg-muted text-foreground font-medium px-3 py-1">
                  AED {maxLimit}
                </Badge>
                <span>/month</span>
              </div>
              <span>will need to be approved by</span>
            </div>
            
            {/* Policy Description */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium">i</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  This policy will apply to all cards with a monthly/approval-based/total limit of AED 1,927,041,994.00 or less, and a daily limit of AED 64,234,733.13 or less.
                </div>
              </div>
            </div>
          </div>

          {/* Approval Levels */}
          <div className="space-y-4">
            {approvalLevels.map((level) => (
              <div key={level.id} className="flex items-center gap-4">
                {/* Level Number */}
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {level.level}
                </div>
                
                {/* Approval Configuration */}
                <div className="flex-1 border rounded-lg p-4">
                  {level.type === 'auto-approve' ? (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="px-3 py-1">
                        {level.description}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApprovalLevel(level.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        {level.value ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{level.value}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateApprovalLevel(level.id, 'value', '')}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <button 
                            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                            onClick={() => {
                              const approver = prompt("Enter approver name or role:");
                              if (approver) {
                                updateApprovalLevel(level.id, 'value', approver);
                              }
                            }}
                          >
                            Click here to add Level {level.level} approval
                          </button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApprovalLevel(level.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Approver */}
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={addApprovalLevel}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add another approver
            </Button>
          </div>
        </div>

        {/* Limit Configuration */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Configure Card Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLimit">Minimum Limit (AED)</Label>
              <Input
                id="minLimit"
                type="number"
                value={minLimit}
                onChange={(e) => setMinLimit(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLimit">Maximum Limit</Label>
              <Select value={maxLimit} onValueChange={setMaxLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="1000">AED 1,000</SelectItem>
                  <SelectItem value="5000">AED 5,000</SelectItem>
                  <SelectItem value="10000">AED 10,000</SelectItem>
                  <SelectItem value="50000">AED 50,000</SelectItem>
                  <SelectItem value="100000">AED 100,000</SelectItem>
                  <SelectItem value="Infinity">Infinity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleSaveApprovals} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CardApprovalFlow;