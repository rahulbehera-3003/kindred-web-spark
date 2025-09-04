import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  CreditCard,
  Plus,
  HelpCircle,
  Settings,
  Building,
  Gift
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CardData {
  id: number;
  employee: string;
  team: string;
  cardNumber: string;
  cardType: string;
  status: string;
  wallet: string;
  walletStatus: string;
  cardLimit: string;
  limitType: string;
  cardBalance: string;
  balanceStatus: string;
}

const Cards = () => {
  const navigate = useNavigate();
  const [companyCards, setCompanyCards] = useState<CardData[]>([]);
  const [employeeBenefitCards, setEmployeeBenefitCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      // Fetch teams and users with cards
      const teamsResponse = await (supabase as any).from('teams').select('*');
      const { data: teams } = teamsResponse;

      if (teams && teams.length > 0) {
        const allCardData: CardData[] = [];

        for (const team of teams) {
          const { data: users } = await (supabase as any)
            .from('hrms_users')
            .select('*')
            .eq('team', team.name)
            .eq('is_added', true);

          if (users && users.length > 0) {
            for (const user of users) {
              const { data: cards } = await (supabase as any)
                .from('cards')
                .select('*')
                .eq('user_id', user.id);

              if (cards && cards.length > 0) {
                cards.forEach((card: any) => {
                  const cardData: CardData = {
                    id: card.id,
                    employee: user.name || 'Unknown',
                    team: user.team || 'No Team',
                    cardNumber: card.card_no ? `***${card.card_no.slice(-4)}` : '---',
                    cardType: card.card_type || 'Virtual | Work Related Expenses',
                    status: Math.random() > 0.5 ? 'Activated' : 'Not Activated',
                    wallet: card.card_type === 'company' ? 'Primary Wallet' : 'HeenaCorp-SubWallet',
                    walletStatus: 'Active',
                    cardLimit: `AED ${Math.floor(Math.random() * 100000) + 100}`,
                    limitType: Math.random() > 0.5 ? 'monthly' : 'daily',
                    cardBalance: `AED ${Math.floor(Math.random() * 50000) + 100} Available`,
                    balanceStatus: 'today'
                  };

                  // Categorize cards based on type
                  if (card.card_type === 'company' || !card.card_type) {
                    allCardData.push({ ...cardData, wallet: 'Primary Wallet' });
                  } else {
                    allCardData.push({ ...cardData, wallet: 'Monthly Limit' });
                  }
                });
              } else {
                // Add users without cards with placeholder data
                const cardData: CardData = {
                  id: user.id,
                  employee: user.name || 'Unknown',
                  team: user.team || 'No Team',
                  cardNumber: '---',
                  cardType: 'Virtual | Work Related Expenses',
                  status: 'Not Activated',
                  wallet: 'Primary Wallet',
                  walletStatus: 'Active',
                  cardLimit: 'AED 100',
                  limitType: 'daily',
                  cardBalance: 'AED 100 Available',
                  balanceStatus: 'today'
                };
                allCardData.push(cardData);
              }
            }
          }
        }

        // Split cards into company and employee benefit categories
        const companyCardData = allCardData.slice(0, Math.ceil(allCardData.length / 2));
        const benefitCardData = allCardData.slice(Math.ceil(allCardData.length / 2));

        setCompanyCards(companyCardData);
        setEmployeeBenefitCards(benefitCardData);
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activated':
        return 'text-green-600';
      case 'not activated':
        return 'text-orange-500';
      case 'active':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const CardTable = ({ cards, type }: { cards: CardData[], type: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{type} Overview</h3>
        <div className="flex items-center gap-2">
          {type === "Employee Benefit Cards" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/employee-benefits-automation")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
          <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-6">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary/50"
                  onClick={() => {
                    setIsAddCardDialogOpen(false);
                    navigate('/create-company-card');
                  }}
                >
                  <Building className="w-6 h-6 text-primary" />
                  <span className="font-medium">Company Card</span>
                  <span className="text-xs text-muted-foreground">For business expenses</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary/50"
                  onClick={() => {
                    setIsAddCardDialogOpen(false);
                    navigate('/create-employee-benefit-card');
                  }}
                >
                  <Gift className="w-6 h-6 text-primary" />
                  <span className="font-medium">Employee Benefit Card</span>
                  <span className="text-xs text-muted-foreground">For employee benefits</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="font-semibold">Card Details</TableHead>
              <TableHead className="font-semibold">Wallet</TableHead>
              <TableHead className="font-semibold">Card Limit</TableHead>
              <TableHead className="font-semibold text-right">Card Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card, index) => (
              <TableRow key={card.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <TableCell className="py-4">
                  <div>
                    <div className="font-medium text-foreground">{card.employee}</div>
                    <div className="text-sm text-muted-foreground">{card.team}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{card.cardNumber}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(card.status)}`}
                      >
                        {card.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{card.cardType}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div>
                    <div className="font-medium text-foreground">{card.wallet}</div>
                    <Badge variant="outline" className="text-xs text-green-600 mt-1">
                      {card.walletStatus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div>
                    <div className="font-medium text-foreground">{card.cardLimit}</div>
                    <div className="text-sm text-muted-foreground">{card.limitType}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div>
                    <div className="font-medium text-foreground">{card.cardBalance}</div>
                    <div className="text-sm text-muted-foreground">{card.balanceStatus}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading card details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Card Management</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Manage company cards and employee benefit cards across all teams
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>

        {/* Card Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-xl font-bold">{companyCards.length + employeeBenefitCards.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cards</p>
                <p className="text-xl font-bold text-green-600">
                  {[...companyCards, ...employeeBenefitCards].filter(card => card.status === 'Activated').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Activation</p>
                <p className="text-xl font-bold text-orange-500">
                  {[...companyCards, ...employeeBenefitCards].filter(card => card.status === 'Not Activated').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company Cards</p>
                <p className="text-xl font-bold text-blue-600">{companyCards.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Tabs */}
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2 bg-muted">
            <TabsTrigger value="company" className="data-[state=active]:bg-background">
              Company Card
            </TabsTrigger>
            <TabsTrigger value="employee" className="data-[state=active]:bg-background">
              Employee Benefit Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <CardTable cards={companyCards} type="Company Cards" />
          </TabsContent>

          <TabsContent value="employee" className="space-y-4">
            <CardTable cards={employeeBenefitCards} type="Employee Benefit Cards" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Cards;