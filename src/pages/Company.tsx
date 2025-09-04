import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search, 
  Download, 
  Filter, 
  Columns3, 
  UserPlus, 
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  Loader2
} from "lucide-react";
import { CompanyModal } from "@/components/CompanyModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: number;
  name: string;
  email: string;
  team: string;
  department: string;
  designation: string;
  manager_name: string;
  user_status: boolean;
  phone_number: string;
  company_joining_date: string;
}

interface Team {
  id: number;
  name: string;
  lead_user_id?: number;
  created_at: string;
}

const Company = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const fetchEmployeesAndTeams = async () => {
    try {
      setIsLoading(true);
      console.log("📡 Fetching employees and teams from Supabase...");

      // Fetch employees with is_added = true
      const { data: employeesData, error: employeesError } = await (supabase as any)
        .from('hrms_users')
        .select('*')
        .eq('is_added', true);

      if (employeesError) {
        console.error("❌ Failed to fetch employees:", employeesError);
      } else {
        console.log("✅ Employees fetched successfully:", employeesData);
        setEmployees(employeesData || []);
      }

      // Fetch teams
      const { data: teamsData, error: teamsError } = await (supabase as any)
        .from('teams')
        .select('*');

      if (teamsError) {
        console.error("❌ Failed to fetch teams:", teamsError);
      } else {
        console.log("✅ Teams fetched successfully:", teamsData);
        setTeams(teamsData || []);
      }

    } catch (error) {
      console.error("💥 Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndTeams();
  }, []);

  // Refresh data when modal closes (after potential import)
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Refresh data after modal closes
      fetchEmployeesAndTeams();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company</h1>
            <p className="text-muted-foreground mt-2">
              {employees.length} employees • {teams.length} teams
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <span className="mr-2">ℹ️</span>
              Learn More
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/cards")}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Cards
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenModal}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Employees
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2 bg-muted">
            <TabsTrigger value="employees" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              Employees ({employees.length})
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              Teams ({teams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading employees...</span>
              </div>
            ) : employees.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No employees found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Get started by adding your first employee or integrating with your HRMS system.
                </p>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenModal}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            ) : (
              /* Employees Table */
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="pl-10 w-80"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Columns3 className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </div>
                </div>

                {/* Employees Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {employee.team || 'No Team'}
                            </Badge>
                          </TableCell>
                          <TableCell>{employee.department || 'N/A'}</TableCell>
                          <TableCell>{employee.designation || 'N/A'}</TableCell>
                          <TableCell>{employee.manager_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={employee.user_status ? "default" : "secondary"} className="text-xs">
                              {employee.user_status ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(employee.company_joining_date)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Clock className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing 1-{employees.length} of {employees.length} employees
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading teams...</span>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No teams found. Teams will be automatically created when you import employees.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => {
                  const teamEmployees = employees.filter(emp => emp.team === team.name);
                  return (
                    <div key={team.id} className="bg-card rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {teamEmployees.length} {teamEmployees.length === 1 ? 'member' : 'members'}
                          </p>
                        </div>
                      </div>
                      {teamEmployees.length > 0 && (
                        <div className="flex -space-x-2">
                          {teamEmployees.slice(0, 3).map((emp) => (
                            <Avatar key={emp.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {getInitials(emp.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {teamEmployees.length > 3 && (
                            <div className="h-6 w-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-medium">+{teamEmployees.length - 3}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CompanyModal open={isModalOpen} onOpenChange={handleModalChange} />
    </DashboardLayout>
  );
};

export default Company;