import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Info, Settings, Smartphone, Wallet } from "lucide-react";
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
    cardHolderName: "",
    fundingWallet: "primary",
    cardNickname: "",
    cardType: "virtual",
    spendControlType: "daily",
    dailyLimit: "0",
    currency: "AED",
    allowedCountries: "United Arab Emirates",
    categoryControl: "allow-all",
    perTransactionLimit: false,
    onlineTransactions: true,
    contactlessTransactions: true
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCard = async () => {
    if (!formData.cardHolderName || !formData.cardNickname) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // For now, we'll create a basic card entry since the schema doesn't support all the fields
      const selectedEmployee = employees.find(emp => emp.name === formData.cardHolderName);
      
      const { error } = await (supabase as any)
        .from('cards')
        .insert([
          {
            user_id: selectedEmployee?.id || null,
            card_holder_name: formData.cardHolderName,
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
      <div className="p-8 space-y-6 max-w-2xl mx-auto">
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
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Company Card</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Set up a new company card with spending controls
            </p>
          </div>
        </div>

        {/* Card Details Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-primary" />
              Card Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardHolderName">Cardholder Name</Label>
              <Select value={formData.cardHolderName} onValueChange={(value) => handleInputChange('cardHolderName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingWallet">Funding Wallet</Label>
              <Select value={formData.fundingWallet} onValueChange={(value) => handleInputChange('fundingWallet', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Wallet</SelectItem>
                  <SelectItem value="secondary">Secondary Wallet</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Once the card is issued, the funding wallet linked to the card cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNickname">Card Nickname</Label>
              <Input
                id="cardNickname"
                value={formData.cardNickname}
                onChange={(e) => handleInputChange('cardNickname', e.target.value)}
                placeholder="Work related expenses"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Card Type</Label>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <RadioGroup value={formData.cardType} onValueChange={(value) => handleInputChange('cardType', value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-primary/5 border-primary/20">
                    <RadioGroupItem value="virtual" id="virtual" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <Label htmlFor="virtual" className="font-medium">Virtual</Label>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          Recommended
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground flex-1">
                          Instant Activation. Compatible with Apple & Google Pay. No risk of theft. Hassle-Free!
                        </p>
                        <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">💳</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="physical" id="physical" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <Label htmlFor="physical" className="font-medium">Physical</Label>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground flex-1">
                          Takes 3 business days for delivery. One card per employee. Suggested card for international travellers.
                        </p>
                        <div className="w-8 h-5 bg-gray-800 rounded">
                          <div className="w-full h-full rounded bg-gradient-to-br from-gray-700 to-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Spend Control & Restrictions Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-primary" />
              Spend Control & Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Spend Control</Label>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <Select value={formData.spendControlType} onValueChange={(value) => handleInputChange('spendControlType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Limit</SelectItem>
                  <SelectItem value="weekly">Weekly Limit</SelectItem>
                  <SelectItem value="monthly">Monthly Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Limit</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm font-medium">{formData.currency}</span>
                </div>
                <Input
                  value={formData.dailyLimit}
                  onChange={(e) => handleInputChange('dailyLimit', e.target.value)}
                  className="rounded-l-none"
                  type="number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Allowed Merchant Countries</Label>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">{formData.allowedCountries}</span>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Controls Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-primary" />
              Advanced Controls
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                2 New
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Category Controls</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Restrict spending on this Alaan card to merchant categories. By default, all categories are allowed.
                </p>
                <div className="space-y-2">
                  <Label>Control Type</Label>
                  <Select value={formData.categoryControl} onValueChange={(value) => handleInputChange('categoryControl', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow-all">Allow all categories</SelectItem>
                      <SelectItem value="restrict">Restrict categories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Per Transaction Limit</Label>
                  <p className="text-sm text-muted-foreground">
                    Any transaction greater than the limit will be declined. Click to enable.
                  </p>
                </div>
                <Switch
                  checked={formData.perTransactionLimit}
                  onCheckedChange={(checked) => handleInputChange('perTransactionLimit', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Online Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allowed to make online transactions.
                  </p>
                </div>
                <Switch
                  checked={formData.onlineTransactions}
                  onCheckedChange={(checked) => handleInputChange('onlineTransactions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Contactless Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allowed for contactless payments using Apple Pay, Google Pay, or tapping your physical card.
                  </p>
                </div>
                <Switch
                  checked={formData.contactlessTransactions}
                  onCheckedChange={(checked) => handleInputChange('contactlessTransactions', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <Button 
          onClick={handleCreateCard} 
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
          size="lg"
        >
          {isSaving ? 'Creating Card...' : 'Create Card Now'}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CreateCompanyCard;