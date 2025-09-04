import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Users, 
  Building2,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  ChevronRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface HRMSUser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  department: string;
  team: string;
  designation: string;
  manager_name: string;
  company_joining_date: string;
  user_status: boolean;
}

const HRMSData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hrmsUsers, setHrmsUsers] = useState<HRMSUser[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    const users: HRMSUser[] = location.state?.hrmsUsers || [];
    setHrmsUsers(users);
    
    // Extract unique teams
    const uniqueTeams = [...new Set(users.map((user: HRMSUser) => user.team).filter((team): team is string => Boolean(team)))];
    setTeams(uniqueTeams);
  }, [location.state]);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getUsersByTeam = (team: string) => {
    return hrmsUsers.filter(user => user.team === team);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/company")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Company
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HRMS Integration</h1>
              <p className="text-muted-foreground">
                Showing {hrmsUsers.length} employees from {teams.length} teams
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{hrmsUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
                <p className="text-2xl font-bold">
                  {hrmsUsers.filter(user => user.user_status).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Teams Selection */}
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Select Teams</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedTeams.length} of {teams.length} selected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTeams(teams)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTeams([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {teams.map((team) => {
                const teamUsers = getUsersByTeam(team);
                const isSelected = selectedTeams.includes(team);
                
                return (
                  <div
                    key={team}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                      isSelected ? 'bg-primary/5 border-primary/20' : 'bg-background'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTeams(selectedTeams.filter(t => t !== team));
                      } else {
                        setSelectedTeams([...selectedTeams, team]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTeams([...selectedTeams, team]);
                        } else {
                          setSelectedTeams(selectedTeams.filter(t => t !== team));
                        }
                      }}
                    />
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{team}</p>
                      <p className="text-sm text-muted-foreground">
                        {teamUsers.length} {teamUsers.length === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employees Selection */}
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Select Employees</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedUsers.length} of {hrmsUsers.length} selected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers(hrmsUsers.map(user => user.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {hrmsUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                      isSelected ? 'bg-primary/5 border-primary/20' : 'bg-background'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      } else {
                        setSelectedUsers([...selectedUsers, user.id]);
                      }
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {user.team || 'No Team'}
                        </Badge>
                        <span>•</span>
                        <span>{user.designation || 'N/A'}</span>
                      </div>
                    </div>
                    <Badge variant={user.user_status ? "default" : "secondary"} className="text-xs">
                      {user.user_status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Next Button at Bottom Right */}
        <div className="flex justify-end pt-6 border-t bg-background sticky bottom-0">
          <Button
            size="lg"
            disabled={selectedTeams.length === 0 || selectedUsers.length === 0}
            onClick={() => {
              console.log("Selected teams:", selectedTeams);
              console.log("Selected users:", selectedUsers);
              
              // Navigate to expense approval policy page with data
              navigate("/expense-approval-policy", { 
                state: { 
                  selectedTeams, 
                  selectedUsers, 
                  hrmsUsers 
                } 
              });
            }}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 px-8 py-3"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRMSData;