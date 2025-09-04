import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  name: string;
  team: string;
}

const CreateCompanyCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: "",
    cardHolderName: "",
    cardNo: "",
    expiryMM: "",
    expiryYY: "",
    cardType: "company"
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: users, error } = await (supabase as any)
        .from('hrms_users')
        .select('id, name, team')
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.userId || !formData.cardHolderName || !formData.cardNo || !formData.expiryMM || !formData.expiryYY) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await (supabase as any)
        .from('cards')
        .insert([
          {
            user_id: parseInt(formData.userId),
            card_holder_name: formData.cardHolderName,
            card_no: formData.cardNo,
            expiry_mm: parseInt(formData.expiryMM),
            expiry_yy: parseInt(formData.expiryYY),
            card_type: formData.cardType
          }
        ]);

      if (error) {
        console.error('Error creating card:', error);
        toast({
          title: "Error",
          description: "Failed to create company card",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Company card created successfully",
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Company Card</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new company card for business expenses
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
                          {employee.name} - {employee.team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardHolderName">Card Holder Name *</Label>
                  <Input
                    id="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    placeholder="Enter card holder name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNo">Card Number *</Label>
                  <Input
                    id="cardNo"
                    value={formData.cardNo}
                    onChange={(e) => handleInputChange('cardNo', e.target.value)}
                    placeholder="Enter card number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMM">Expiry Month *</Label>
                    <Select value={formData.expiryMM} onValueChange={(value) => handleInputChange('expiryMM', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryYY">Expiry Year *</Label>
                    <Select value={formData.expiryYY} onValueChange={(value) => handleInputChange('expiryYY', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <SelectItem key={year} value={year.toString().slice(-2)}>
                            {year.toString().slice(-2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Card'}
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

export default CreateCompanyCard;