import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Gift, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  name: string;
  team: string;
  email: string;
}

const CreateEmployeeBenefitCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: "",
    cardNickname: "",
    cardType: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: users, error } = await (supabase as any)
        .from('hrms_users')
        .select('id, name, team, email')
        .eq('is_added', true);

      if (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to fetch employees",
          variant: "destructive",
        });
      } else {
        setEmployees(users || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.userId || !formData.cardNickname || !formData.cardType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(formData.userId));
      
      const { error } = await (supabase as any)
        .from('cards')
        .insert([
          {
            user_id: parseInt(formData.userId),
            card_holder_name: selectedEmployee?.name || '',
            card_nickname: formData.cardNickname,
            card_no: `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
            expiry_mm: 12,
            expiry_yy: 25,
            card_type: formData.cardType
          }
        ]);

      if (error) {
        console.error('Error creating card:', error);
        toast({
          title: "Error",
          description: "Failed to create employee benefit card",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Employee benefit card created successfully",
        });
        navigate('/cards');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cards")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Employee Benefit Card</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new employee benefit card for rewards and perks
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee *</Label>
                  <Select value={formData.userId} onValueChange={(value) => handleInputChange('userId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{employee.name}</span>
                            <span className="text-sm text-muted-foreground">{employee.email} • {employee.team}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNickname">Card Name *</Label>
                  <Input
                    id="cardNickname"
                    value={formData.cardNickname}
                    onChange={(e) => handleInputChange('cardNickname', e.target.value)}
                    placeholder="Enter card name (e.g., Birthday Card, Wellness Card)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardType">Card Type *</Label>
                  <Select value={formData.cardType} onValueChange={(value) => handleInputChange('cardType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wellness">Wellness Benefits</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="meal_voucher">Meal Voucher</SelectItem>
                      <SelectItem value="gym_membership">Gym Membership</SelectItem>
                      <SelectItem value="learning_development">Learning & Development</SelectItem>
                      <SelectItem value="birthday_gift">Birthday Gift</SelectItem>
                      <SelectItem value="performance_bonus">Performance Bonus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Creating Card...' : 'Create Card'}
                </Button>
                <Button variant="outline" onClick={() => navigate('/cards')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEmployeeBenefitCard;