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
  Users
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
            <TabsTrigger value="employees" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              Employees
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-transparent hover:bg-primary/20">
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Empty State */}
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
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
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