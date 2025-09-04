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
  Phone
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
      <div className="p-8 space-y-6">
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

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2 bg-muted">
            <TabsTrigger value="employees" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              All Employees
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            <div className="bg-card rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hrmsUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.team || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>{user.designation || 'N/A'}</TableCell>
                      <TableCell>{user.manager_name || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.company_joining_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.user_status ? "default" : "secondary"}>
                          {user.user_status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => {
                const teamUsers = getUsersByTeam(team);
                return (
                  <div key={team} className="bg-card rounded-lg border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{team}</h3>
                        <p className="text-sm text-muted-foreground">
                          {teamUsers.length} {teamUsers.length === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {teamUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.designation || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {teamUsers.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{teamUsers.length - 3} more members
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HRMSData;