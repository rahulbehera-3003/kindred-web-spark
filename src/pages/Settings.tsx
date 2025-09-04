import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Heart, Home, Settings as SettingsIcon, Users, CreditCard } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  // State for Birthday Cards
  const [birthdayEnabled, setBirthdayEnabled] = useState(true);
  const [birthdayAmount, setBirthdayAmount] = useState("AED 200");
  const [birthdayValidFor, setBirthdayValidFor] = useState("30 days");
  const [birthdayCategories, setBirthdayCategories] = useState({
    dining: true,
    shopping: false,
    travel: false
  });

  // State for Anniversary Cards
  const [anniversaryEnabled, setAnniversaryEnabled] = useState(true);
  const [anniversaryAmount, setAnniversaryAmount] = useState("AED 500 x Years");
  const [anniversaryMinYears, setAnniversaryMinYears] = useState("1 year");
  const [anniversaryMaxAmount, setAnniversaryMaxAmount] = useState("AED 10,000");

  // State for Home Office Setup
  const [homeOfficeEnabled, setHomeOfficeEnabled] = useState(false);
  const [homeOfficeBudget, setHomeOfficeBudget] = useState("AED 3,000");
  const [homeOfficeTrigger, setHomeOfficeTrigger] = useState("New hire (first week)");
  const [homeOfficeCategories, setHomeOfficeCategories] = useState({
    officeEquipment: true,
    furniture: true,
    technology: false
  });

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your application settings and configurations
            </p>
          </div>
        </div>

        <Tabs defaultValue="expense-benefits" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expense-benefits" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Expense Benefit Cards
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense-benefits" className="space-y-6 mt-6">
            <div className="space-y-6">
              {/* Birthday Cards */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Birthday Cards</CardTitle>
                        <p className="text-sm text-muted-foreground">Automatic gift cards</p>
                      </div>
                    </div>
                    <Switch
                      checked={birthdayEnabled}
                      onCheckedChange={setBirthdayEnabled}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Card Amount</label>
                      <Select value={birthdayAmount} onValueChange={setBirthdayAmount}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED 100">AED 100</SelectItem>
                          <SelectItem value="AED 200">AED 200</SelectItem>
                          <SelectItem value="AED 300">AED 300</SelectItem>
                          <SelectItem value="AED 500">AED 500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Valid For</label>
                      <Select value={birthdayValidFor} onValueChange={setBirthdayValidFor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7 days">7 days</SelectItem>
                          <SelectItem value="15 days">15 days</SelectItem>
                          <SelectItem value="30 days">30 days</SelectItem>
                          <SelectItem value="60 days">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Categories</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="birthday-dining"
                          checked={birthdayCategories.dining}
                          onCheckedChange={(checked) =>
                            setBirthdayCategories(prev => ({ ...prev, dining: checked as boolean }))
                          }
                        />
                        <label htmlFor="birthday-dining" className="text-sm text-foreground">
                          Dining & Entertainment
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="birthday-shopping"
                          checked={birthdayCategories.shopping}
                          onCheckedChange={(checked) =>
                            setBirthdayCategories(prev => ({ ...prev, shopping: checked as boolean }))
                          }
                        />
                        <label htmlFor="birthday-shopping" className="text-sm text-foreground">
                          Shopping
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="birthday-travel"
                          checked={birthdayCategories.travel}
                          onCheckedChange={(checked) =>
                            setBirthdayCategories(prev => ({ ...prev, travel: checked as boolean }))
                          }
                        />
                        <label htmlFor="birthday-travel" className="text-sm text-foreground">
                          Travel
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anniversary Cards */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Anniversary Cards</CardTitle>
                        <p className="text-sm text-muted-foreground">Work anniversary rewards</p>
                      </div>
                    </div>
                    <Switch
                      checked={anniversaryEnabled}
                      onCheckedChange={setAnniversaryEnabled}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Amount Per Year</label>
                      <Select value={anniversaryAmount} onValueChange={setAnniversaryAmount}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED 300 x Years">AED 300 x Years</SelectItem>
                          <SelectItem value="AED 500 x Years">AED 500 x Years</SelectItem>
                          <SelectItem value="AED 750 x Years">AED 750 x Years</SelectItem>
                          <SelectItem value="AED 1000 x Years">AED 1000 x Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Minimum Years</label>
                      <Select value={anniversaryMinYears} onValueChange={setAnniversaryMinYears}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 year">1 year</SelectItem>
                          <SelectItem value="2 years">2 years</SelectItem>
                          <SelectItem value="3 years">3 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Max Amount</label>
                      <Input
                        value={anniversaryMaxAmount}
                        onChange={(e) => setAnniversaryMaxAmount(e.target.value)}
                        placeholder="AED 10,000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Home Office Setup */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Home Office Setup</CardTitle>
                        <p className="text-sm text-muted-foreground">New employee equipment</p>
                      </div>
                    </div>
                    <Switch
                      checked={homeOfficeEnabled}
                      onCheckedChange={setHomeOfficeEnabled}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Budget Per Employee</label>
                      <Select value={homeOfficeBudget} onValueChange={setHomeOfficeBudget}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED 2,000">AED 2,000</SelectItem>
                          <SelectItem value="AED 3,000">AED 3,000</SelectItem>
                          <SelectItem value="AED 5,000">AED 5,000</SelectItem>
                          <SelectItem value="AED 7,500">AED 7,500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Trigger</label>
                      <Select value={homeOfficeTrigger} onValueChange={setHomeOfficeTrigger}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New hire (first day)">New hire (first day)</SelectItem>
                          <SelectItem value="New hire (first week)">New hire (first week)</SelectItem>
                          <SelectItem value="New hire (first month)">New hire (first month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Categories</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="home-office-equipment"
                          checked={homeOfficeCategories.officeEquipment}
                          onCheckedChange={(checked) =>
                            setHomeOfficeCategories(prev => ({ ...prev, officeEquipment: checked as boolean }))
                          }
                        />
                        <label htmlFor="home-office-equipment" className="text-sm text-foreground">
                          Office Equipment
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="home-furniture"
                          checked={homeOfficeCategories.furniture}
                          onCheckedChange={(checked) =>
                            setHomeOfficeCategories(prev => ({ ...prev, furniture: checked as boolean }))
                          }
                        />
                        <label htmlFor="home-furniture" className="text-sm text-foreground">
                          Furniture
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="home-technology"
                          checked={homeOfficeCategories.technology}
                          onCheckedChange={(checked) =>
                            setHomeOfficeCategories(prev => ({ ...prev, technology: checked as boolean }))
                          }
                        />
                        <label htmlFor="home-technology" className="text-sm text-foreground">
                          Technology
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">General settings will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Team management settings will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification preferences will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;