import { 
  Home, 
  Calculator, 
  CreditCard, 
  Users, 
  Building, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Settings, 
  HelpCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Calculator, label: "Accounting", path: "/accounting" },
  { icon: CreditCard, label: "Expenses", path: "/expenses" },
  { icon: Zap, label: "Alaan Drop", path: "/alaan-drop" },
  { icon: Building, label: "Company", path: "/company" },
  { icon: UserCheck, label: "Employee Hub", path: "/employee-hub" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: FileText, label: "Bills", path: "/bills", badge: "New" },
  { icon: FileText, label: "Statements", path: "/statements" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "What's new", path: "/whats-new" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "عربي" }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    navigate(item.path);
  };

  return (
    <div className="w-64 h-screen bg-dashboard-sidebar text-dashboard-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dashboard-sidebar-muted">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl">ALAAN</span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 border-b border-dashboard-sidebar-muted">
        <div className="flex gap-2">
          {languages.map((lang) => (
            <Button 
              key={lang.code}
              variant="ghost" 
              size="sm"
              className={cn(
                "text-dashboard-sidebar-foreground hover:bg-dashboard-sidebar-muted",
                lang.code === "en" && "bg-dashboard-sidebar-muted"
              )}
            >
              {lang.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => handleMenuClick(item)}
            className={cn(
              "w-full justify-start px-6 py-3 text-dashboard-sidebar-foreground hover:bg-dashboard-sidebar-muted rounded-none",
              location.pathname === item.path && "bg-transparent text-primary border-l-2 border-primary"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-dashboard-sidebar-muted">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-medium">H</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Heena Co...</div>
            <div className="text-xs text-muted-foreground">heena</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          💰 Earn 2,500 AED
        </div>
      </div>
    </div>
  );
};