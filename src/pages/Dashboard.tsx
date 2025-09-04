import { DashboardLayout } from "@/components/DashboardLayout";
import { WalletCard } from "@/components/WalletCard";
import { StatCard } from "@/components/StatCard";
import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, PlusCircle } from "lucide-react";

const Dashboard = () => {
  const wallets = [
    {
      name: "Primary Wallet",
      balance: "AED 0.00",
      status: "Low Funds" as const
    },
    {
      name: "abcd*$(*7)-img ...",
      balance: "AED 1.00",
      status: "Low Funds" as const
    },
    {
      name: "approvalBased",
      balance: "AED 33.00",
      status: "Low Funds" as const
    },
    {
      name: "DayLimit",
      balance: "AED 5.00",
      status: "Low Funds" as const
    }
  ];

  const employeeStats = [
    { label: "Active Employees", value: 92, color: "#8B5CF6" },
    { label: "Yet to register", value: 17, color: "#C4B5FD" },
    { label: "Employees without card", value: 63, color: "#E9D5FF" },
    { label: "Deactivated Employees", value: 1, color: "#F3E8FF" }
  ];

  const cardStats = [
    { label: "Active cards", value: 59, color: "#8B5CF6" },
    { label: "Awaiting address confirmation", value: 1, color: "#C4B5FD" },
    { label: "Pending activation", value: 29, color: "#E9D5FF" },
    { label: "Frozen", value: 2, color: "#F3E8FF" }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, heena 👋
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              Manage Funds
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button className="bg-destructive hover:bg-destructive/90">
              Actions Required
              <span className="ml-2 bg-white text-destructive rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                1
              </span>
            </Button>
          </div>
        </div>

        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wallets.map((wallet, index) => (
            <WalletCard
              key={index}
              name={wallet.name}
              balance={wallet.balance}
              status={wallet.status}
              icon={<CreditCard className="w-5 h-5 text-primary" />}
            />
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatCard
            title="Employees"
            actionLabel="Invite"
            actionIcon={<PlusCircle className="w-4 h-4 mr-2" />}
            stats={employeeStats}
            notice={{
              text: "23 Employees are not using Alaan cards.",
              action: "Send Reminders"
            }}
          />
          
          <StatCard
            title="Cards"
            actionLabel="Create New"
            actionIcon={<PlusCircle className="w-4 h-4 mr-2" />}
            stats={cardStats}
          />
        </div>

        {/* Key Process Metrics */}
        <MetricsCard
          title="Key Process Metrics"
          dateRange="Feb 07, 2025 - Sep 04, 2025 📅"
        />

        {/* Help & Support */}
        <div className="pt-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <span className="mr-2">💬</span>
            Help & Support
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;