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
  ChevronRight
} from "lucide-react";

const employees = [
  {
    id: 1,
    name: "account check",
    email: "account123@gmail.com",
    avatar: "AC",
    team: "Leadership",
    roles: ["Spender", "Accountant"],
    status: "Active",
    project: "Select"
  },
  {
    id: 2,
    name: "Heena QA",
    email: "accountant@gmail.com", 
    avatar: "HQ",
    team: "Engineering",
    roles: ["Spender", "Accountant"],
    status: "Active",
    project: "Project 1"
  },
  {
    id: 3,
    name: "Passcode",
    email: "akarshtr00+2022@gmail.com",
    avatar: "P",
    team: "Team1",
    roles: ["Spender", "Team leader"],
    status: "Active", 
    project: "Select"
  },
  {
    id: 4,
    name: "Akarsh block account",
    email: "akarshtr00+blc@gmail.com",
    avatar: "A",
    team: "Finance",
    roles: ["Spender", "Team leader"],
    status: "Yet To Register",
    project: "Select"
  },
  {
    id: 5,
    name: "Max Eng TL",
    email: "akarshtr00+eng-tl@gmail.com",
    avatar: "MT",
    team: "Team1",
    roles: ["Spender", "Team leader"],
    status: "Yet To Register",
    project: "Select"
  }
];

const Company = () => {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <span className="mr-2">ℹ️</span>
              Learn More
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Employees
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2 bg-muted">
            <TabsTrigger value="employees" className="data-[state=active]:bg-primary/20 hover:bg-primary/20">
              Employees
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary/20 hover:bg-primary/20">
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Notification Banner */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">
                  23 Employees are not using Alaan cards.
                </span>
              </div>
              <Button variant="outline" size="sm" className="bg-background">
                <Send className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search employees"
                    className="pl-10 w-80 bg-background"
                  />
                </div>
                <Button variant="outline" size="sm" className="bg-background">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="bg-background">
                  <Filter className="w-4 h-4 mr-2" />
                  Add Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-background">
                  <Columns3 className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Disabled Users</span>
                <div className="w-8 h-4 bg-muted rounded-full relative">
                  <div className="w-3 h-3 bg-background rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="border rounded-lg bg-background">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-medium text-muted-foreground">Employee</TableHead>
                    <TableHead className="font-medium text-muted-foreground">Teams</TableHead>
                    <TableHead className="font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="font-medium text-muted-foreground">Project</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                              {employee.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          {employee.team}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {employee.roles.map((role, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs bg-background mr-1"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={employee.status === "Active" ? "default" : "secondary"}
                          className={employee.status === "Active" 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-orange-100 text-orange-700 border-orange-200"
                          }
                        >
                          {employee.status}
                        </Badge>
                        {employee.status === "Yet To Register" && (
                          <Send className="w-3 h-3 ml-2 inline text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{employee.project}</span>
                          {employee.project === "Project 1" && (
                            <span className="text-xs text-muted-foreground">Allow cardholder to edit</span>
                          )}
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
                Showing 1-10 of 387 rows
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">1 of 39</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">10 rows per page</span>
                  <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                    ⌄
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="text-center py-12 text-muted-foreground">
              Teams content coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Company;